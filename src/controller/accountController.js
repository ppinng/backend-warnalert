const pool = require("../../db");

const getAccounts = (req, res) => {
  pool.query("SELECT * FROM accounts", (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};
// const getAccounts = (req, res) => {
//   console.log("getting acounts");
// };

module.exports = {
  getAccounts,
};
