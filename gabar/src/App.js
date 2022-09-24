import React, { Component } from "react";
import FORMAPI from "./api";
import { Routes, Router, Route } from "react-router-dom";
import Form from './form'
class App extends Component {
  render() {
    return (
      <React.Fragment>
      <Form/>
      </React.Fragment>
    );
  }
}

export default App;
