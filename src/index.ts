import app from "./app";
import config from "./config";
import loaders from "./loaders";
import logger from "./utils/logger";

async function startServer() {
  await loaders(app);
  const port = config.port;

  app.listen({ port: Number(port), host: "0.0.0.0" }, (err, address) => {
    if (err) {
      logger.error(err);
      process.exit(1);
    }
    logger.info({
      msg: `fastify-starter service listening on ${address}`,
    });
  });
}

startServer();
