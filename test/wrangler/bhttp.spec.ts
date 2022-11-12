import { assertEquals } from "testing/asserts.ts";
import { describe, it } from "testing/bdd.ts";

import { BHttpDecoder, BHttpEncoder } from "../../mod.ts";

describe("Cloudflare Workers", () => {
  describe("GET", () => {
    it("200 OK", async () => {
      const encoder = new BHttpEncoder();
      const req = new Request("https://ogr.example/query?foo=bar");
      const bReq = await encoder.encodeRequest(req);
      const res = await fetch("http://localhost:8787/test1", {
        method: "POST",
        headers: {
          "Content-Type": "message/bhttp",
        },
        body: bReq,
      });

      assertEquals(res.status, 200);
      assertEquals(res.headers.get("content-type"), "message/bhttp");
      const decoder = new BHttpDecoder();
      const decodedRes = decoder.decodeResponse(await res.arrayBuffer());
      assertEquals(200, decodedRes.status);
      assertEquals("baz", await decodedRes.text());
    });

    it("404 Not Found", async () => {
      const encoder = new BHttpEncoder();
      const req = new Request("https://ogr.example/query?foo=bar");
      const bReq = await encoder.encodeRequest(req);
      const res = await fetch("http://localhost:8787/testx", {
        method: "POST",
        headers: {
          "Content-Type": "message/bhttp",
        },
        body: bReq,
      });

      assertEquals(res.status, 404);
      assertEquals(res.headers.get("content-type"), "message/bhttp");
      const decoder = new BHttpDecoder();
      const decodedRes = decoder.decodeResponse(await res.arrayBuffer());
      assertEquals(404, decodedRes.status);
    });
  });

  describe("POST", () => {
    it("201 Created", async () => {
      const encoder = new BHttpEncoder();
      const req = new Request("https://ogr.example/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: '{"user": "me"}',
      });
      const bReq = await encoder.encodeRequest(req);
      const res = await fetch("http://localhost:8787/test2", {
        method: "POST",
        headers: {
          "Content-Type": "message/bhttp",
        },
        body: bReq,
      });

      assertEquals(res.status, 201);
      assertEquals(res.headers.get("content-type"), "message/bhttp");
      const decoder = new BHttpDecoder();
      const decodedRes = decoder.decodeResponse(await res.arrayBuffer());
      assertEquals(201, decodedRes.status);
    });

    it("404 Not Found", async () => {
      const encoder = new BHttpEncoder();
      const req = new Request("https://ogr.example/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: '{"user": "me"}',
      });
      const bReq = await encoder.encodeRequest(req);
      const res = await fetch("http://localhost:8787/testx", {
        method: "POST",
        headers: {
          "Content-Type": "message/bhttp",
        },
        body: bReq,
      });

      assertEquals(res.status, 404);
      assertEquals(res.headers.get("content-type"), "message/bhttp");
      const decoder = new BHttpDecoder();
      const decodedRes = decoder.decodeResponse(await res.arrayBuffer());
      assertEquals(404, decodedRes.status);
    });
  });
});
