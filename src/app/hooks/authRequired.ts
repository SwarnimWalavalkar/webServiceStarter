import { FastifyRequest, FastifyReply } from "fastify";
import { JWT } from "@fastify/jwt";
import { User } from "../../schema/user";

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

export default async function authRequiredHook(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await req.jwtVerify();
  } catch (e) {
    return reply.send(e);
  }
}
