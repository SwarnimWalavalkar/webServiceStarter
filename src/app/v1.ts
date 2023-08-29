import type {
  FastifyError,
  FastifyInstance,
  FastifyPluginOptions,
} from "fastify";

import authRoutes from "./components/auth/auth.routes";
import userRoutes from "./components/user/user.routes";
import meRoutes from "./components/me/me.routes";

import authRequiredHook from "./hooks/authRequired";

export default async function v1Routes(
  app: FastifyInstance,
  _: FastifyPluginOptions,
  done: (err?: FastifyError) => void
) {
  app.register(authRoutes, { prefix: "/auth" });
  app.register(userRoutes, { prefix: "/user" });

  app.register((app, _, done) => {
    app.addHook("preHandler", authRequiredHook);
    app.register(meRoutes, { prefix: "/me" });
    done();
  });
  done();
}
