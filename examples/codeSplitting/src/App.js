import React, { Component, Suspense } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
const LazyComponent = React.lazy(() => import("./LazyComponent"));

class App extends Component {
  render() {
    return (
      <Router>
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
                  <Link to="/lazy">Get lazy></Link>
                  <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn React1
                  </a>
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
      </Router>
    );
  }
}

export default App;
