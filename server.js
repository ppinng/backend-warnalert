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
const pinRouter = require("./src/controller/pins");
const checkEmailRouter = require("./src/controller/auth/checkemail");
const resetPassRouter = require("./src/controller/auth/resetpass");
const postRouter = require("./src/controller/posts");

const searchRouter = require("./src/controller/search");
// const autocompleteRouter = require("./src/controller/autocomplete");
const profileRouter = require("./src/controller/get_profile");

app.use("/api/users", userRouter);
app.use("/api/auth/register", registerRouter);
app.use("/api/auth/login", loginRouter);
app.use("/api/pins", pinRouter);
app.use("/api/auth/checkemail", checkEmailRouter);
app.use("/api/auth/reset-password", resetPassRouter);
app.use("/api/posts", postRouter);

app.use("/api/search", searchRouter);
// app.use("/api/autocomplete", autocompleteRouter);
app.use("/api/profile", profileRouter);

app.listen(3000, () => {
  console.log("Sever is now listening at port 3000");
});
