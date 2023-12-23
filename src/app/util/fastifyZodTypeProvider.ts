import logger from "../../utils/logger";
import {
  FastifyTypeProvider,
  FastifyInstance,
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  FastifyBaseLogger,
  FastifySchemaCompiler,
} from "fastify";
import z, { ZodTypeAny, ZodAny, ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export interface ZodTypeProvider extends FastifyTypeProvider {
  output: this["input"] extends ZodTypeAny ? z.infer<this["input"]> : never;
}

export type FastifyZodInstance = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  FastifyBaseLogger,
  ZodTypeProvider
>;

export const validatorCompiler: FastifySchemaCompiler<ZodAny> =
  ({ schema }) =>
  (data): any => {
    try {
      return { value: schema.parse(data) };
    } catch (error) {
      const validationError = fromZodError(error as ZodError);
      logger.error("[VALIDATION ERROR]", validationError);

      return { error: validationError };
    }
  };
