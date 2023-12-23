import { FastifyPluginOptions } from "fastify";
import findUserController from "./controllers/findUser.controller";
import { FastifyZodInstance } from "../../util/fastifyZodTypeProvider";

export default function routes(
  app: FastifyZodInstance,
  _: FastifyPluginOptions,
  done: (err?: Error | undefined) => void
) {
  app.get("/find", findUserController);

  done();
}
