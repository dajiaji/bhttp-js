import { assertEquals } from "testing/asserts.ts";
import { describe, it } from "testing/bdd.ts";

import { BHttpEncoder } from "../src/encoder.ts";
import { BHttpDecoder } from "../src/decoder.ts";

describe("BHttpDecoder/Encoder", () => {
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
