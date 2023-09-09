import hermes from "..";

export interface SayHelloRequest {
  name: string;
}

export interface SayHelloResponse {
  message: string;
}

hermes.transport.reply<SayHelloRequest, SayHelloResponse>(
  "say-hello",
  async ({ reqData, msgId }) => {
    console.log("REQUEST_RECEIVED", msgId);
    return { message: `Hello, ${reqData.name}!` };
  }
);
