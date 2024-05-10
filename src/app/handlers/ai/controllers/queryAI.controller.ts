import { aiRequest } from "../../../services/ai/openai.service";
import { FastifyReply, FastifyRequest } from "fastify";
import { APIError } from "../../../../shared/errors";
import { z } from "zod";

const body = z.object({
  query: z.string(),
  skipCache: z.boolean().optional(),
});

export default {
  schema: {
    body,
  },
  async handler(
    req: FastifyRequest<{ Body: z.infer<typeof body> }>,
    reply: FastifyReply
  ) {
    const { query, skipCache } = req.body;

    const aiResponseResult = await aiRequest(query, skipCache);

    if (!aiResponseResult.ok) {
      throw new APIError(aiResponseResult.error.message);
    }

    return reply.send({
      human: query,
      ai: aiResponseResult.value,
    });
  },
};
