import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";

import { BHttpEncoder } from "../src/encoder.ts";
import { BHttpDecoder } from "../src/decoder.ts";

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
      decodedReq = decoder.decodeRequest(binReq.buffer as ArrayBuffer);

      // assert
      assertEquals(
        decodedReq.headers.get("user-agent"),
        "curl/7.16.3 libcurl/7.16.3 OpenSSL/0.9.7l zlib/1.2.3",
      );
      assertEquals(decodedReq.headers.get("accept-language"), "en, mi");
    });

    it("should encode and decode a GET request with query parameters.", async () => {
      const req = new Request("https://www.example.com/query?foo=bar", {
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
      decodedReq = decoder.decodeRequest(binReq.buffer as ArrayBuffer);

      // assert
      assertEquals(
        decodedReq.headers.get("user-agent"),
        "curl/7.16.3 libcurl/7.16.3 OpenSSL/0.9.7l zlib/1.2.3",
      );
      assertEquals(decodedReq.headers.get("accept-language"), "en, mi");
      assertEquals(decodedReq.url, "https://www.example.com/query?foo=bar");
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
