<h1 align="center">bhttp-js</h1>

<div align="center">

[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/bhttp/mod.ts)
![Browsers CI](https://github.com/dajiaji/bhttp-js/actions/workflows/ci_browsers.yml/badge.svg)
![Node.js CI](https://github.com/dajiaji/bhttp-js/actions/workflows/ci_node.yml/badge.svg)
![Deno CI](https://github.com/dajiaji/bhttp-js/actions/workflows/ci.yml/badge.svg)
![Cloudflare Workers CI](https://github.com/dajiaji/bhttp-js/actions/workflows/ci_cloudflare.yml/badge.svg)
![@fastly/js-compute CI](https://github.com/dajiaji/bhttp-js/actions/workflows/ci_fastly.yml/badge.svg)
![bun CI](https://github.com/dajiaji/bhttp-js/actions/workflows/ci_bun.yml/badge.svg)
[![codecov](https://codecov.io/gh/dajiaji/bhttp-js/branch/main/graph/badge.svg?token=7I7JGKDDJ2)](https://codecov.io/gh/dajiaji/bhttp-js)

</div>

<div align="center">
A <a href="https://datatracker.ietf.org/doc/html/rfc9292">BHTTP (RFC9292: Binary Representation of HTTP Messages)</a> encoder and decoder written in TypeScript<br>for the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Request">Request</a>/<a href="https://developer.mozilla.org/en-US/docs/Web/API/Response">Response</a> interface of <a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API">Fetch API</a>.<br>
This module works on web browsers, Node.js, Deno and various other JavaScript runtimes.
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
  - [Cloudflare Workers](#cloudflare-workers)
- [Usage](#usage)
  - [Web Browser / Cloudflare Workers](#web-browser--cloudflare-workers)
  - [Node.js](#nodejs-1)
  - [Deno](#deno-1)
- [Contributing](#contributing)
- [References](#references)

## Supported Environments

- **Web browsers** which support
  [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request)/[Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)
  interface of
  [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
- **Node.js**: 18.x, 19.x, 20.x
- **Deno**: 1.x
- **bun**: 0.3-
- **Cloudflare Workers**
- **@fastly/js-compute**

## Installation

### Web Browser

Followings are how to use with typical CDNs. Other CDNs can be used as well.

Using esm.sh:

```html
<!-- use a specific version -->
<script type="module">
  import * as bhttp from "https://esm.sh/bhttp-js@0.3.2";
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
  import * as bhttp from "https://unpkg.com/bhttp-js@0.3.2/esm/mod.js";
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
import * as bhttp from "https://deno.land/x/bhttp@0.3.2/mod.ts";

// use the latest stable version
import * as bhttp from "https://deno.land/x/bhttp/mod.ts";
```

### Cloudflare Workers

Downloads a single js file from esm.sh:

```sh
curl -sS -o $YOUR_SRC_PATH/bhttp.js https://esm.sh/v86/bhttp-js@0.3.2/es2022/bhttp-js.js
# if you want to use a minified version:
curl -sS -o $YOUR_SRC_PATH/bhttp.min.js https://esm.sh/v86/bhttp-js@0.3.2/es2022/bhttp.min.js
```

Emits a single js file by using `deno bundle`:

```sh
deno bundle https://deno.land/x/bhttp@0.3.2/mod.ts > $YOUR_SRC_PATH/bhttp.js
```

## Usage

This section shows some typical usage examples.

### Web Browser / Cloudflare Workers

BHTTP client on Web Browser:

```js
<html>
  <head></head>
  <body>
    <script type="module">
      import { BHttpEncoder, BHttpDecoder } from 'https://esm.sh/bhttp-js@0.3.2';

      globalThis.doBHttp = async () => {

        try {
          const encoder = new BHttpEncoder();
          const req = new Request("https://target.example/query?foo=bar");
          const bReq = await encoder.encodeRequest(req);
          const res = await fetch("https://bin.example/to_target", {
            method: "POST",
            headers: {
              "Content-Type": "message/bhttp",
            },
            body: bReq,
          });

          const decoder = new BHttpDecoder();
          const decodedRes = decoder.decodeResponse(await res.arrayBuffer());
          // decodedRes.status === 200;
          const body = await decodedRes.text();
          // body === "baz"

        } catch (err) {
          alert(err.message);
        }
      }
      
    </script>
    <button type="button" onclick="doBHttp()">do BHTTP</button>
  </body>
</html>
```

BHTTP server on Cloutflare Workers:

```js
import { BHttpDecoder, BHttpEncoder } from "./bhttp.js";

export default {
  async fetch(request) {
    const decoder = new BHttpDecoder();
    const encoder = new BHttpEncoder();
    const url = new URL(request.url);

    if (url.pathname === "/to_target") {
      try {
        if (request.headers.get("content-type") !== "message/bhttp") {
          throw new Error("Invalid content-type.");
        }
        const reqBody = await request.arrayBuffer();
        const decodedReq = decoder.decodeRequest(reqBody);
        const res = new Response("baz", {
          headers: { "Content-Type": "text/plain" },
        });
        const bRes = await encoder.encodeResponse(res);
        return new Response(bRes, {
          headers: { "Content-Type": "message/bhttp" },
        });
      } catch (err) {
        return new Response(
          await encoder.encodeResponse(
            new Response(err.message, { status: 400 }),
          ),
          { status: 400, headers: { "Content-Type": "message/bhttp" } },
        );
      }
    }
    return new Response(
      await encoder.encodeResponse(new Response("", { status: 404 })),
      { status: 404, headers: { "Content-Type": "message/bhttp" } },
    );
  },
};
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
} from "https://deno.land/x/bhttp@0.3.2/mod.ts";

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
