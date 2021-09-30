const { Router } = require("express");
const controller = require("../controllers/user");
const guard = require("../middleware/guard");

const router = Router();

router.get("/", guard.authenticateToken, controller.getUserInfo);

module.exports = router;
