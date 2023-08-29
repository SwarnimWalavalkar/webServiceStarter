import {
  FastifySchemaCompiler,
  RouteShorthandOptionsWithHandler,
} from "fastify";
import type { FastifyRouteSchemaDef } from "fastify/types/schema";
import logger from "../../utils/logger";
import { ZodSchema } from "zod";
import { fromZodError } from "zod-validation-error";

export default function withZod(opts: RouteShorthandOptionsWithHandler) {
  // @ts-ignore
  opts.validatorCompiler = ({
    schema,
    method,
    url,
    httpPart,
  }: FastifyRouteSchemaDef<ZodSchema>): FastifySchemaCompiler<ZodSchema> => {
    return (data: any) => {
      const parseResult = schema.safeParse(data);
      if (!parseResult.success) {
        const validationError = fromZodError(parseResult.error);
        logger.error("[VALIDATION ERROR]", validationError);

        return { error: validationError };
      }
      return parseResult.data;
    };
  };

  return opts;
}
