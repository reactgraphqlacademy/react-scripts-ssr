const path = require("path");
const fs = require("fs");

const injectHTML = (
  page,
  { html = "", title = "", meta = [], body = "", scripts = [], state } = {}
) => {
  let responsePage = page.replace("<html>", `<html ${html}>`);
  responsePage = responsePage.replace(/<noscript>[^]+<\/noscript>/g, "");
  responsePage = responsePage.replace(/<title>.*?<\/title>/g, title);
  responsePage = responsePage.replace("</head>", `${meta.join("")}</head>`);
  responsePage = responsePage.replace(
    '<div id="root"></div>',
    `<div id="root">${body}</div><script>window.__PRELOADED_STATE__ = ${state}</script>`
  );
  responsePage = responsePage.replace("</body>", scripts.join("") + "</body>");

  return responsePage;
};

async function render(pageData, req, res) {
  try {
    if (process.env.NODE_ENV === "development") {
      const fetch = require("node-fetch").default;
      const pageDevResponse = await fetch(
        `http://localhost:${process.env.REACT_APP_DEV_SERVER_PORT}`
      );
      const pageTemplate = await pageDevResponse.text();
      const page = injectHTML(pageTemplate, pageData);
      return res.send(page);
    } else {
      function getPageTemplate() {
        return new Promise((resolve, reject) => {
          // TODO cache the file
          function readFileCallback(err, pageTemplate) {
            if (err) {
              reject(err);
            }
            resolve(pageTemplate);
          }
          const indexHtmlPath = path.resolve(
            __dirname,
            "..",
            "..",
            "build",
            "index.html"
          );
          fs.readFile(indexHtmlPath, "utf8", readFileCallback);
        });
      }
      if (!global.__page_template) {
        global.__page_template = await getPageTemplate();
      }

      return res.send(injectHTML(global.__page_template, pageData));
    }
  } catch (error) {
    console.log(error);
    return res.status(404).end();
  }
}

module.exports = render;
