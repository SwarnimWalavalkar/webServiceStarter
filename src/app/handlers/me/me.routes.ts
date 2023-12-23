import { FastifyPluginOptions } from "fastify";
import getCurrentUserController from "./controllers/getCurrentUser.controller";
import { FastifyZodInstance } from "../../util/fastifyZodTypeProvider";

export default function routes(
  app: FastifyZodInstance,
  _: FastifyPluginOptions,
  done: (err?: Error | undefined) => void
) {
  app.get("/", getCurrentUserController);

  done();
}
