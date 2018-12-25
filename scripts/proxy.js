const httpProxy = require("http-proxy");
const http = require("http");
const fs = require("fs");
const program = require("commander");
const pathCustomConfig = "./.react-scripts-ssr.json";
const openBrowser = require("react-dev-utils/openBrowser");

program
  .version("0.1.0")
  .option(
    "-wh, --web-host [webHost]",
    "Add web host where the target website runs. localhost by default"
  )
  .option(
    "-wp, --web-port [webPort]",
    "Add web host where the target website runs. 3000 by default"
  )
  .option(
    "-au, --api-url [apiUrl]",
    "Add API url where the target API runs. http://localhost:8080 by default"
  )
  .option(
    "-pp, --proxy-port [proxyPort]",
    "Add proxy port where the proxy will be listening to. 5050 by default"
  )
  .option(
    "-ph, --proxy-host [proxyHost]",
    "Add proxy host where the proxy will be listening to. localhost by default"
  )
  .parse(process.argv);

let customHttpProxyConfig = { proxy: {} };
try {
  if (fs.existsSync(pathCustomConfig)) {
    customConfig = JSON.parse(fs.readFileSync(pathCustomConfig));
    if (customConfig.proxy) {
      customHttpProxyConfig = customConfig;
    }
  }
} catch (error) {
  console.log(
    "react-scripts-ssr custom proxy config was not loaded. Are you sure .react-scripts-ssr.json is a JSON with a key called 'proxy'?"
  );
}

const WEB_HOST =
  program.webHost || customHttpProxyConfig.proxy.webHost || "localhost";
const WEB_PORT =
  program.webPort || customHttpProxyConfig.proxy.webPort || "3000";
const WEB_URL = `http://${WEB_HOST}:${WEB_PORT}`;
const API_URL =
  program.apiUrl ||
  customHttpProxyConfig.proxy.apiUrl ||
  "http://localhost:8080";
const PROXY_PORT =
  program.proxyPort || customHttpProxyConfig.proxy.proxyPort || 5050;
const PROXY_HOST =
  program.proxyHost || customHttpProxyConfig.proxy.proxyHost || "localhost";

const proxy = httpProxy.createProxyServer({
  ws: true,
  ...customHttpProxyConfig.proxy
});

var server = http.createServer((req, res) => {
  try {
    const host = req.headers.host.split(":")[0];
    if (host.startsWith("api") || req.url.startsWith("/api")) {
      proxy.web(req, res, {
        target: API_URL
      });
    } else {
      proxy.web(req, res, {
        target: WEB_URL,
        ws: true
      });
    }
  } catch (error) {
    console.log("there was an error in the proxy", error);
  }
});

proxy.on("error", (err, req, res) => {});

server.on("upgrade", (req, socket, head) => {
  proxy.ws(req, socket, head);
});

server.listen(PROXY_PORT, PROXY_HOST, function() {
  const proxyUrl = `http://${PROXY_HOST}:${PROXY_PORT}`;
  console.log(
    `Proxy listening on ${proxyUrl} to web ${WEB_URL} ${
      API_URL ? ` and API ${API_URL}` : ""
    }`
  );
  openBrowser(proxyUrl);
});
