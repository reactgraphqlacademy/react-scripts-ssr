const path = require("path");
const fs = require("fs");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
  serverBuild: resolveApp("build-server"),
  serverIndexJs: resolveApp("src/server.js"),
  customScriptConfig: resolveApp(".react-scripts-ssr.json")
};
