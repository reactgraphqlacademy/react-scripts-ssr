import React from "react";
import logo from "./logo.svg";
import "./App.css";
import withMousePosition from "./demo/withMousePosition";
import LoginForm from "./demo/LoginForm";

const toUpperCase = text => text.toUpperCase();

const removeSpaces = text => text.replace(/\s/g, "");

const removeNumbers = text => text.replace(/[0-9]/g, "");

const text = "1 2 3 composition is awesome";

// const formatedText = toUpperCase(removeSpaces(removeNumbers(text)));
const formatedText = text;

console.log(formatedText);

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>{JSON.stringify(this.props.mouse) || "No mouse :("}</p>
          <LoginForm />
        </header>
      </div>
    );
  }
}

export default App;
