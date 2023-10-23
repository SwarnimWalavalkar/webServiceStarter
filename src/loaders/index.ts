import hermes from "../hermes";
import { registerSubscriptions } from "../hermes/events";
import { registerReplies } from "../hermes/reply";
import { setupDB } from "../services/db";
import { setupRedis } from "../services/redis";
import sleep from "../utils/sleep";

export default async function loaders() {
  let retries = 1;
  while (retries <= 5) {
    try {
      await setupRedis();
      await setupDB();

      await hermes.connect();
      registerSubscriptions();
      registerReplies();

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
