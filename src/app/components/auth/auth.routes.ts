import { FastifyInstance, FastifyPluginOptions } from "fastify";
import loginController from "./controllers/login.controller";
import signupController from "./controllers/signup.controller";

export default function routes(
  app: FastifyInstance,
  _: FastifyPluginOptions,
  done: (err?: Error | undefined) => void
) {
  app.post("/signup", signupController);
  app.post("/login", loginController);

  done();
}
