import { useReducer, useRef, useEffect } from "react";
import reducer from "./reducer";
// import { compose } from "../App";

export const usePersist = ([state, dispatch]) => {
  useEffect(() => {
    localStorage.setItem("form", JSON.stringify(state));
  }, [state]);

  return [state, dispatch];
};

export const useLogger = ([state, dispatch]) => {
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

export function useForm(props) {
  const [state, dispatch] = useReducer(reducer, getIntialState(props));

  useEffect(() => {
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

function getIntialState(props) {
  const persistedState = localStorage.getItem("form");
  return persistedState
    ? JSON.parse(persistedState)
    : {
        values: props.initialValues,
        errors: {}
      };
}
