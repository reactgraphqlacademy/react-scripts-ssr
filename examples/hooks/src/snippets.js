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

const compose = (...functions) => initialValues =>
  functions.reduceRight(
    (acc, currFunction) => currFunction(acc),
    initialValues
  );

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

const userThunk = ([state, dispatch]) => {
  const newDispatchRef = useRef(action => {
    if (typeof action === "function") {
      action(newDispatchRef.current);
    } else {
      dispatch(action);
    }
  });

  return [state, newDispatchRef.current];
};
