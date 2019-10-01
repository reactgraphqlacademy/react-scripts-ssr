import React, { useReducer, useRef, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {JSON.stringify(this.props.mouse)}
          <LoginForm />
        </header>
      </div>
    );
  }
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_ERRORS":
      return {
        ...state,
        errors: action.payload
      };
    case "SET_FIELD_VALUE":
      return {
        ...state,
        values: {
          ...state.values,
          ...action.payload
        }
      };
    default:
      return state;
  }
}

const usePersist = ([state, dispatch]) => {
  useEffect(() => {
    localStorage.setItem("form", JSON.stringify(state));
  }, [state]);

  return [state, dispatch];
};

const userLogger = ([state, dispatch]) => {
  const newDispatchRef = useRef(action => {
    console.log("ex1 action", action);
    console.log("ex1 current state", state);
    dispatch(action);
  });

  useEffect(() => {
    console.log("ex1 new state is", state);
  }, [state]);

  return [state, newDispatchRef.current];
};

const compose = (...functions) => initialValues =>
  functions.reduceRight(
    (acc, currFunction) => currFunction(acc),
    initialValues
  );

const withMousePosition = Component => {
  return class ComponentWithMPosition extends React.Component {
    constructor() {
      super();
      this.state = { x: 0, y: 0 };
    }

    handleMouseMove = event => {
      this.setState({
        x: event.clientX,
        y: event.clientY
      });
    };

    render() {
      return (
        <div onMouseMove={this.handleMouseMove}>
          <Component {...this.props} mouse={this.state} />
        </div>
      );
    }
  };
};

function useForm(props) {
  const persistedState = localStorage.getItem("form");
  const initialState = persistedState
    ? JSON.parse(persistedState)
    : {
        values: props.initialValues,
        errors: {}
      };

  const [state, dispatch] = compose(
    userLogger,
    usePersist
  )(useReducer(reducer, initialState));

  // const [state, dispatch] = userLogger(
  //   useReducer(reducer, {
  //     values: props.initialValues,
  //     errors: {}
  //   })
  // );

  React.useEffect(() => {
    if (props.validate) {
      const errors = props.validate(state.values);
      dispatch({ type: "SET_ERRORS", payload: errors });
    }
  }, [state.values]);

  const handleChange = fieldName => event => {
    event.preventDefault();
    dispatch({
      type: "SET_FIELD_VALUE",
      payload: { [fieldName]: event.target.value }
    });
  };

  const handleSubmit = event => {
    event.preventDefault();
    const errors = props.validate(state.values);
    if (!Object.keys(errors).length) {
      props.onSubmit(state.values);
    }
  };

  const getFieldProps = fieldName => ({
    value: state.values[fieldName],
    onChange: handleChange(fieldName)
  });

  return { handleChange, handleSubmit, getFieldProps, ...state };
}

function LoginForm({
  initialValues = {
    password: "",
    username: ""
  }
}) {
  const form = useForm({
    initialValues: initialValues,
    onSubmit: async values => {
      alert(JSON.stringify(values, null, 2));
    },
    validate: values => {
      let errors = {};
      if (!values.password) {
        errors.password = "Password is required";
      }
      if (!values.username) {
        errors.username = "Username is required";
      }
      return errors;
    }
  });
  const { handleSubmit, getFieldProps, errors = {} } = form;
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <br />
        <input type="text" {...getFieldProps("username")} />
        {errors.username && (
          <div style={{ color: "red" }}>{errors.username}</div>
        )}
      </label>
      <br />
      <label>
        Password:
        <br />
        <input type="text" {...getFieldProps("password")} />
        {errors.password && (
          <div style={{ color: "red" }}>{errors.password}</div>
        )}
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
}

export default compose(withMousePosition)(App);
