import constants from "./constants";

export default {
  name: "starter-service",
  version: process.env.VERSION || "v1",
  domain: process.env.DOMAIN || "localhost",
  port: process.env.PORT || 4000,
  db: {
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
  },
  jwt: {
    tokenSecret: process.env.JWT_TOKEN_SECRET || "supersecretrandomstring",
  },
  redis: {
    host: process.env.REDIS_HOST || "0.0.0.0",
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || "",
  },
  constants,
} as const;
