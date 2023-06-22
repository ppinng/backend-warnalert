const pool = require("../../../db");
const express = require("express");
const router = express.Router();

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

router.post("/", async (req, res) => {
  try {
    const email = req.body.email;
    if (!isValidEmail(email)) {
      return res.status(400).send({
        error: true,
        message: "Invalid email format",
      });
    }

    const query = "SELECT * FROM Users WHERE email = $1";
    const result = await pool.query(query, [email]);
    if (result.rowCount > 0 && result.rows[0].email === email) {
      // Email exists, return success status
      return res
        .status(200)
        .send({ error: false, message: "Email is correct" });
    } else {
      // Email does not exist, return error status
      return res.status(400).send({
        error: true,
        message: "Invalid email",
      });
    }
  } catch (error) {
    console.error(error);
    return res.send({
      error: true,
      message: "An error occurred while processing the request",
    });
  }
});

module.exports = router;
