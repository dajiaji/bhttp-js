import { BHttpDecoder, BHttpEncoder } from "./bhttp.js";

export async function testBHttpGateway(request) {
  const decoder = new BHttpDecoder();
  const encoder = new BHttpEncoder();
  const url = new URL(request.url);

  if (url.pathname === "/test1") {
    try {
      if (request.headers.get("content-type") !== "message/bhttp") {
        throw new Error("Invalid content-type.");
      }
      const reqBody = await request.arrayBuffer();
      const decodedReq = decoder.decodeRequest(reqBody);
      if (decodedReq.url !== "https://ogr.example/query") {
        throw new Error("Invalid destination.");
      }
      const res = new Response("baz", {
        headers: { "Content-Type": "text/plain" },
      });
      const bRes = await encoder.encodeResponse(res);
      return new Response(bRes, {
        headers: { "Content-Type": "message/bhttp" },
      });
    } catch (err) {
      return new Response(
        encoder.encodeResponse(
          new Response("ng: " + err.message, { status: 400 }),
        ),
        { status: 400, headers: { "Content-Type": "message/bhttp" } },
      );
    }
  }
  if (url.pathname === "/test2") {
    try {
      if (request.headers.get("content-type") !== "message/bhttp") {
        throw new Error("Invalid content-type.");
      }
      const reqBody = await request.arrayBuffer();
      const decodedReq = decoder.decodeRequest(reqBody);
      if (decodedReq.url !== "https://ogr.example/register") {
        throw new Error("Invalid destination.");
      }
      if (decodedReq.headers.get("content-type") !== "application/json") {
        throw new Error("Invalid content-type.");
      }
      const body = await decodedReq.text();
      if (body !== '{"user": "me"}') {
        throw new Error("Invalid body.");
      }
      const res = new Response("", { status: 201 });
      const bRes = await encoder.encodeResponse(res);
      return new Response(bRes, {
        status: 201,
        headers: { "Content-Type": "message/bhttp" },
      });
    } catch (err) {
      return new Response(
        await encoder.encodeResponse(
          new Response("ng: " + err.message, { status: 400 }),
        ),
        { status: 400, headers: { "Content-Type": "message/bhttp" } },
      );
    }
  }
  return new Response(
    await encoder.encodeResponse(new Response("", { status: 404 })),
    { status: 404, headers: { "Content-Type": "message/bhttp" } },
  );
}
