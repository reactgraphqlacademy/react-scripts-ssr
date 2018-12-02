import React from "react";
import { StaticRouter as Router } from "react-router-dom";
import App from "./App";
const express = require("express");
const { createSSRMiddleware } = require("react-scripts-ssr");
const { renderToString } = require("react-dom/server");

const server = express();

server.use(
  createSSRMiddleware((req, res, next) => {
    const body = renderToString(
      <Router location={req.url}>
        <App />
      </Router>
    );
    console.log("body", body);

    next({ body }, req, res);
  })
);

const PORT = process.env.REACT_APP_SERVER_SIDE_RENDERING_PORT || 8888;
server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
