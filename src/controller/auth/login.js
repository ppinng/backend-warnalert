const pool = require("../../../db");
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Login
router.post("/", async (req, res) => {
  try {
    const username = req.body.username;
    const pass = req.body.pass;

    const query = "SELECT * FROM Users WHERE username = $1";
    const result = await pool.query(query, [username]);

    if (result.rows.length === 0) {
      // User not found
      return res.status(401).send({ error: true, message: "User not found" });
    }

    const user = result.rows[0];

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(pass, user.pass);

    if (passwordMatch) {
      //Create and assign token
      const token = jwt.sign(
        { user_id: user.user_id, username },
        process.env.TOKEN_SECRET
      );

      //save token
      user.token = token;

      // Passwords match, user is authenticated
      res.status(200).json({
        status: true,
        token: token,
        message: "Login Sucessful",
      });
    } else {
      // Passwords don't match
      return res
        .status(401)
        .send({ error: true, message: "Invalid username or password" });
    }
  } catch (error) {
    throw error;
  }
});

module.exports = router;
