import { FastifyRequest, FastifyReply } from "fastify";
import { userSignupEvent } from "../../../../hermes/events/userSignup";
import { primeNumberService } from "../../../../hermes/reply/getPrimeNumbers";
import { z } from "zod";

const querystring = z
  .object({
    name: z.string(),
  })
  .required();

export default {
  schema: {
    querystring,
  },

  async handler(
    req: FastifyRequest<{ Querystring: z.infer<typeof querystring> }>,
    reply: FastifyReply
  ) {
    const { name } = req.query;

    await userSignupEvent.publish({
      userId: 124,
      username: name,
      userAgent: "Chrome 118.0.0.0 / Mac OS X 10.15.7",
    });

    const { numbers: primeNumbers } = await primeNumberService.request({
      max: 100,
    });

    return reply.status(200).send({ primeNumbers });
  },
};
