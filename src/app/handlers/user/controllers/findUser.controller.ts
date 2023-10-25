import withZod from "../../../util/withZod";
import { z } from "zod";
import { getUserByUsernameOrEmail } from "../../../services/user/user.service";
import { NotFoundError } from "../../../../shared/errors";

export default withZod({
  schema: {
    querystring: z
      .object({
        username_or_email: z.string(),
      })
      .required(),
  },

  async handler(req, reply) {
    const { username_or_email } = req.query as {
      username_or_email: string;
    };

    const foundUserRes = await getUserByUsernameOrEmail(username_or_email);

    if (!foundUserRes.ok) {
      throw new NotFoundError("Invalid username or email");
    }

    const {
      id: _id,
      password: _password,
      created_at: _created_at,
      updated_at: _updated_at,
      ...user
    } = foundUserRes.value;

    return reply.send({ user });
  },
});
