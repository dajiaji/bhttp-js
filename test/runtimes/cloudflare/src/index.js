import { testBHttpGateway } from "../../testBHttpGateway.js";

export default {
  async fetch(request) {
    return await testBHttpGateway(request);
  },
};
