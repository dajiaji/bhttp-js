<h1 align="center">bhttp-js</h1>

<div align="center">

[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/bhttp/mod.ts)
![Browser CI](https://github.com/dajiaji/bhttp-js/actions/workflows/ci_browser.yml/badge.svg)
![Node.js CI](https://github.com/dajiaji/bhttp-js/actions/workflows/ci_node.yml/badge.svg)
![Deno CI](https://github.com/dajiaji/bhttp-js/actions/workflows/ci.yml/badge.svg)
[![codecov](https://codecov.io/gh/dajiaji/bhttp-js/branch/main/graph/badge.svg?token=7I7JGKDDJ2)](https://codecov.io/gh/dajiaji/bhttp-js)

</div>

<div align="center">
A <a href="https://datatracker.ietf.org/doc/html/rfc9292">BHTTP (RFC9292: Binary Representation of HTTP Messages)</a> Encoder and Decoder written in TypeScript for <a href="https://developer.mozilla.org/en-US/docs/Web/API/Request">Request</a>/<a href="https://developer.mozilla.org/en-US/docs/Web/API/Response">Response</a> interface of the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API">Fetch API</a>.
This module works on web browsers, Node.js and Deno.
</div>

<p></p>

<div align="center">

[Documentation](https://doc.deno.land/https://deno.land/x/bhttp/mod.ts)

</div>

## Index

- [Supported Environments](#supported-environments)
- [Installation](#installation)
  - [Web Browser](#web-browser)
  - [Node.js](#nodejs)
  - [Deno](#deno)
- [Usage](#usage)
  - [Web Browser](#web-browser-1)
  - [Node.js](#nodejs-1)
  - [Deno](#deno-1)
- [Contributing](#contributing)
- [References](#references)

## Supported Environments

- **Web browsers**
- **Node.js**: 18.x, 19.x
- **Deno**: 1.x

## Installation

### Web Browser

Followings are how to use with typical CDNs. Other CDNs can be used as well.

Using esm.sh:

```html
<!-- use a specific version -->
<script type="module">
  import * as bhttp from "https://esm.sh/bhttp-js@0.1.1";
  // ...
</script>

<!-- use the latest stable version -->
<script type="module">
  import * as bhttp from "https://esm.sh/bhttp-js";
  // ...
</script>
```

Using unpkg:

```html
<!-- use a specific version -->
<script type="module">
  import * as bhttp from "https://unpkg.com/bhttp-js@0.1.1/esm/mod.js";
  // ...
</script>
```

### Node.js

Using npm:

```sh
npm install bhttp-js
```

Using yarn:

```sh
yarn add bhttp-js
```

### Deno

Using deno.land:

```js
// use a specific version
import * as bhttp from "https://deno.land/x/bhttp@v0.1.1/mod.ts";

// use the latest stable version
import * as bhttp from "https://deno.land/x/bhttp/mod.ts";
```

## Usage

This section shows some typical usage examples.

### Web Browser

```js
<html>
  <head></head>
  <body>
    <script type="module">
      import { BHttpEncoder, BHttpDecoder } from './src/mod.js';

      globalThis.doBHttp = async () => {

        try {
          const req = new Request("https://www.example.com/hello.txt", {
            method: "GET",
            headers: {
              "Accept-Language": "en, mi",
            },
          });

          // Decode a Request object to a BHTTP binary string.
          const encoder = new BHttpEncoder();
          const binReq = await encoder.encodeRequest(req);

          // Decode the BHTTP binary string to a Request object.
          const decoder = new BHttpDecoder();
          const decodedReq = decoder.decodeRequest(binReq);

        } catch (err) {
          alert(err.message);
        }
      }
      
    </script>
    <button type="button" onclick="doBHttp()">do BHTTP</button>
  </body>
</html>
```

### Node.js

```js
const { BHttpEncoder, BHttpDecoder } = require("bhttp-js");

async function doBHttp() {
  const req = new Request("https://www.example.com/hello.txt", {
    method: "GET",
    headers: {
      "User-Agent": "curl/7.16.3 libcurl/7.16.3 OpenSSL/0.9.7l zlib/1.2.3",
      "Accept-Language": "en, mi",
    },
  });

  // Encode a Request object to a BHTTP binary string.
  const encoder = new BHttpEncoder();
  const binReq = await encoder.encodeRequest(req);

  // Decode the BHTTP binary string to a Request object.
  const decoder = new BHttpDecoder();
  const decodedReq = decoder.decodeRequest(binReq);
}

doBHttp();
```

### Deno

```js
import {
  BHttpDecoder,
  BHttpEncoder,
} from "https://deno.land/x/bhttp@v0.1.1/mod.ts";

const req = new Request("https://www.example.com/hello.txt", {
  method: "GET",
  headers: {
    "User-Agent": "curl/7.16.3 libcurl/7.16.3 OpenSSL/0.9.7l zlib/1.2.3",
    "Accept-Language": "en, mi",
  },
});

// Encode a Request object to a BHTTP binary string.
const encoder = new BHttpEncoder();
const binReq = await encoder.encodeRequest(req);

// Decode the BHTTP binary string to a Request object.
const decoder = new BHttpDecoder();
const decodedReq = decoder.decodeRequest(binReq);
```

## Contributing

We welcome all kind of contributions, filing issues, suggesting new features or
sending PRs.

## References

- [RFC9292: Binary Representation of HTTP Messages](https://datatracker.ietf.org/doc/html/rfc9292)
- [Fetch - Living Standard](https://fetch.spec.whatwg.org/)
- [MDN - Request](https://developer.mozilla.org/en-US/docs/Web/API/Request)
- [MDN - Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)