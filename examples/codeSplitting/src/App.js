import React, { Component, Suspense } from "react";
import { Route, Link } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
const LazyComponent = React.lazy(() => import("./LazyComponent"));

class App extends Component {
  render() {
    return (
      <>
        <Route
          path="/"
          exact
          render={() => (
            <div className="App">
              <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                  Edit <code>src/App.js</code> and save to reload.
                </p>
                <Link className="App-link" to="/lazy">
                  Get lazy>
                </Link>
              </header>
            </div>
          )}
        />
        <Route
          path="/lazy"
          render={() => (
            <Suspense fallback={<i>Loading...</i>}>
              <LazyComponent />
            </Suspense>
          )}
        />
      </>
    );
  }
}

export default App;
