const pool = require("../../../db");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  try {
    const { email, pass, confirmpass } = req.body;

    // Perform necessary validations on the password and confirmPassword fields

    if (pass !== confirmpass) {
      return res.send({
        error: true,
        message: "Passwords do not match",
      });
    } else {
      // Hash the password
      const hashedPassword = await bcrypt.hash(pass, 10);

      // Update the user's password in the database
      const query = "UPDATE Users SET pass = $1 WHERE email = $2";
      await pool.query(query, [hashedPassword, email]);
      return res
        .status(200)
        .send({ error: false, message: "Password reset successful" });
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
