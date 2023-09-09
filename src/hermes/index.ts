import config from "../config";
import Hermes from "../lib/hermes";
import sleep from "../utils/sleep";

const hermes = Hermes({
  durableName: "testService1",
  redisOptions: { ...config.redis },
});

export default hermes