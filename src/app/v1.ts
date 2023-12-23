import type { FastifyError, FastifyPluginOptions } from "fastify";

import authRoutes from "./handlers/auth/auth.routes";
import userRoutes from "./handlers/user/user.routes";
import meRoutes from "./handlers/me/me.routes";
import hermesRoutes from "./handlers/hermes/hermes.routes";

import authRequiredHook from "./hooks/authRequired";
import { FastifyZodInstance } from "./util/fastifyZodTypeProvider";

export default async function v1Routes(
  app: FastifyZodInstance,
  _: FastifyPluginOptions,
  done: (err?: FastifyError) => void
) {
  app.register(authRoutes, { prefix: "/auth" });
  app.register(userRoutes, { prefix: "/user" });
  app.register(hermesRoutes, { prefix: "/hermes" });

  app.register((app, _, done) => {
    app.addHook("preHandler", authRequiredHook);
    app.register(meRoutes, { prefix: "/me" });
    done();
  });
  done();
}
