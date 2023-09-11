import hermes from "../../../../hermes";
import { SayHelloRequest, SayHelloResponse } from "../../../../hermes/reply";
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

    const { message }: SayHelloResponse = await hermes.service.request<
      SayHelloRequest,
      SayHelloResponse
    >("say-hello", { name });

    await hermes.bus.publish<SayHelloRequest>("user-greeted-event", { name });

    return reply.status(200).send({ message });
  },
});
