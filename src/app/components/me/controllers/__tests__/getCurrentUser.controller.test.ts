import app from "../../../..";

describe("GET /api/v1/fastify-service/me/", () => {
  let token: string;

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

    const respData = await (
      await app.inject({
        method: "POST",
        path: "/api/v1/fastify-starter/auth/login",
        payload: {
          username_or_email: "test@test.com",
          password: "testpass",
        },
      })
    ).json();

    token = respData.token;
  });

  it("should respond with the currently logged in user", async () => {
    const response = await app.inject({
      method: "GET",
      path: "/api/v1/fastify-starter/me/",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    expect(response.statusCode).toBe(200);
    expect(data.user).toBeDefined();
  });

  it("should with a 401 without the token", async () => {
    const response = await app.inject({
      method: "GET",
      path: "/api/v1/fastify-starter/me/",
    });

    expect(response.statusCode).toBe(401);
  });
});
