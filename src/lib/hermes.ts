import Redis, { RedisOptions } from "ioredis";
import { v4 as uuidv4 } from "uuid";

// Bus -> For publishing and subscribing to messages
// Transport -> For Req/Res

export interface ITransport {
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

export interface IBus {
  subscribe<T>(
    topic: string,
    callback: (msgData: { data: T; msgId: string }) => Promise<void> | unknown
  ): void | Promise<void>;
  publish<T>(topic: string, data: T): void | Promise<void>;
}

export interface IHermes {
  connect(): void | Promise<void>;
  disconnect(): void | Promise<void>;
  bus: IBus;
  transport: ITransport;
}

export default function Hermes({
  durableName,
  redisOptions,
}: {
  durableName: string;
  redisOptions: RedisOptions;
}): IHermes {
  let subscriber: Redis;
  let publisher: Redis;

  const consumerName = uuidv4();
  const groupName = durableName;

  const connect = async () => {
    subscriber = new Redis(redisOptions);
    publisher = new Redis(redisOptions);
  };

  async function disconnect() {
    subscriber.disconnect();
    publisher.disconnect();
  }

  async function addToStream(streamName: string, ...args: Array<any>) {
    try {
      await publisher.xadd(streamName, "*", ...args);
    } catch (error: any) {
      console.error(`[HERMES] Error adding to stream: ${error.message}`);
      throw error;
    }
  }

  async function ackMessages(
    streamName: string,
    groupName: string,
    ...messageIds: Array<string>
  ) {
    try {
      await subscriber.xack(streamName, groupName, ...messageIds);
    } catch (error: any) {
      console.error(`[HERMES] Error acknowledging messages: ${error.message}`);
      throw error;
    }
  }

  async function createConsumerGroup(streamName: string, groupName: string) {
    try {
      await subscriber.xgroup("CREATE", streamName, groupName, "0", "MKSTREAM");
    } catch (error: any) {
      if (error.message.includes("BUSYGROUP")) {
        return;
      }
      console.error(
        `[HERMES] Error while creating consumer group: ${error.message}`
      );
      throw error;
    }
  }

  async function readStreamAsConsumerGroup(
    streamName: string,
    count: number = 1,
    blockMs: number = 1,
    group: string = groupName,
    consumer: string = consumerName
  ) {
    try {
      const results: string[][] = (await subscriber.xreadgroup(
        "GROUP",
        groupName,
        consumerName,
        "COUNT",
        count,
        "BLOCK",
        blockMs,
        "STREAMS",
        streamName,
        ">"
      )) as string[][];

      if (results && results.length) {
        const [_key, messages] = results[0];

        return messages;
      }

      return null;
    } catch (error: any) {
      if (error.message.includes("NOGROUP")) {
        console.log(`${error.message} ...CREATING GROUP`);
        await createConsumerGroup(streamName, group);
        return null;
      }
      console.error(`[HERMES] Error reading stream: ${error.message}`);
      throw error;
    }
  }

  async function* getStreamMessageGenerator(streamName: string, count: number) {
    while (true) {
      const results = await readStreamAsConsumerGroup(streamName, count);

      if (!results || !results?.length) {
        continue;
      }

      for (const message of results) {
        yield message;
      }
    }
  }

  const bus: IBus = {
    async subscribe<T>(
      topic: string,
      callback: (msgData: { data: T; msgId: string }) => Promise<void>
    ): Promise<void> {
      try {
        const generator = getStreamMessageGenerator(topic, 10);

        for await (const message of generator) {
          const data = JSON.parse(message[1][1]);
          const msgId = message[0];

          /** @TODO Remove this and require messages to be manually acknowledged */
          await ackMessages(topic, groupName, msgId);

          await callback({ data, msgId });
        }
      } catch (error) {
        console.error("[HERMES] Consumer Group Error:", error);
        throw error;
      }
    },
    async publish<T>(topic: string, data: T): Promise<void> {
      await addToStream(topic, "data", JSON.stringify(data));
    },
  };

  const transport: ITransport = {
    async request<RequestData, ResponseData>(
      topic: string,
      reqData: RequestData
    ): Promise<ResponseData> {
      const responseTopic = `${topic}-res`;

      await bus.publish<RequestData>(topic, reqData);

      const responseGenerator = getStreamMessageGenerator(responseTopic, 1);

      const messageResp = await responseGenerator.next();

      if (!messageResp.done && messageResp.value) {
        const message = messageResp.value;

        const data = JSON.parse(message[1][1]);
        const msgId = message[0];

        await ackMessages(responseTopic, groupName, msgId);

        return data;
      } else {
        console.error("[HERMES] Unexpected Error while making a request");
        throw Error("Unexpected Error while making a request");
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

        await ackMessages(topic, groupName, msgId);

        await addToStream(
          `${topic}-res`,
          "data",
          JSON.stringify(res),
          "reqMsgId",
          msgId
        );
      });
    },
  };

  return {
    connect,
    disconnect,
    bus,
    transport,
  };
}
