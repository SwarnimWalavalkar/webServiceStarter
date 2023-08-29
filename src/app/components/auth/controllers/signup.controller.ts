import withZod from "../../../util/withZod";
import db from "../../../../services/db";
import { User, UserInsert, users } from "../../../../schema/user";
import { sql } from "drizzle-orm";
import * as argon2 from "argon2";
import { z } from "zod";

export default withZod({
  schema: {
    body: z
      .object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(8).max(100),
        username: z
          .string()
          .regex(/^(\w){1,15}$/)
          .min(1)
          .max(15)
          .toLowerCase(),
      })
      .required(),
  },
  async handler(req, reply) {
    const { email, name, username, password } = req.body as {
      email: string;
      name: string;
      username: string;
      password: string;
    };

    const foundUsers: Array<User> = await db
      .select()
      .from(users)
      .where(sql`${users.username} = ${username} or ${users.email} = ${email}`);

    if (foundUsers.length > 0) {
      return reply.conflict("USERNAME_OR_EMAIL_ALREADY_EXISTS");
    }

    const passHash = await argon2.hash(password);

    const newUser: UserInsert = {
      username,
      name,
      email,
      password: passHash,
    };

    await db.insert(users).values(newUser);

    return reply.status(201).send({ success: true });
  },
});