const pool = require("../../db");
const express = require("express");
const router = express.Router();

// GET user profile
router.get("/:user_id", async (req, res) => {
  const user_id = req.params.user_id;

  try {
    // Fetch user data
    const userResults = await pool.query(
      "SELECT username, profile_image FROM Users WHERE user_id = $1",
      [user_id]
    );

    if (userResults.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userResults.rows[0];

    // Fetch pins for the user
    const pinResults = await pool.query(
      "SELECT pin_id, location_name FROM Pins WHERE user_id = $1",
      [user_id]
    );

    // Fetch posts for the user
    const postResults = await pool.query(
      "SELECT post_id, pin_id, post_image, post_detail FROM Posts WHERE user_id = $1",
      [user_id]
    );

    // Organize pins and posts into the desired structure
    const pins = pinResults.rows.map((pin) => {
      const posts = postResults.rows.filter(
        (post) => post.pin_id === pin.pin_id
      );
      return {
        pin_id: pin.pin_id,
        location_name: pin.location_name,
        posts,
      };
    });

    const data = {
      user: {
        user_id,
        username: user.username,
        profile_image: user.profile_image,
        // banner_image: user.banner_image,
      },
      pins,
    };

    res.json(data);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT update username
router.put("/:user_id", async (req, res) => {
  const user_id = req.params.user_id;
  const { username } = req.body;

  try {
    const updateQuery = "UPDATE Users SET username = $1 WHERE user_id = $2";
    await pool.query(updateQuery, [username, user_id]);

    res.json({ success: true });
  } catch (error) {
    console.error("Error updating username:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
