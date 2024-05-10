import { constructNetworkRequester } from "../../../lib/networkRequester";
import { ChatCompletionCreateParams } from "openai/resources/index.mjs";
import { ChatCompletion } from "openai/src/resources/index.js";
import { ServiceError } from "../../../shared/errors";
import { Ok, Result } from "../../../shared/result";
import { redis } from "../../../dependencies/redis";
import { embedText } from "./embeddings.service";
import { CreateFAISSVectorStore } from "../vector/faiss";
import logger from "../../../utils/logger";
import config from "../../../config";
import withCache from "../../../utils/withCache";

class AIChatServiceError extends ServiceError {
  constructor(message: string, source?: string) {
    super("Embeddings Service Error", message, source);
    this.name = this.constructor.name;
  }
}

const openAIChatCompletionsRequest = constructNetworkRequester(
  "https://api.openai.com/v1/chat/completions",
  { Authorization: `Bearer ${config.openai.apiKey}` }
);

const vectorStore = CreateFAISSVectorStore();

export const aiRequest = async (
  query: string,
  skipCache?: boolean
): Promise<Result<string, AIChatServiceError>> => {
  try {
    const CACHE_KEY = `ai-response:${query}`;

    if (!skipCache) {
      const exactMatchResponse = await redis.get(CACHE_KEY);

      if (exactMatchResponse) {
        logger.debug(`[AI Service] Returning exact match cached response`);
        return Ok(exactMatchResponse);
      }

      const queryEmbeddingsResult = await withCache(
        embedText(query),
        `embeddings:${query}`
      );

      if (!queryEmbeddingsResult.ok) {
        throw queryEmbeddingsResult.error;
      }

      const { value: embeddedQuery } = queryEmbeddingsResult;

      const similarEmbeddings = vectorStore.getSimilarVector(embeddedQuery);

      logger.debug(`[AI Service] Similar Embedding: ${similarEmbeddings}`);

      if (similarEmbeddings) {
        logger.debug(
          `[AI Service] Similar query found: ${similarEmbeddings.label}`
        );

        const cachedResponse = await redis.get(
          `ai-response:${similarEmbeddings.label}`
        );

        if (cachedResponse) {
          logger.debug(`[AI Service] Returning cached response`);

          return Ok(cachedResponse);
        }
      } else {
        vectorStore.setVector(embeddedQuery, query);
      }
    }

    const { data: response } = await openAIChatCompletionsRequest.post<
      ChatCompletionCreateParams,
      ChatCompletion
    >("", {
      model: config.openai.chatCompletions.model,
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: query,
        },
      ],
    });

    const responseText = response.choices[0]?.message.content as string;

    await redis.set(CACHE_KEY, responseText, "EX", 60 * 60 * 24);

    return Ok(responseText);
  } catch (error) {
    logger.error("[AI Service] Error responding to query", error);

    throw error;
  }
};
