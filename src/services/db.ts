import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import config from "../config";

const queryClient = postgres(config.db.connectionURI);
export const db: PostgresJsDatabase = drizzle(queryClient, {
  logger: true,
});

export default db;
