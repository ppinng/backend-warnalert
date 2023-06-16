const pool = require("../../db");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

//Post users
router.post("/", (req, res) => {
  let username = req.body.username;
  let email = req.body.email;
  let plainPass = req.body.pass;
  bcrypt.genSalt(10, (err, salt) => {
    if (err) throw err;
    bcrypt.hash(plainPass, salt, (err, hashedPass) => {
      if (err) throw err;
      pool.query(
        "SELECT * FROM Users WHERE Users.email = $1",
        [email],
        (error, results) => {
          if (results.rows.length) {
            res.send("Email already exists.");
          } else if (!username || !email || !plainPass) {
            return res.status(400).send({
              error: true,
              message: "Please provide username, email, and password.",
            });
          } else {
            pool.query(
              "INSERT INTO Users(username, email, pass) VALUES($1, $2, $3)",
              [username, email, hashedPass],
              (error, results, fields) => {
                if (error) throw error;
                return res.send({
                  error: false,
                  data: results,
                  message: "User successfully added",
                });
              }
            );
          }
        }
      );
    });
  });
});

//Get all users
router.get("/", (req, res) => {
  let user_id = req.params.user_id;
  pool.query("SELECT * FROM Users", (error, results, fields) => {
    if (error) throw error;

    let message = "";
    if (results == undefined || results.length == 0) {
      message = "User information is empty";
    } else {
      message = " Successfully retrieved all user info";
    }
    return res.send({ error: false, data: results.rows, message: message });
  });
});

//Get users by user_id
router.get("/:user_id", (req, res) => {
  let user_id = req.params.user_id;
  pool.query(
    "SELECT * FROM Users WHERE user_id = $1",
    [user_id],
    (error, results, fields) => {
      if (error) throw error;

      let message = "";
      if (results == undefined || results.length == 0) {
        message = "User information is empty";
      } else {
        message = " Successfully retrieved user id";
      }
      return res.send({ error: false, data: results.rows, message: message });
    }
  );
});

//Update username by user_id
router.put("/:user_id", (req, res) => {
  let user_id = req.params.user_id; // Use req.params to retrieve the user_id from the URL path
  let username = req.body.username;

  if (!user_id || !username) {
    return res
      .status(400)
      .send({ error: true, message: "Please provide user_id and username" });
  } else {
    pool.query(
      "UPDATE Users SET username = $1 WHERE user_id = $2",
      [username, user_id],
      (error, results) => {
        if (error) throw error;

        let message = "";
        if (results.rowCount === 0) {
          message = "Username not found or username is the same";
        } else {
          message = "Username successfully updated";
        }

        return res.send({ error: false, data: results.rows, message: message });
      }
    );
  }
});

module.exports = router;
