import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import config from "./src/config";

const {
  name,
  db: { user, password, host, port },
} = config;

const sql = postgres({ user, password, host, port, database: name, max: 1 });
const db = drizzle(sql);

const main = async () => {
  try {
    console.log("Running migrations...");

    await migrate(db, { migrationsFolder: "./drizzle" });

    console.log("Database Migrated!");
  } catch (error) {
    console.error("ERROR:", error);
  } finally {
    process.exit(0);
  }
};

main();
