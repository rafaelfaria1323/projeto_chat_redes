import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import "animate.css";

ReactDOM.render(
  <React.StrictMode>
    <ReactNotification />
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
