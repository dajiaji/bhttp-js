import { assertEquals } from "testing/asserts.ts";
import { describe, it } from "testing/bdd.ts";

import { BHttpEncoder } from "../src/encoder.ts";
import { BHttpDecoder } from "../src/decoder.ts";

const isBrowser = () => typeof window !== "undefined";

const isCloudflareWorkers = () => typeof caches !== "undefined";

async function loadCrypto(): Promise<Crypto> {
  if (isBrowser() || isCloudflareWorkers()) {
    if (globalThis.crypto !== undefined) {
      return globalThis.crypto;
    }
    // jsdom
  }
  try {
    const { webcrypto } = await import("crypto"); // node:crypto
    return (webcrypto as unknown as Crypto);
  } catch (_e: unknown) {
    throw new Error("Web Cryptograph API not supported");
  }
}

describe("BHttpDecoder/Encoder", () => {
  describe("GET", () => {
    it("should encode and decode a GET request.", async () => {
      const req = new Request("https://www.example.com/hello.txt", {
        method: "GET",
        headers: {
          "User-Agent": "curl/7.16.3 libcurl/7.16.3 OpenSSL/0.9.7l zlib/1.2.3",
          "Accept-Language": "en, mi",
        },
      });
      // Decode a Request object to a BHTTP binary string.
      const encoder = new BHttpEncoder();
      const binReq = await encoder.encodeRequest(req);

      // Decode the BHTTP binary string to a Request object.
      const decoder = new BHttpDecoder();
      let decodedReq = decoder.decodeRequest(binReq);
      // ArrayBuffer is also supported.
      decodedReq = decoder.decodeRequest(binReq.buffer);

      const cryptoApi = await loadCrypto();
      // const jwkKey = {
      //   kty: "EC",
      //   crv: "P-384",
      //   // hkc: [0x0011, 0x0002, 0x0001],
      //   alg: "HPKEv1-Base-DHKEM(P384,HKDF-SHA384)-HKDF-SHA384-AES128GCM",
      //   // alg: "xxxx",
      //   // d: "wouCtU7Nw4E8_7n5C1-xBjB4xqSb_liZhYMsy8MGgxUny6Q8NCoH9xSiviwLFfK_",
      //   ext: true,
      //   key_ops: ["deriveBits"],
      //   x: "SzrRXmyI8VWFJg1dPUNbFcc9jZvjZEfH7ulKI1UkXAltd7RGWrcfFxqyGPcwu6AQ",
      //   y: "hHUag3OvDzEr0uUQND4PXHQTXP5IDGdYhJhL-WLKjnGjQAw0rNGy5V29-aV-yseW",
      // };
      const jwkKey = {
        kty: "OKP",
        crv: "X25519",
        kid: "X25519-01",
        alg: "HPKEv1-Base-DHKEM(P384,HKDF-SHA384)-HKDF-SHA384-AES128GCM",
        // hkc: [0x0011, 0x0002, 0x0001],
        x: "y3wJq3uXPHeoCO4FubvTc7VcBuqpvUrSvU6ZMbHDTCI",
        // d: "vsJ1oX5NNi0IGdwGldiac75r-Utmq3Jq4LGv48Q_Qc4",
        ext: true,
        key_ops: ["deriveBits"],
      };

      const _k = await cryptoApi.subtle.importKey(
        "jwk",
        jwkKey,
        {
          name: "ECDH",
          namedCurve: "P-384",
        },
        true,
        [],
      );

      // assert
      assertEquals(
        decodedReq.headers.get("user-agent"),
        "curl/7.16.3 libcurl/7.16.3 OpenSSL/0.9.7l zlib/1.2.3",
      );
      assertEquals(decodedReq.headers.get("accept-language"), "en, mi");
    });
  });

  describe("POST", () => {
    it("should encode and decode a POST request.", async () => {
      const req = new Request("https://www.example.com/hello.txt", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: "Hello world!",
      });
      const encoder = new BHttpEncoder();
      const binReq = await encoder.encodeRequest(req);

      const decoder = new BHttpDecoder();
      const decodedReq = decoder.decodeRequest(binReq);

      // assert
      assertEquals(decodedReq.method, "POST");
      assertEquals(decodedReq.headers.get("content-type"), "text/plain");
      assertEquals(decodedReq.url, "https://www.example.com/hello.txt");
      const body = await decodedReq.text();
      assertEquals(body, "Hello world!");
    });

    it("should encode and decode a POST request with string[][] headers.", async () => {
      const req = new Request("https://www.example.com/hello.txt", {
        method: "POST",
        headers: [["Content-Type", "text/plain"]],
        body: "Hello world!",
      });
      const encoder = new BHttpEncoder();
      const binReq = await encoder.encodeRequest(req);

      const decoder = new BHttpDecoder();
      const decodedReq = decoder.decodeRequest(binReq);

      // assert
      assertEquals(decodedReq.method, "POST");
      assertEquals(decodedReq.headers.get("content-type"), "text/plain");
      assertEquals(decodedReq.url, "https://www.example.com/hello.txt");
      const body = await decodedReq.text();
      assertEquals(body, "Hello world!");
    });

    it("should encode and decode a POST request with HeadersInit headers.", async () => {
      const headers = new Headers();
      headers.set("Content-Type", "text/plain");
      const req = new Request("https://www.example.com/hello.txt", {
        method: "POST",
        headers: headers,
        body: "Hello world!",
      });
      const encoder = new BHttpEncoder();
      const binReq = await encoder.encodeRequest(req);

      const decoder = new BHttpDecoder();
      const decodedReq = decoder.decodeRequest(binReq);

      // assert
      assertEquals(decodedReq.method, "POST");
      assertEquals(
        (decodedReq.headers.get("content-type") as string).slice(
          0,
          "text/plain".length,
        ),
        "text/plain",
      );
      assertEquals(decodedReq.url, "https://www.example.com/hello.txt");
      const body = await decodedReq.text();
      assertEquals(body, "Hello world!");
    });
  });
});
