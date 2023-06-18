const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.send({
    error: false,
    message: "Welcome to RESTFUL CRUD API with NodeJS",
    written_by: "Thiti",
  });
});

const userRouter = require("./src/controller/users");
const registerRouter = require("./src/controller/auth/register");
const loginRouter = require("./src/controller/auth/login");

app.use("/api/users", userRouter);
app.use("/api/auth/register", registerRouter);
app.use("/api/auth/login", loginRouter);

app.listen(3000, () => {
  console.log("Sever is now listening at port 3000");
});
