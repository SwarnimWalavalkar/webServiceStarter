import { FastifyPluginOptions } from "fastify";
import testHermesController from "./controllers/testHermes.controller";
import { FastifyZodInstance } from "../../util/fastifyZodTypeProvider";

export default function routes(
  app: FastifyZodInstance,
  _: FastifyPluginOptions,
  done: (err?: Error | undefined) => void
) {
  app.get("/test", testHermesController);

  done();
}
