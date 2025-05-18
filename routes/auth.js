const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const router = express.Router();

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });

// registering here!
router.post("/register", async (req, res) => {
  // post request to the register route
  try {
    const { username, email, password } = req.body; // fields needed to register

    const existing = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]); // query the db to retrieve email
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hashing here!!!!!
    const hashed = await bcrypt.hash(password, 10); //salt 10 times
    const result = await db.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id",
      [username, email, hashed]
    ); // send db query

    const token = generateToken(result.rows[0].id);
    return res.status(201).json({ token });
  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({ message: "Something went wrong" });
  } // if correct then return a token and the user is now logged in
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ message: "Invalid credentials" });
    } // check against the hashed password - if hashed doesn't match = Invalid

    const token = generateToken(user.id);
    return res.json({ token });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
