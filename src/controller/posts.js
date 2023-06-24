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
// Retrieve posts by pin ID
router.get("/:pin_id", (req, res) => {
    const pinId = req.params.pin_id;
    const query = `
    SELECT 
      post_id, pin_id, user_id, post_detail, post_image,
      posted_at AT TIME ZONE 'Asia/Bangkok' AS posted_at,
      CASE
        WHEN EXTRACT(EPOCH FROM NOW() AT TIME ZONE 'Asia/Bangkok' - posted_at) < 60 THEN 'Just Now'
        WHEN EXTRACT(EPOCH FROM NOW() AT TIME ZONE 'Asia/Bangkok' - posted_at) < 3600 THEN EXTRACT(MINUTE FROM NOW() AT TIME ZONE 'Asia/Bangkok' - posted_at)::int || ' min ago'
        WHEN EXTRACT(EPOCH FROM NOW() AT TIME ZONE 'Asia/Bangkok' - posted_at) < 86400 THEN EXTRACT(HOUR FROM NOW() AT TIME ZONE 'Asia/Bangkok' - posted_at)::int || ' hour ago'
        WHEN EXTRACT(EPOCH FROM NOW() AT TIME ZONE 'Asia/Bangkok' - posted_at) < 604800 THEN EXTRACT(DAY FROM NOW() AT TIME ZONE 'Asia/Bangkok' - posted_at)::int || ' day ago'
        ELSE (EXTRACT(EPOCH FROM NOW() AT TIME ZONE 'Asia/Bangkok' - posted_at) / 604800)::int || ' week ago'
      END AS time_ago
    FROM posts
    WHERE pin_id = $1
    ORDER BY posted_at DESC`;
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

// Delete a post by post_id
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

// Update a post by post_id with new image
router.put("/:post_id", verifyToken, (req, res) => {
    const postId = req.params.post_id;
    const { post_detail, post_image } = req.body;
  
    if (!post_detail || !post_image) {
      return res.status(400).json({
        error: true,
        message: "Please provide post_detail and post_image.",
      });
    }
  
    const query = `
      UPDATE posts
      SET post_detail = $1, post_image = $2
      WHERE post_id = $3
      RETURNING *
    `;
  
    pool.query(
      query,
      [post_detail, post_image, postId],
      (error, results) => {
        if (error) {
          console.error("Error updating post:", error);
          return res.status(500).json({
            error: true,
            message: "An error occurred while updating the post.",
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
          data: results.rows[0],
          message: "Post successfully updated.",
        });
      }
    );
  });

// Update a post by post_id with out image
router.put("/:post_id", verifyToken, (req, res) => {
    const postId = req.params.post_id;
    const { post_detail } = req.body;
  
    if (!post_detail ) {
      return res.status(400).json({
        error: true,
        message: "Please provide post_detail.",
      });
    }
  
    const query = `
      UPDATE posts
      SET post_detail = $1
      WHERE post_id = $2
      RETURNING *
    `;
  
    pool.query(
      query,
      [post_detail, postId],
      (error, results) => {
        if (error) {
          console.error("Error updating post:", error);
          return res.status(500).json({
            error: true,
            message: "An error occurred while updating the post.",
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
          data: results.rows[0],
          message: "Post successfully updated.",
        });
      }
    );
  });
module.exports = router;