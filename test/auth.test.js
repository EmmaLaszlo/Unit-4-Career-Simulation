const request = require("supertest");
const app = require("../app");
const db = require("../db");

afterAll(async () => {
  await db.end();
});

describe("Auth Endpoints", () => {
  it("should register a user and return a token", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        username: "testuser_" + Date.now(),
        email: `test${Date.now()}@example.com`,
        password: "password123",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
  });
});
