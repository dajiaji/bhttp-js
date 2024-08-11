import { testBHttpGateway } from "./gateway.ts";

export default {
  async fetch(request: Request): Promise<Response> {
    return await testBHttpGateway(request);
  },
};
