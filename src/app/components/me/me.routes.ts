import { FastifyInstance, FastifyPluginOptions } from "fastify";
import getCurrentUserController from "./controllers/getCurrentUser.controller";

export default function routes(
  app: FastifyInstance,
  _: FastifyPluginOptions,
  done: (err?: Error | undefined) => void
) {
  app.get("/", getCurrentUserController);

  done();
}
