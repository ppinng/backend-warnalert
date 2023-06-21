const pool = require("../../db");
const express = require("express");
const verifyToken = require("./auth/verifytoken");
const router = express.Router();


//Create new post
router.post("/", verifyToken, (req, res) => {
    let user_id = req.user.user_id;
    let pin_id = req.body.pin_id;
    let post_detail = req.body.post_detail;
    let post_image = req.body.post_image;
  
    if (!post_detail || !post_image || !pin_id) {
      return res.status(400).send({
        error: true,
        message: "Please provide post_detail, post_image, and pin_id.",
      });
    } else {
      pool.query(
        "INSERT INTO Posts(pin_id, user_id, post_detail, post_image, posted_at) VALUES($1, $2, $3, $4, NOW() AT TIME ZONE 'Asia/Bangkok')",
        [pin_id, user_id, post_detail, post_image],
        (error, results) => {
          if (error) {
            throw error;
          }
  
          return res.send({
            error: false,
            data: results.rows,
            message: "Pin successfully added",
          });
        }
      );
    }
  });

// Retrieve all posts
router.get("/", (req, res) => {
    const query = "SELECT * FROM posts";

    pool.query(query, (error, results) => {
        if (error) {
            console.error("Error retrieving posts:", error);
            return res.status(500).json({
                error: true,
                message: "An error occurred while retrieving posts.",
            });
        }

        return res.json({
            error: false,
            data: results.rows,
            message: "Successfully retrieved all posts.",
        });
    });
});

// Retrieve posts by pin ID
router.get("/:pin_id", (req, res) => {
    const pinId = req.params.pin_id;
    const query = "SELECT * FROM posts WHERE pin_id = $1";

    pool.query(query, [pinId], (error, results) => {
        if (error) {
            console.error("Error retrieving posts by pin ID:", error);
            return res.status(500).json({
                error: true,
                message: "An error occurred while retrieving posts.",
            });
        }

        return res.json({
            error: false,
            data: results.rows,
            message: "Successfully retrieved posts by pin ID.",
        });
    });
});

// Delete a post by post_idHomes
router.delete("/:post_id", (req, res) => {
    const postId = req.params.post_id;
    const query = "DELETE FROM posts WHERE post_id = $1 RETURNING *";

    pool.query(query, [postId], (error, results) => {
        if (error) {
            console.error("Error deleting post:", error);
            return res.status(500).json({
                error: true,
                message: "An error occurred while deleting the post.",
            });
        }

        if (results.rowCount === 0) {
            return res.status(404).json({
                error: true,
                message: "Post not found.",
            });
        }

        return res.json({
            error: false,
            message: "Post successfully deleted.",
        });
    });
});

module.exports = router;