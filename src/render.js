const path = require("path")
const fs = require("fs")

const PRODUCTION_ENV = process.env.NODE_ENV === "production"

const productionInjectHTML = (page, { html = '', title = '', meta = [], body = '', scripts = [], state }, manifest) => {
    let responsePage = page.replace('<html>', `<html ${html}>`);
    responsePage = responsePage.replace(/<noscript>.*?<\/noscript>/g, title);
    responsePage = responsePage.replace(/<title>.*?<\/title>/g, title);
    responsePage = responsePage.replace('</head>', `${meta.join('')}</head>`);
    responsePage = responsePage.replace(
        '<div id="root"></div>',
        `<div id="root">${body}</div><script>window.__PRELOADED_STATE__ = ${state}</script>`
    );
    responsePage = responsePage.replace('</body>', scripts.join('') + '</body>');

    return responsePage;
};

const developmentInjectHTML = (page, { html = '', title = '', meta = [], body = '', scripts = [], state }) => {
    let responsePage = page.replace(
        '<div id="root"></div>',
        `<div id="root">${body}</div><script>window.__PRELOADED_STATE__ = ${state}</script>`
    );
    responsePage = responsePage.replace(/<noscript>[^]+<\/noscript>/g, '');
    return responsePage
};


async function render(pageData, req, res) {
    // pageData.scripts = pageData.scripts ?
    //     [...pageData.scripts, `<script type="text/javascript" src="/${manifest['main.js']}"></script>`] :
    //     [`<script type="text/javascript" src="/${manifest['main.js']}"></script>`]
    // pageData.meta = pageData.meta ? pageData.meta : []
    // pageData.meta = [...pageData.meta, `<link rel="stylesheet" type="text/css" href="${manifest['main.css']}">`]

    try {
        if (!PRODUCTION_ENV) {
            const fetch = require('node-fetch').default;
            const pageDevResponse = await fetch('http://localhost:3000')
            const pageTemplate = await pageDevResponse.text()
            const page = developmentInjectHTML(pageTemplate, pageData)
            return res.send(page);
        } else {
            function getPageTemplate() {
                return new Promise((resolve, reject) => {
                    function readFileCallback(err, pageTemplate) {
                        if (err) {
                            reject(err)
                        }
                        resolve(pageTemplate)
                    }
                    const indexHtmlPath = path.resolve(__dirname, '..', '..', 'build', 'index.html');
                    fs.readFile(indexHtmlPath, 'utf8', readFileCallback);
                })
            }
            if (!global.__page_template) {

                global.__page_template = await getPageTemplate()
            }

            return res.send(productionInjectHTML(global.__page_template, pageData));
        }
    } catch (error) {
        console.log(error)
        return res.status(404).end()
    }
}

module.exports = render