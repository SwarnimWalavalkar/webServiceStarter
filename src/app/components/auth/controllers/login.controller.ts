import { sql } from "drizzle-orm";
import { User, users } from "../../../../schema/user";
import db from "../../../../services/db";
import * as argon2 from "argon2";
import withZod from "../../../util/withZod";
import { z } from "zod";

export default withZod({
  schema: {
    body: z
      .object({
        username_or_email: z.string(),
        password: z.string(),
      })
      .required(),
  },
  async handler(req, reply) {
    const { username_or_email, password } = req.body as {
      username_or_email: string;
      password: string;
    };

    const foundUsers: Array<User> = await db
      .select()
      .from(users)
      .where(
        sql`${users.username} = ${username_or_email} or ${users.email} = ${username_or_email}`
      );

    if (foundUsers.length < 0) {
      return reply.notFound("INVALID_USERNAME_OR_EMAIL");
    }

    const [foundUser] = foundUsers;

    const match = await argon2.verify(foundUser.password, password);

    if (!match) return reply.badRequest("INVALID_CREDENTIALS");

    const { password: _, ...user } = foundUser;

    const token = req.jwt.sign(user);

    if (!token) return reply.internalServerError("ERROR_GENERATING_TOKEN");

    /** Secure Options */
    // reply.setCookie("Authorization", token, {
    //   domain: "swarnimwalavalkar.com",
    //   secure: true,
    //   httpOnly: true,
    //   sameSite: true,
    // });

    reply.setCookie("Authorization", token, { path: "/" });

    return reply.send({ user });
  },
});
