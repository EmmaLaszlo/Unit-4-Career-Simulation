const expressItems = require("express");
const dbItems = require("../db");
const itemsRouter = expressItems.Router();

itemsRouter.get("/", async (req, res) => {
  const result = await dbItems.query("SELECT * FROM items");
  res.json(result.rows);
});

itemsRouter.get("/:itemId", async (req, res) => {
  const result = await dbItems.query("SELECT * FROM items WHERE id = $1", [
    req.params.itemId,
  ]);
  res.json(result.rows[0]);
});

itemsRouter.get("/:itemId/reviews", async (req, res) => {
  const result = await dbItems.query(
    "SELECT * FROM reviews WHERE item_id = $1",
    [req.params.itemId]
  );
  res.json(result.rows);
});

module.exports = itemsRouter;
