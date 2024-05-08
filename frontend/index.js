import React from "react";
import reactDom from "react-dom";
import App from "./src/App";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import 'aos/dist/aos.css';
import "./index.css";

reactDom.render(<App />, document.getElementById("root"));