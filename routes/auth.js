const { Router } = require("express");
const controller = require("../controllers/auth");
const validators = require("../validators/auth");

const router = Router();

router.post("/register", validators.registerValidator, controller.register);

router.post("/register/confirm/:token", controller.registerConfirmation);

router.post("/login", controller.login);

module.exports = router;
