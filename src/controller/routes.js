const { Router } = require("express");
const accountController = require("./accountController");
const usersController = require("./usersController");
const router = Router();

router.get("/", accountController.getAccounts);
router.post("/", usersController.addUsers);

module.exports = router;


