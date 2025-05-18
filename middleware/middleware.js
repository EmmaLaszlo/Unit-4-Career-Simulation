require("dotenv").config();
const jwt = require("jsonwebtoken");
const db = require("../db");

// just looked up the code for this part - checking if the user is logged in
exports.protect = async (req, res, next) => {
  // defines the protect middleware
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    // if the authorization DOES NOT begin with Bearer token then response status is unauthorized
    return res.status(401).json({ message: "No token" });
  }

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // verifies their JWT token
    // if the token is valid, it attaches the user’s data to the request so the route can use it
    const user = await db.query("SELECT * FROM users WHERE id = $1", [
      decoded.id, // decoded token includes the id number as well so we need to fetch that
    ]);
    req.user = user.rows[0];
    next(); // pass the request to the actual route handler
  } catch (err) {
    console.error("AUTH ERROR:", err.message);
    return res.status(401).json({ message: "Token failed" });
  }
};
