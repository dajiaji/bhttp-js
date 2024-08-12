// test/index.spec.ts
import { SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";

import { BHttpDecoder, BHttpEncoder } from "@dajiaji/bhttp";

describe("BHTTP hello world server", () => {
  it("200 OK", async () => {
    const encoder = new BHttpEncoder();
    const req = new Request("https://target.example/query?foo=bar");
    const bReq = await encoder.encodeRequest(req);
    const res = await SELF.fetch("https://relay.example", {
      method: "POST",
      headers: {
        "Content-Type": "message/bhttp",
      },
      body: bReq,
    });
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("message/bhttp");
    const decoder = new BHttpDecoder();
    const decodedRes = decoder.decodeResponse(await res.arrayBuffer());
    expect(decodedRes.status).toBe(200);
    expect(await decodedRes.text()).toBe("Hello World!");
  });
});
