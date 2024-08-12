/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { BHttpDecoder, BHttpEncoder } from "@dajiaji/bhttp";

export default {
  async fetch(request): Promise<Response> {
    const decoder = new BHttpDecoder();
    const encoder = new BHttpEncoder();
    // const url = new URL(request.url);
    try {
      if (request.headers.get("content-type") !== "message/bhttp") {
        throw new Error("Invalid content-type.");
      }
      const reqBody = await request.arrayBuffer();
      const decodedReq = decoder.decodeRequest(reqBody);
      if (decodedReq.url !== "https://target.example/query") {
        throw new Error("Invalid destination.");
      }
      const res = new Response("Hello World!", {
        headers: { "Content-Type": "text/plain" },
      });
      const bRes = await encoder.encodeResponse(res);
      return new Response(bRes, {
        headers: { "Content-Type": "message/bhttp" },
      });
    } catch (err: unknown) {
      return new Response(
        await encoder.encodeResponse(
          new Response("error: " + (err as Error).message, { status: 400 }),
        ),
        { status: 400, headers: { "Content-Type": "message/bhttp" } },
      );
    }
  },
} satisfies ExportedHandler<Env>;
