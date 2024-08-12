<h1 align="center">bhttp-js</h1>

<div align="center">
<a href="https://jsr.io/@dajiaji/bhttp"><img src="https://jsr.io/badges/@dajiaji/bhttp" alt="JSR"/></a>
<a href="https://doc.deno.land/https/deno.land/x/bhttp/mod.ts"><img src="https://doc.deno.land/badge.svg" alt="deno doc"/></a>
<img src="https://github.com/dajiaji/bhttp-js/actions/workflows/ci_browsers.yml/badge.svg" alt="Browser CI" />
<img src="https://github.com/dajiaji/bhttp-js/actions/workflows/ci_node.yml/badge.svg" alt="Node.js CI" />
<img src="https://github.com/dajiaji/bhttp-js/actions/workflows/ci.yml/badge.svg" alt="Deno CI" />
<img src="https://github.com/dajiaji/bhttp-js/actions/workflows/ci_cloudflare.yml/badge.svg" alt="Cloudflare Workers CI" />
<img src="https://github.com/dajiaji/bhttp-js/actions/workflows/ci_fastly.yml/badge.svg" alt="@fastly/js-compute CI" />
<img src="https://github.com/dajiaji/bhttp-js/actions/workflows/ci_bun.yml/badge.svg" alt="bun CI" />
<a href="https://codecov.io/gh/dajiaji/bhttp-js">
  <img src="https://codecov.io/gh/dajiaji/bhttp-js/branch/main/graph/badge.svg?token=7I7JGKDDJ2" alt="codecov" />
</a>
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
  - [Deno](#deno)
  - [Node.js](#nodejs)
  - [Cloudflare Workers](#cloudflare-workers)
  - [Web Browser](#web-browser)
- [Usage](#usage)
  - [Deno](#deno-1)
  - [Node.js](#nodejs-1)
  - [Cloudflare Workers](#cloudflare-workers-1)
  - [Web Browser](#web-browser-1)
- [Contributing](#contributing)
- [References](#references)

## Supported Environments

- **Web browsers** which support
  [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request)/[Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)
  interface of
  [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
- **Node.js**: 18.x, 19.x, 20.x, 21.x, 22.x
- **Deno**: 1.x
- **bun**: 0.x, 1.x
- **Cloudflare Workers**
- **@fastly/js-compute**

## Installation

### Deno

Using jsr:

```sh
deno add @dajiaji/bhttp
```

```js
import * as bhttp from "@dajiaji/bhttp";
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

### Cloudflare Workers

Using jsr:

```sh
npx jsr add @dajiaji/bhttp
```

```js
import * as bhttp from "@dajiaji/bhttp";
```

### Web Browser

Followings are how to use with typical CDNs. Other CDNs can be used as well.

Using esm.sh:

```html
<!-- use a specific version -->
<script type="module">
  import * as bhttp from "https://esm.sh/bhttp-js@0.3.4";
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
  import * as bhttp from "https://unpkg.com/bhttp-js@0.3.4/esm/mod.js";
  // ...
</script>
```

## Usage

This section shows some typical usage examples.

### Deno

```js
import { BHttpDecoder, BHttpEncoder } from "@dajiaji/bhttp";

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

### Cloudflare Workers

BHTTP client on Web Browser:

```js
<html>
  <head></head>
  <body>
    <script type="module">
      import { BHttpEncoder, BHttpDecoder } from 'https://esm.sh/bhttp-js@0.3.4';

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

### Web Browser

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

## Contributing

We welcome all kind of contributions, filing issues, suggesting new features or
sending PRs.

## References

- [RFC9292: Binary Representation of HTTP Messages](https://datatracker.ietf.org/doc/html/rfc9292)
- [Fetch - Living Standard](https://fetch.spec.whatwg.org/)
- [MDN - Request](https://developer.mozilla.org/en-US/docs/Web/API/Request)
- [MDN - Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)
