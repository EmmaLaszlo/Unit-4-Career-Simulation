const express = require("express");
const db = require("../db");
const { protect } = require("../middleware/middleware.js");
const router = express.Router({ mergeParams: true });

router.post("/", protect, async (req, res) => {
  const { reviewId } = req.params;
  const { body } = req.body;
  const result = await db.query(
    "INSERT INTO comments (user_id, review_id, body) VALUES ($1, $2, $3) RETURNING *",
    [req.user.id, reviewId, body]
  );
  res.status(201).json(result.rows[0]);
});

router.put("/comments/:commentId", protect, async (req, res) => {
  const { commentId } = req.params;
  const { body } = req.body;
  const result = await db.query(
    "UPDATE comments SET body = $1 WHERE id = $2 RETURNING *",
    [body, commentId]
  );
  res.json(result.rows[0]);
});

router.delete("/comments/:commentId", protect, async (req, res) => {
  const { commentId } = req.params;
  await db.query("DELETE FROM comments WHERE id = $1", [commentId]);
  res.sendStatus(204);
});

module.exports = router;
