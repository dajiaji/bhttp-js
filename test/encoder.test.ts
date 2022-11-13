import { assertEquals } from "testing/asserts.ts";
import { describe, it } from "testing/bdd.ts";

import { BHttpEncoder } from "../src/encoder.ts";
import { BHttpDecoder } from "../src/decoder.ts";

describe("BHttpEncoder", () => {
  describe("POST", () => {
    it("should encode a POST request with over 16383 byte length content.", async () => {
      const req = new Request("https://www.example.com/hello.txt", {
        method: "POST",
        headers: { "Content-Type": "application/octet-stream" },
        body: (new Uint8Array(16384)).fill(0),
      });
      const encoder = new BHttpEncoder();
      const binReq = await encoder.encodeRequest(req);

      const decoder = new BHttpDecoder();
      const decodedReq = decoder.decodeRequest(binReq);

      // assert
      assertEquals(decodedReq.method, "POST");
      assertEquals(
        decodedReq.headers.get("content-type"),
        "application/octet-stream",
      );
      assertEquals(decodedReq.url, "https://www.example.com/hello.txt");
      const body = await decodedReq.arrayBuffer();
      assertEquals(body.byteLength, 16384);
    });

    it("should encode a POST request with over 1073741823 byte length content.", async () => {
      const req = new Request("https://www.example.com/hello.txt", {
        method: "POST",
        headers: { "Content-Type": "application/octet-stream" },
        body: (new Uint8Array(1073741824)).fill(0),
      });
      const encoder = new BHttpEncoder();
      const binReq = await encoder.encodeRequest(req);

      const decoder = new BHttpDecoder();
      const decodedReq = decoder.decodeRequest(binReq);

      // assert
      assertEquals(decodedReq.method, "POST");
      assertEquals(
        decodedReq.headers.get("content-type"),
        "application/octet-stream",
      );
      assertEquals(decodedReq.url, "https://www.example.com/hello.txt");
      const body = await decodedReq.arrayBuffer();
      assertEquals(body.byteLength, 1073741824);
    });
  });
});
