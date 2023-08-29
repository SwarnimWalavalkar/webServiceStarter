import type { Config } from "drizzle-kit";
import config from "./src/config";

export default {
  schema: "./src/schema/*",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: config.db.connectionURI,
  },
  verbose: true,
  strict: true,
} satisfies Config;
