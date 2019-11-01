import React from "react";
import "./App.css";
import Board from "./components/Board";
import Mode from "./components/Mode";
import { Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Route exact path="/" component={Mode} />
      <Route exact path="/Board/:mode" component={Board} />
    </div>
  );
}

export default App;
