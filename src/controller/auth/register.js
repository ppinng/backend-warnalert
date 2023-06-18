const pool = require("../../../db");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
//Post users
//Register
router.post("/", async (req, res) => {
  try {
    const { username, email, pass: plainPass } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).send({
        error: true,
        message: "Invalid email format",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(plainPass, salt);

    const query = "SELECT * FROM Users WHERE email = $1 OR username = $2";
    const result = await pool.query(query, [email, username]);

    if (result.rows && result.rows.length > 0) {
      const user = result.rows[0];

      if (user.email === email) {
        return res.status(400).send({
          error: true,
          message: "Email already exists.",
        });
      } else if (user.username === username) {
        return res.status(400).send({
          error: true,
          message: "Username already exists.",
        });
      }
    } else {
      const insertQuery =
        "INSERT INTO Users(username, email, pass) VALUES($1, $2, $3)";
      await pool.query(insertQuery, [username, email, hashedPass]);

      return res.send({
        error: false,
        message: "User successfully added",
      });
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
