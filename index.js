module.exports = {
  render: require("./src/render").default,
  createSSRMiddleware: require("./src/middlewares").createSSRMiddleware
};
