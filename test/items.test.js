const requestItems = require("supertest");
const appItems = require("../app");

describe("Items Endpoints", () => {
  it("should fetch all items", async () => {
    const res = await requestItems(appItems).get("/api/items");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
