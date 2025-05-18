const requestReviews = require("supertest");
const appReviews = require("../app");
const dbReviews = require("../db");
const jwt = require("jsonwebtoken");
let reviewToken;

beforeAll(async () => {
  const email = `reviewer${Date.now()}@example.com`;
  const password = "password123";

  await requestReviews(appReviews)
    .post("/api/auth/register")
    .send({
      username: "reviewer_" + Date.now(),
      email,
      password,
    });

  const loginRes = await requestReviews(appReviews)
    .post("/api/auth/login")
    .send({ email, password });
  reviewToken = loginRes.body.token;

  await dbReviews.query(`
    INSERT INTO items (id, name, description)
    VALUES (2, 'Inserted Item', 'For review test')
    ON CONFLICT (id) DO NOTHING
  `);
});

afterAll(async () => {
  await dbReviews.end();
});

describe("Reviews Endpoints", () => {
  it("should add a review to item 2", async () => {
    const res = await requestReviews(appReviews)
      .post("/api/items/2/reviews")
      .set("Authorization", `Bearer ${reviewToken}`)
      .send({ score: 5, body: "Amazing place!" });
    expect(res.statusCode).toBe(201);
    expect(res.body.body).toBe("Amazing place!");
  });
});
