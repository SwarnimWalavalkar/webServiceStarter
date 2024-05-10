import constants from "./constants";

export default {
  name: "starter-service",
  version: process.env.VERSION ?? "v1",
  domain: process.env.DOMAIN ?? "localhost",
  port: process.env.PORT ?? 4000,
  db: {
    user: process.env.DB_USER ?? "postgres",
    password: process.env.DB_PASSWORD ?? "postgres",
    host: process.env.DB_HOST ?? "localhost",
    port: process.env.DB_PORT ?? 5432,
  },
  jwt: {
    tokenSecret: process.env.JWT_TOKEN_SECRET ?? "supersecretrandomstring",
  },
  redis: {
    host: process.env.REDIS_HOST ?? "localhost",
    port: Number(process.env.REDIS_PORT ?? 6379),
    password: process.env.REDIS_PASSWORD ?? "",
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY ?? "",
    embeddings: {
      model: process.env.OPENAI_EMBEDDINGS_MODEL ?? "text-embedding-3-small",
      dimension: Number(process.env.OPENAI_EMBEDDINGS_DIMENSION ?? 1536),
    },
    chatCompletions: {
      model: process.env.OPENAI_CHAT_COMPLETIONS_MODEL ?? "gpt-3.5-turbo",
    },
  },
  constants,
} as const;
