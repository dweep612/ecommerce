import React from "react";
import ReactDOM from "react-dom";
import "./style.css";

import Routes from "./Routes";

function App() {
  return (
    <div className="center">
      <h1>Under Production</h1>
    </div>
  );
}

// ReactDOM.render(<App />, document.getElementById("root"));

ReactDOM.render(<Routes />, document.getElementById("root"));
