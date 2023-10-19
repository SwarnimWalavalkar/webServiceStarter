import { Hermes } from "@swarnim/hermes";
import config from "../config";

const hermes = Hermes({
  durableName: "testService1",
  redisOptions: { ...config.redis },
  poolOptions: { min: 0, max: 64 },
});

export default hermes;
