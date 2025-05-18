require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/auth");
const itemRoutes = require("./routes/items");
const reviewRoutes = require("./routes/reviews");
const commentRoutes = require("./routes/comments");

const app = express();
app.use(express.json());

app.get("/api", (req, res) => {
  res.send("API is working!");
});

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/items", reviewRoutes);
app.use("/api/reviews/:reviewId/comments", commentRoutes);

module.exports = app;
