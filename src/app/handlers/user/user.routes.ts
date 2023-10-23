import { FastifyInstance, FastifyPluginOptions } from "fastify";
import findUserController from "./controllers/findUser.controller";

export default function routes(
  app: FastifyInstance,
  _: FastifyPluginOptions,
  done: (err?: Error | undefined) => void
) {
  app.get("/find", findUserController);

  done();
}
