const requestComments = require("supertest");
const appComments = require("../app");
const dbComments = require("../db");
let commentToken;
let userId;

beforeAll(async () => {
  const email = `commenter${Date.now()}@example.com`;
  const password = "password123";

  await requestComments(appComments)
    .post("/api/auth/register")
    .send({
      username: "commenter_" + Date.now(),
      email,
      password,
    });

  const loginRes = await requestComments(appComments)
    .post("/api/auth/login")
    .send({ email, password });
  commentToken = loginRes.body.token;

  const userRes = await dbComments.query(
    "SELECT id FROM users WHERE email = $1",
    [email]
  );
  userId = userRes.rows[0].id;

  await dbComments.query(`
    INSERT INTO items (id, name, description)
    VALUES (1, 'Comment Item', 'For comment test')
    ON CONFLICT (id) DO NOTHING
  `);

  await dbComments.query(
    `
    INSERT INTO reviews (id, user_id, item_id, score, body)
    VALUES (1, $1, 1, 5, 'Great test review')
    ON CONFLICT (id) DO NOTHING
  `,
    [userId]
  );
});

afterAll(async () => {
  await dbComments.end();
});

describe("Comments Endpoints", () => {
  it("should add a comment to review 1", async () => {
    const res = await requestComments(appComments)
      .post("/api/reviews/1/comments")
      .set("Authorization", `Bearer ${commentToken}`)
      .send({ body: "Absolutely agree!" });
    expect(res.statusCode).toBe(201);
    expect(res.body.body).toBe("Absolutely agree!");
  });
});
