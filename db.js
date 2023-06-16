// const { Pool } = require("pg");

// const pool = new Pool({
//   user: "ppinng",
//   host: "warnalert-db-4998.8nk.cockroachlabs.cloud",
//   database: "defaultdb",
//   password: process.env.PASSWORD,
//   port: "26257",
// });

const { Client } = require("pg");
require("dotenv").config();
const client = new Client({
  connectionString: process.env.CONNECTIONSTRING,
  ssl: true, // Enable SSL encryption
});

client.connect();
module.exports = client;

// app.get("/", (req, res) => {
//   return res.send({
//     error: false,
//     message: "Welcome to RESTFUL CRUD API with NodeJS",
//     written_by: "Thiti",
//   });
// });

// // retrive all books
// app.get("/user_info", (req, res) => {
//   dbCon.query("SELECT * FROM user_info", (error, results, fields) => {
//     if (error) throw error;

//     let message = "";
//     if (results == undefined || results.length == 0) {
//       message = "User information is empty";
//     } else {
//       message = " Successfully retrieved all user info";
//     }
//     return res.send({ error: false, data: results, message: message });
//   });
// });

// // add a new user
// app.post("/register", (req, res) => {
//   let username = req.body.username;
//   let email = req.body.email;
//   let pass = req.body.pass;

//   // Validation
//   if (!username || !email || !pass) {
//     return res.status(400).send({
//       error: true,
//       message: "Please provide username, email, and password.",
//     });
//   } else {
//     dbCon.query(
//       "INSERT INTO user_info(uid, username, email, pass) VALUES(UUID(), ?, ?, ?)",
//       [username, email, pass],
//       (error, results, fields) => {
//         if (error) throw error;
//         return res.send({
//           error: false,
//           data: results,
//           message: "User successfully added",
//         });
//       }
//     );
//   }
// });

// //retrieve user info by uid
// app.get("/user_info/:uid", (req, res) => {
//   let uid = req.params.uid;
//   if (!uid) {
//     return res.status(400).send({ error: true, message: "Please provide uid" });
//   } else {
//     dbCon.query(
//       "SELECT * FROM user_info WHERE uid = ?",
//       uid,
//       (error, results, fields) => {
//         if (error) throw error;

//         let message = "";
//         if (results == undefined || results.length == 0) {
//           message = "UID not found";
//         } else {
//           message = "Successfully retrieved uid";
//         }
//         return res.send({ error: false, data: results[0], message: message });
//       }
//     );
//   }
// });

// // update user with uid
// app.put("/user_info", (req, res) => {
//   let uid = req.body.uid;
//   let username = req.body.username;

//   //validation
//   if (!uid || !username) {
//     return res
//       .status(400)
//       .send({ error: true, message: "Please provide uid and username" });
//   } else {
//     dbCon.query(
//       "UPDATE user_info SET username=? WHERE uid=?",
//       [username, uid], //need yo put what you want to change first after that put your data of where condition
//       (error, results, fields) => {
//         if (error) throw error;

//         let message = "";
//         if (results.changedRows === 0) {
//           message = "Username not found or data are same";
//         } else {
//           message = "Username successfully updated";
//         }
//         return res.send({ error: false, data: results, message: message });
//       }
//     );
//   }
// });

// // delete user info by uid
// app.delete("/user_info", (req,res)=>{
//     let uid = req.body.uid;

//     if(!uid){
//         return res.status(400). send({error:true, message:"Please provide uid"});
//     }else{
//         dbCon.query('DELETE FROM user_info WHERE uid=?', [uid], (error, results, fields)=>{
//             if(error) throw error;

//             let message ="";
//             if(results.affectedRows ===0){
//                 message = "User info not found";
//             }else{
//                 message = "Successfully deleted account"
//             }
//             return res.send({error: false, data: results, message: message})
//         })
//     }
// })

// app.listen(3000, () => {
//   console.log("Nodejs is running on port 3000");
// });
// module.exports = app;
