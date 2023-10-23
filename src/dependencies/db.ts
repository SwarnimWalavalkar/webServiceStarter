import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres, { Sql } from "postgres";
import config from "../config";

export let dbConnection: Sql;
export let db: PostgresJsDatabase;

export const setupDB = async () => {
  dbConnection = postgres(config.db.connectionURI);

  db = drizzle(dbConnection, {
    logger: true,
  });
};
