const express = require("express");
const accountRoutes = require("./src/controller/routes");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  return res.send({
    error: false,
    message: "Welcome to RESTFUL CRUD API with NodeJS",
    written_by: "Thiti",
  });
});

app.use("/api/v1/accounts", accountRoutes);

app.listen(3000, () => {
  console.log("Sever is now listening at port 3000");
});
