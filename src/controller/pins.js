const pool = require("../../db");
const express = require("express");
const verifyToken = require("./auth/verifytoken");
const router = express.Router();

//Post pins
router.post("/", verifyToken, (req, res) => {
  let user_id = req.user.user_id;
  let location_name = req.body.location_name;
  let latitude = req.body.latitude;
  let longitude = req.body.longitude;

  if (!location_name || !latitude || !longitude) {
    return res.status(400).send({
      error: true,
      message: "Please provide location_name, latitude, and longitude.",
    });
  } else {
    pool.query(
      "INSERT INTO Pins(user_id, location_name, latitude, longitude) VALUES($1, $2, $3, $4)",
      [user_id, location_name, latitude, longitude],
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

// // Get all pins
// router.get("/", (req, res) => {
//   pool.query("SELECT * FROM Pins", (error, results) => {
//     if (error) throw error;

//     let message = "";
//     if (results.rowCount === 0) {
//       message = "Pin information is empty";
//     } else {
//       message = "Successfully retrieved all pin info";
//     }
//     return res.send({ error: false, data: results.rows, message: message });
//   });
// });

// // Delete pins by pin_id
// router.delete("/:pin_id", (req, res) => {
//   const pinId = req.params.pin_id;

//   pool.query(
//     "DELETE FROM Pins WHERE pin_id = $1",
//     [pinId],
//     (error, results) => {
//       if (error) {
//         throw error;
//       }

//       if (results.rowCount === 0) {
//         return res.status(404).send({
//           error: true,
//           message: "Pin not found",
//         });
//       }

//       return res.send({
//         error: false,
//         message: "Pin successfully deleted",
//       });
//     }
//   );
// });

module.exports = router;
