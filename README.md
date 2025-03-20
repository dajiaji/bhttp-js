<h1 align="center">bhttp-js</h1>

<div align="center">
<a href="https://jsr.io/@dajiaji/bhttp"><img src="https://jsr.io/badges/@dajiaji/bhttp" alt="JSR"/></a>
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

[Documentation](https://jsr.io/@dajiaji/bhttp/doc)

</div>

## Index

- [Supported Environments](#supported-environments)
- [Installation](#installation)
  - [Deno](#deno)
  - [Node.js](#nodejs)
  - [Bun](#bun)
  - [Cloudflare Workers](#cloudflare-workers)
  - [Web Browser](#web-browser)
- [Usage](#usage)
  - [Deno](#deno-1)
  - [Node.js](#nodejs-1)
  - [Bun](#bun-1)
  - [Cloudflare Workers](#cloudflare-workers-1)
  - [Web Browser](#web-browser-1)
- [Contributing](#contributing)
- [References](#references)

## Supported Environments

`bhttp-js` can be used in all JavaScript runtimes which support
[Request](https://developer.mozilla.org/en-US/docs/Web/API/Request)/[Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)
interface of
[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API):

- **Deno**: 1.x
- **Node.js**: 18.x, 19.x, 20.x, 21.x, 22.x, 23.x
- **Bun**: 0.x, 1.x
- **Cloudflare Workers**
- **@fastly/js-compute**
- **Web browsers**: Chrome, Edge, Firefox, Safari and so on.

## Installation

### Deno

Starting from version 0.3.4, `bhttp-js` is available from the
[JSR registry](https://jsr.io). From this version onwards, please use JSR import
instead of HTTPS import in Deno.

**JSR imoprt (recommended on `>=0.3.4`):**

Add `bhttp-js` package using the commands below:

```sh
deno add @dajiaji/bhttp
```

Then, you can use the module from code like this:

```js
import { BHttpDecoder, BHttpEncoder } from "@dajiaji/bhttp";
```

### Node.js

**Using npm, yarn or pnpm:**

```sh
npm install bhttp-js
yarn add bhttp-js
pnpm install bhttp-js
```

**Using jsr:**

```sh
npx jsr add @dajiaji/bhttp
yarn dlx jsr add @dajiaji/bhttp
pnpm dlx jsr add @dajiaji/bhttp
```

### Cloudflare Workers

**Using jsr:**

```sh
npx jsr add @dajiaji/bhttp
yarn dlx jsr add @dajiaji/bhttp
pnpm dlx jsr add @dajiaji/bhttp
```

### Bun

**Using jsr:**

```sh
bunx jsr add @dajiaji/bhttp
```

### Web Browser

Followings are how to use with typical CDNs. Other CDNs can be used as well.

**Using esm.sh:**

```html
<!-- use a specific version -->
<script type="module">
  import {
    BHttpDecoder,
    BhttpEncoder,
  } from "https://esm.sh/bhttp-js@<SEMVER>";
  // ...
</script>

<!-- use the latest stable version -->
<script type="module">
  import { BHttpDecoder, BhttpEncoder } from "https://esm.sh/bhttp-js";
  // ...
</script>
```

**Using unpkg:**

```html
<!-- use a specific version -->
<script type="module">
  import {
    BHttpDecoder,
    BhttpEncoder,
  } from "https://unpkg.com/bhttp-js@<SEMVER>/esm/mod.js";
  // ...
</script>
```

## Usage

This section shows some typical usage examples.

### Deno

See [samples/deno](./samples/deno/).

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

See [samples/node](./samples/node/).

### Bun

See [samples/bun](./samples/bun/).

### Cloudflare Workers

See [samples/cloudflare](./samples/cloudflare/).

### Web Browser

BHTTP client on Web Browser:

```html
<html>
  <head></head>
  <body>
    <script type="module">
      import {
        BHttpDecoder,
        BHttpEncoder,
      } from "https://esm.sh/bhttp-js@<SEMVER>";

      globalThis.doBHttp = async () => {
        try {
          const encoder = new BHttpEncoder();
          const req = new Request(
            "https://target.example/query?foo=bar",
          );
          const bReq = await encoder.encodeRequest(req);
          const res = await fetch("https://bin.example/to_target", {
            method: "POST",
            headers: {
              "Content-Type": "message/bhttp",
            },
            body: bReq,
          });

          const decoder = new BHttpDecoder();
          const decodedRes = decoder.decodeResponse(
            await res.arrayBuffer(),
          );
          // decodedRes.status === 200;
          const body = await decodedRes.text();
          // body === "baz"
        } catch (err) {
          alert(err.message);
        }
      };
    </script>
    <button type="button" onclick="doBHttp()">do BHTTP</button>
  </body>
</html>
```

## Contributing

We welcome all kind of contributions, filing issues, suggesting new features or
sending PRs.

## References

- [RFC9292: Binary Representation of HTTP Messages](https://datatracker.ietf.org/doc/html/rfc9292)
- [Fetch - Living Standard](https://fetch.spec.whatwg.org/)
- [MDN - Request](https://developer.mozilla.org/en-US/docs/Web/API/Request)
- [MDN - Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)
