const pool = require("../../db");
//Post users
const addUsers = (req, res) => {
  if (!username || !email || !pass) {
    return res.status(400).send({
      error: true,
      message: "Please provide username, email, and password.",
    });
  } else {
    pool.query(
      "INSERT INTO Users(userId, username, email, pass) VALUES(UUID(), ?, ?, ?)",
      [username, email, pass],
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
};

//Get users

module.exports = {
  addUsers,
};
