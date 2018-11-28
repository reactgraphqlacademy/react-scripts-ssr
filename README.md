# react-scripts-ssr

Create React apps with server-side rendering (SSR) with no configuration

# Installation

`npm install react-scripts-ssr --save-dev`

# Getting started

## Steps

### Step 1

In the scripts section of your package.json:

- Replace `"start": "react-scripts start"` with `"start": "react-scripts-ssr start",`
- Add `"build-server": "react-scripts-ssr build-server",`

### Step 2

- `npm install express --save`
- Create the following file in src/server.js

```javascript
const React = require("react");
const express = require("express");
const { createSSRMiddleware } = require("react-scripts-ssr");
const { renderToString } = require("react-dom/server");
import App from "./App";

const server = express();

server.use(
  createSSRMiddleware((req, res, next) => {
    const body = renderToString(<App />);
    next({ body }, req, res);
  })
);

const PORT = process.env.REACT_APP_SERVER_SIDE_RENDERING_PORT || 8888;
server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
```

You can edit the server.js file with your custom code and other middlewares.

### Step 3

`npm start`

## Caveats

It only works with Create React App version 2
