import { FastifyInstance, FastifyPluginOptions } from "fastify";
import testHermesController from "./controllers/testHermes.controller";

export default function routes(
  app: FastifyInstance,
  _: FastifyPluginOptions,
  done: (err?: Error | undefined) => void
) {
  app.get("/test", testHermesController);

  done();
}
