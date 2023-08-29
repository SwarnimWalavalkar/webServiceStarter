import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import config from "./src/config";

const sql = postgres(config.db.connectionURI, { max: 1 });
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
