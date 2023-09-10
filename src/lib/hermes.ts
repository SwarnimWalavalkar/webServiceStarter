import Redis, { RedisOptions } from "ioredis";
import { v4 as uuidv4 } from "uuid";

// Bus -> For publishing and subscribing to messages
// Transport -> For Req/Res

export interface Transport {
  request<RequestData, ResponseData>(
    topic: string,
    reqData: RequestData
  ): Promise<ResponseData>;

  reply<RequestData, ResponseData>(
    topic: string,
    fn: (msgData: {
      reqData: RequestData;
      msgId: string;
    }) => ResponseData | Promise<ResponseData>
  ): void | Promise<void>;
}

export interface Bus {
  subscribe<T>(
    topic: string,
    callback: (msgData: { data: T; msgId: string }) => Promise<void> | unknown
  ): void | Promise<void>;
  publish<T>(topic: string, data: T): void | Promise<void>;
}

export interface Hermes {
  connect(): void | Promise<void>;
  bus: Bus;
  transport: Transport;
}

export default function Hermes({
  durableName,
  redisOptions,
}: {
  durableName: string;
  redisOptions: RedisOptions;
}) {
  let subscriber: Redis;
  let publisher: Redis;

  const consumerName = uuidv4();
  const groupName = durableName;

  async function connect() {
    subscriber = new Redis(redisOptions);
    publisher = new Redis(redisOptions);
  }

  const bus: Bus = {
    async subscribe<T>(
      topic: string,
      callback: (msgData: { data: T; msgId: string }) => Promise<void>
    ): Promise<void> {
      try {
        subscriber
          .xgroup("CREATE", topic, groupName, "$", "MKSTREAM")
          .catch(() => {});

        const results: string[][] = (await subscriber.xreadgroup(
          "GROUP",
          groupName,
          consumerName,
          "BLOCK",
          200,
          "STREAMS",
          topic,
          ">"
        )) as string[][];

        if (results && results.length) {
          const [_key, messages] = results[0];

          const data = JSON.parse(messages[0][1][1]);
          const msgId = messages[0][0];

          await subscriber.xack(durableName, topic, groupName, msgId);

          await callback({ data, msgId });
        }

        await this.subscribe<T>(topic, callback);
      } catch (error) {
        console.error("[CONSUMER GROUP ERROR]", error);
        process.exit(1);
      }
    },
    async publish<T>(topic: string, data: T): Promise<void> {
      await publisher.xadd(topic, "*", "data", JSON.stringify(data));
    },
  };

  const transport: Transport = {
    async request<RequestData, ResponseData>(
      topic: string,
      reqData: RequestData
    ): Promise<ResponseData> {
      const responseTopic = `${topic}-res`;

      await bus.publish<RequestData>(topic, reqData);

      subscriber
        .xgroup("CREATE", responseTopic, groupName, "$", "MKSTREAM")
        .catch(() => {});

      while (true) {
        const results: string[][] = (await subscriber.xreadgroup(
          "GROUP",
          groupName,
          consumerName,
          "BLOCK",
          200,
          "STREAMS",
          responseTopic,
          ">"
        )) as string[][];

        if (results && results.length) {
          const [_key, messages] = results[0];

          const data = JSON.parse(messages[0][1][1]);
          const msgId = messages[0][0];

          await subscriber.xack(durableName, responseTopic, groupName, msgId);

          return data;
        }
      }
    },

    async reply<RequestData, ResponseData>(
      topic: string,
      fn: (msgData: {
        reqData: RequestData;
        msgId: string;
      }) => ResponseData | Promise<ResponseData>
    ): Promise<void> {
      await bus.subscribe<RequestData>(topic, async ({ msgId, data }) => {
        const res = await fn({ reqData: data, msgId });
        await subscriber.xack(durableName, topic, groupName, msgId);
        await bus.publish<ResponseData>(`${topic}-res`, res);
      });
    },
  };

  return {
    connect,
    bus,
    transport,
  };
}
