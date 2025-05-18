const expressReviews = require("express");
const dbReviews = require("../db");
const { protect: protectReview } = require("../middleware/middleware.js");
const reviewsRouter = expressReviews.Router();

reviewsRouter.post("/:itemId/reviews", protectReview, async (req, res) => {
  const { itemId } = req.params;
  const { score, body } = req.body;
  const result = await dbReviews.query(
    "INSERT INTO reviews (user_id, item_id, score, body) VALUES ($1, $2, $3, $4) RETURNING *",
    [req.user.id, itemId, score, body]
  );
  res.status(201).json(result.rows[0]);
});

reviewsRouter.put("/reviews/:reviewId", protectReview, async (req, res) => {
  const { reviewId } = req.params;
  const { score, body } = req.body;
  const result = await dbReviews.query(
    "UPDATE reviews SET score = $1, body = $2 WHERE id = $3 RETURNING *",
    [score, body, reviewId]
  );
  res.json(result.rows[0]);
});

reviewsRouter.delete("/reviews/:reviewId", protectReview, async (req, res) => {
  const { reviewId } = req.params;
  await dbReviews.query("DELETE FROM reviews WHERE id = $1", [reviewId]);
  res.sendStatus(204);
});

module.exports = reviewsRouter;
