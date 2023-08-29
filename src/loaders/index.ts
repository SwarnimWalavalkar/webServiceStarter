import sleep from "../utils/sleep";
import type { FastifyInstance } from "fastify";

export default async function loaders(app: FastifyInstance) {
  let retries = 1;
  while (retries <= 5) {
    try {
      await import("../services/redis");
      await import("../services/db");
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
