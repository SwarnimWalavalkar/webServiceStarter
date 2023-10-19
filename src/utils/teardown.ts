import app from "../app";
import hermes from "../hermes";
import { dbConnection } from "../services/db";
import { redis } from "../services/redis";

export default async function teardown() {
  await app.close();

  await hermes.disconnect();
  await dbConnection.end();
  await redis.quit();
}
