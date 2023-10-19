import pino from "pino";
import als from "../lib/als";

const logger = pino({
  name: "starter-service",
  mixin() {
    return { traceId: als.getStore() };
  },
  level:
    process.env.NODE_ENV === "development"
      ? "debug"
      : process.env.NODE_ENV === "test" || process.env.NODE_ENV === "cli"
      ? "error"
      : "info",
  redact: {
    paths: [
      "password",
      "*.password",
      "*.body.password",
      "event.data.password",
      "req.headers['authorization']",
      "req.cookies['authorization']",
    ],
    censor: "**SENSETIVE INFORMATION**",
  },
});

export default logger;
