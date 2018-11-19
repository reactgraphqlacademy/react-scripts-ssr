// const reactScriptsPath = 'react-scripts'
const path = require('path');
const fs = require('fs');

// const paths = require(`${reactScriptsPath}/config/paths`);

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

// paths.serverBuild = resolveApp('build/server');
// paths.serverIndexJs = resolveApp('src/server/index.js');

module.exports = {
    serverBuild: resolveApp('build-server'),
    serverIndexJs: resolveApp('src/server.js'),
}