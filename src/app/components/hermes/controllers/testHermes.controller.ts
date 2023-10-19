import { userSignupEvent } from "../../../../hermes/events/userSignup";
import { primeNumberService } from "../../../../hermes/reply/getPrimeNumbers";
import withZod from "../../../util/withZod";
import { z } from "zod";

export default withZod({
  schema: {
    querystring: z
      .object({
        name: z.string(),
      })
      .required(),
  },

  async handler(req, reply) {
    const { name } = req.query as {
      name: string;
    };

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
});
