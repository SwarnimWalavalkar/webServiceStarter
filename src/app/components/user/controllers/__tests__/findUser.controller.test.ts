import app from "../../../..";

describe("GET /api/v1/fastify-starter/user/find", () => {
  beforeAll(async () => {
    await app.inject({
      method: "POST",
      path: "/api/v1/fastify-starter/auth/signup",
      payload: {
        email: "test@test.com",
        username: "test",
        name: "Test Account",
        password: "testpass",
      },
    });
  });

  it("should return a user", async () => {
    const response = await app.inject({
      method: "GET",
      path: "/api/v1/fastify-starter/user/find",
      query: {
        username_or_email: "test@test.com",
      },
    });

    const data = await response.json();

    expect(response.statusCode).toBe(200);
    expect(data.user).toBeDefined();
  });

  it("should return a 404 on invalid username/email", async () => {
    const response = await app.inject({
      method: "GET",
      path: "/api/v1/fastify-starter/user/find",
      query: {
        username_or_email: "thisdoesnotexist",
      },
    });

    expect(response.statusCode).toBe(404);
  });
});
