export default {
  port: process.env.PORT || 4000,
  db: {
    connectionURI:
      process.env.DB_URL ||
      "postgresql://postgres:postgres@localhost:5432/starter-service",
  },
  jwt: {
    tokenSecret: process.env.JWT_TOKEN_SECRET || "supersecretrandomstring",
  },
  redis: {
    host: process.env.REDIS_HOST || "0.0.0.0",
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || "",
  },
};
