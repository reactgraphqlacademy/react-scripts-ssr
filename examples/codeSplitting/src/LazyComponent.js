import React from "react";
import { Link } from "react-router-dom";

const LazyComponent = () => (
  <>
    <h1>I'm a lazy component</h1>
    <Link to="/">Go home</Link>
  </>
);

export default LazyComponent;
