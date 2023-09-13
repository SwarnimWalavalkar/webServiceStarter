import hermes from "../hermes";
import registerSubscriptions from "../hermes/subscriptions";
import sleep from "../utils/sleep";
import type { FastifyInstance } from "fastify";

export default async function loaders(app: FastifyInstance) {
  let retries = 1;
  while (retries <= 5) {
    try {
      await import("../services/redis.js");
      await import("../services/db.js");
      await hermes.connect();
      await import("../hermes/reply/index.js");
      registerSubscriptions();
      break;
    } catch (error) {
      await sleep(5000);
      retries++;
      if (retries >= 5) {
        throw error;
      }
    }
  }
}
