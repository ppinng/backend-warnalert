const pool = require("../../../db");
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

// Login
router.post("/", async (req, res) => {
  try {
    const username = req.body.username;
    const pass = req.body.pass;

    const query = "SELECT * FROM Users WHERE username = $1";
    const result = await pool.query(query, [username]);

    if (result.rows.length === 0) {
      // User not found
      return res.status(401).send({ error: "Invalid username or password" });
    }

    const user = result.rows[0];

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(pass, user.pass);

    if (passwordMatch) {
      // Passwords match, user is authenticated
      return res.send({ message: "Login successful" });
    } else {
      // Passwords don't match
      return res.status(401).send({ error: "Invalid username or password" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      error: true,
      message: "An error occurred while processing the request",
    });
  }
});

module.exports = router;
