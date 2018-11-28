const express = require("express");
const path = require("path");
const proxy = require("http-proxy-middleware");
const render = require("./render");
const { Router } = express;

function renderMiddleware(payload, req, res, next) {
  render(payload, req, res, next);
}

function createSSRMiddleware(middleware) {
  const router = Router();
  if (process.env.NODE_ENV === "production") {
    router.use(
      "/static",
      express.static(path.join(process.cwd(), "build/static"))
    );
  } else {
    router.use(
      ["/static", "/sockjs-node"],
      proxy({
        target: `http://localhost:${process.env.REACT_APP_DEV_SERVER_PORT}`,
        ws: true
      })
    );
  }
  router.use(middleware);
  router.use(renderMiddleware);

  return router;
}

module.exports = {
  createSSRMiddleware
};
