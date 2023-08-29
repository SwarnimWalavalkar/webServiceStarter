import fastify from "fastify";
import helmet from "@fastify/helmet";
import sensible from "@fastify/sensible";
import fjwt from "@fastify/jwt";
import cookie, { FastifyCookieOptions } from "@fastify/cookie";
import swagger from "@fastify/swagger";
import cors from "@fastify/cors";

import {
  uncaughtExceptionHandler,
  unhandledRejectionHandler,
} from "../utils/error";
import { fastifyPlugin } from "../lib/als";
import logger from "../utils/logger";
import v1Routes from "./v1";
import { JWT } from "@fastify/jwt";
import config from "../config";
import { User } from "../schema/user";

process.on("uncaughtException", uncaughtExceptionHandler);
process.on("unhandledRejection", unhandledRejectionHandler);

declare module "fastify" {
  interface FastifyRequest {
    jwt: JWT;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: Omit<User, "password">;
  }
}

const app = fastify({
  ignoreTrailingSlash: true,
  logger: false,
  trustProxy: true,
  disableRequestLogging: true,
});

app.register(fastifyPlugin, {
  useHeader: true,
  headerName: "x-request-id",
});

app.register(helmet);

app.register(sensible);

app.register(fjwt, {
  secret: config.jwt.tokenSecret,
  cookie: {
    cookieName: "Authorization",
    signed: false,
  },
});

app.register(cookie, {
  secret: config.jwt.tokenSecret,
} as FastifyCookieOptions);

app.addHook("onRequest", (req, reply, done) => {
  reply.header("Pragma", "no-cache");
  reply.header(
    "Cache-Control",
    "private, no-cache, no-store, must-revalidate, max-age=0"
  );

  reply.header("X-Powered-By", "Passion and Love");
  logger.info({
    req: {
      method: req.raw.method,
      url: req.raw.url,
      headers: req.raw.headers,
      query: req.query,
      body: req.body,
    },
    msg: "request received",
  });
  done();
});

app.addHook("preHandler", (req, _, next) => {
  req.jwt = app.jwt;
  return next();
});

app.addHook("onResponse", (req, reply, done) => {
  logger.info({
    msg: "request completed",
    res: { statusCode: reply.raw.statusCode, message: reply.raw.statusMessage },
  });
  done();
});

app.register(v1Routes, { prefix: "/api/v1/fastify-starter" });

app.get("/ping", (req, reply) => {
  reply.status(200).send({
    success: true,
  });
});

app.setErrorHandler(function (error, request, reply) {
  if (reply.raw.statusCode === 500) {
    logger.error({
      err: error,
    });
    reply.send(new Error("Something went wrong"));
  } else {
    reply.send(error);
  }
});

export default app;
