import { testBHttpGateway } from "./gateway.ts";

export default {
  port: 3000,
  async fetch(request: Request): Promise<Response> {
    return await testBHttpGateway(request);
  },
};
