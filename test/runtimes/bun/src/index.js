import { testBHttpGateway } from "../../testBHttpGateway.js";

export default {
  port: 3000,
  async fetch(request) {
    return await testBHttpGateway(request);
  },
};
