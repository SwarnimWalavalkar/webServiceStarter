import app from "../../../..";

describe("POST /api/v1/fastify-service/auth/signup", () => {
  it("should respond with a 201 on successful signup", async () => {
    const response = await app.inject({
      method: "POST",
      path: "/api/v1/fastify-starter/auth/signup",
      payload: {
        email: "test@test.com",
        username: "test",
        name: "Test Account",
        password: "testpass",
      },
    });
    expect(response.statusCode).toBe(201);
  });
});
