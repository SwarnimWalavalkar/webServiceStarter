import z from "zod";
import hermes from "..";
import { IEvent } from "@swarnim/hermes";

export const messagePayloadSchema = z.object({
  userId: z.number(),
  username: z.string(),
  userAgent: z.string(),
});

export let userSignupEvent: IEvent<z.infer<typeof messagePayloadSchema>>;

hermes
  .registerEvent("user-signup-event", messagePayloadSchema)
  .then((event) => {
    userSignupEvent = event;
  });

export function registerUserSignupSubscription() {
  userSignupEvent.subscribe(async ({ data, msg }) => {
    console.log("USER SIGNUP EVENT RECEIVED", data);

    // Do more useful things here...

    await msg.ack();
  });
}
