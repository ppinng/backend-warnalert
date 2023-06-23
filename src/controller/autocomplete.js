const pool = require("../../db");
const express = require("express");
const router = express.Router();
// Auto-complete endpoint
router.get("/", (req, res) => {
  const searchTerm = req.query.term; // Get the search term from the query parameters

  const query = `
      SELECT location_name FROM Pins
      WHERE location_name ILIKE $1
      LIMIT 10`;

  pool.query(query, [`%${searchTerm}%`], (err, result) => {
    if (err) {
      console.error("Error executing auto-complete query:", err);
      res.status(500).json({ error: true, message: "An error occurred" });
    } else {
      const suggestions = result.rows.map((row) => row.location_name);
      res.json({ suggestions });
    }
  });
});

module.exports = router;
