const pool = require("../../db");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");


// Create a new post
router.post("/", (req, res) => {
    const { pin_id, user_id, post_detail, post_image } = req.body;

    if (!pin_id || !user_id || !post_detail || !post_image) {
        return res.status(400).json({
            error: true,
            message: "Please provide pin_id, user_id, post_detail, and post_image.",
        });
    }

    const query =
        "INSERT INTO posts (pin_id, user_id, post_detail, post_image, posted_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING *";
    const values = [pin_id, user_id, post_detail, post_image];

    pool.query(query, values, (error, results) => {
        if (error) {
            console.error("Error creating post:", error);
            return res.status(500).json({
                error: true,
                message: "An error occurred while creating the post.",
            });
        }

        return res.json({
            error: false,
            data: results.rows[0],
            message: "Post successfully added.",
        });
    });
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

module.exports = router;