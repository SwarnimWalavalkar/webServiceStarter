import config from "../config";
import Hermes, { IHermes } from "../lib/hermes";

const hermes: IHermes = Hermes({
  durableName: "testService1",
  redisOptions: { ...config.redis },
});

export default hermes;
