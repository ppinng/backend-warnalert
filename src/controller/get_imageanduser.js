const pool = require("../../db");
const express = require("express");
const router = express.Router();

router.get("/:user_id", async (req, res) => {
  const user_id = req.params.user_id;

  try {
    const userResults = await pool.query(
      "SELECT username, profile_image FROM Users WHERE user_id = $1",
      [user_id]
    );

    if (userResults.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const user = userResults.rows[0];

    const data = {
      user: {
        user_id,
        username: user.username,
        profile_image: user.profile_image,
      },
    };

    res.json(data);
  } catch (error) {}
});

module.exports = router;
