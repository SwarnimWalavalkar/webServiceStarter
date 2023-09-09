import hermes from "..";
import { SayHelloRequest } from "../reply";

export default function registerUserGreetedSubscription() {
  hermes.bus.subscribe<SayHelloRequest>(
    "user-greeted-event",
    async ({ data, msgId }) => {
      console.log("EVENT_RECEIVED", `Said hello to ${data.name}`, msgId);
    }
  );
}
