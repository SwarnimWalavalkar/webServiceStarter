import * as argon2 from "argon2";
import withZod from "../../../util/withZod";
import { z } from "zod";
import { getUserByUsernameOrEmail } from "../../../services/user/user.service";
import { BadRequest, NotFoundError } from "../../../../shared/errors";

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

    const foundUserRes = await getUserByUsernameOrEmail(username_or_email);

    if (!foundUserRes.ok) {
      throw new NotFoundError("INVALID_USERNAME_OR_EMAIL");
    }

    const match = await argon2.verify(foundUserRes.value.password, password);

    if (!match) throw new BadRequest("INVALID_CREDENTIALS");

    const {
      id: _id,
      password: _password,
      created_at: _created_at,
      updated_at: _updated_at,
      ...user
    } = foundUserRes.value;

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
