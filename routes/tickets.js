const { Router } = require("express");
const controller = require("../controllers/tickets");
const guard = require("../middleware/guard");

const router = Router();

router.post("/", guard.authenticateToken, controller.addTicket);

router.delete(
  "/:workspaceId/:ticketId",
  guard.authenticateToken,
  controller.deleteTicket
);

router.patch("/:ticketId", guard.authenticateToken, controller.editTicket);

module.exports = router;
