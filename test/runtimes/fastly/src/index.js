import { testBHttpGateway } from "../../testBHttpGateway.js";

async function handler(event) {
  const request = event.request;
  return await testBHttpGateway(request);
}

addEventListener("fetch", (event) => event.respondWith(handler(event)));
