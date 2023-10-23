import app from "../app";
import hermes from "../hermes";
import { dbConnection } from "../dependencies/db";
import { redis } from "../dependencies/redis";

export default async function teardown() {
  await app.close();

  await hermes.disconnect();
  await dbConnection.end();
  await redis.quit();
}
