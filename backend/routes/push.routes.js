const router = require("express").Router();
const { chooseAuth } = require("../middlewares/auth.middleware");
const pushController = require("../controllers/push.controller");



router.post("/register-token", chooseAuth, pushController.saveDeviceToken);

module.exports = router;