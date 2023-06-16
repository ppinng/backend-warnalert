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

app.use("/api/users", userRouter);

app.listen(3000, () => {
  console.log("Sever is now listening at port 3000");
});
