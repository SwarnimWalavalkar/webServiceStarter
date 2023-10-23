import withZod from "../../../util/withZod";

export default withZod({
  async handler(req, reply) {
    return reply.send({ user: req.user });
  },
});
