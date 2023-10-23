import { sql } from "drizzle-orm";
import { User, users } from "../../../../schema/user";
import { db } from "../../../../services/db";
import withZod from "../../../util/withZod";
import { z } from "zod";

export default withZod({
  schema: {
    querystring: z
      .object({
        username_or_email: z.string(),
      })
      .required(),
  },

  async handler(req, reply) {
    const { username_or_email, password } = req.query as {
      username_or_email: string;
      password: string;
    };

    const foundUsers: Array<Pick<User, "name" | "username" | "email">> =
      await db
        .select({
          name: users.name,
          username: users.username,
          email: users.email,
        })
        .from(users)
        .where(
          sql`${users.username} = ${username_or_email} or ${users.email} = ${username_or_email}`
        );

    if (!foundUsers.length) {
      return reply.notFound("INVALID_USERNAME_OR_EMAIL");
    }

    const [user] = foundUsers;

    return reply.send({ user });
  },
});
