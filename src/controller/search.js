const pool = require("../../db");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const searchTerm = req.query.term; // Get the search term from the query parameters

  const query = `
  SELECT
  Pins.pin_id,    
  Pins.location_name,
  Pins.latitude,
  Pins.longitude,
  COUNT(Posts.post_id) AS post_count,
  array_agg(Posts.post_detail) AS post_details,
  array_agg(Posts.post_image) AS post_images,
  array_agg(to_char(Posts.posted_at, 'YYYY-MM-DD HH24:MI:SS')) AS posted_at_formatted,
  array_agg(Users.profile_image) AS profile_images,
  array_agg(
      now() - Posts.posted_at
  ) AS time_ago
FROM
  Pins
  LEFT JOIN Posts ON Pins.pin_id = Posts.pin_id
  LEFT JOIN Users ON Posts.user_id = Users.user_id
WHERE
  Pins.location_name ILIKE $1 || '%'
GROUP BY
  Pins.pin_id,
  Pins.location_name,
  Pins.latitude,
  Pins.longitude
LIMIT 10;
  `;

  pool.query(query, [searchTerm], (err, result) => {
    if (err) {
      console.error("Error executing search query:", err);
      res.status(500).json({ error: true, message: "An error occurred" });
    } else {
      const formattedResult = result.rows.map((row) => {
        return {
          location_name: row.location_name,
          pin_id: row.pin_id,
          latitude: row.latitude,
          longitude: row.longitude,
          post_count: parseInt(row.post_count, 10),
          posts: row.post_details.map((postDetail, index) => {
            return {
              post_detail: postDetail,
              post_image: row.post_images[index],
              posted_at_formatted: row.posted_at_formatted[index],
              profile_image: row.profile_images[index],
              time_ago: row.time_ago[index],
            };
          }),
        };
      });

      res.json(formattedResult);
    }
  });
});

module.exports = router;

// router.get("/", (req, res) => {
//   const searchTerm = req.query.term; // Get the search term from the query parameters

//   const query = `
//   SELECT
//   Pins.pin_id,
//   Pins.location_name,
//   Pins.latitude,
//   Pins.longitude,
//   Posts.post_detail,
//   Posts.post_image,
//   to_char(Posts.posted_at, 'YYYY-MM-DD HH24:MI:SS') AS posted_at_formatted,
//   Users.profile_image
// FROM
//   Pins
//   LEFT JOIN Posts ON Pins.pin_id = Posts.pin_id
//   LEFT JOIN Users ON Posts.user_id = Users.user_id
// WHERE
//   Pins.location_name ILIKE $1
// LIMIT 10;
// `;

//   pool.query(query, [`%${searchTerm}%`], (err, result) => {
//     if (err) {
//       console.error("Error executing search query:", err);
//       res.status(500).json({ error: true, message: "An error occurred" });
//     } else {
//       res.json(result.rows);
//     }
//   });
// });
