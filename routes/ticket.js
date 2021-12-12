const {
    Router
} = require("express");
const controller = require("../controllers/ticket");
const guard = require("../middleware/guard");

const router = Router();

router.get(
    "/",
    guard.authenticateToken,
    controller.getTickets
);

router.post("/column", guard.authenticateToken, controller.createColumn);

router.patch('/column', guard.authenticateToken, controller.createTicket)

router.delete('/column/:columnId', guard.authenticateToken, controller.deleteColumn)

router.delete('/column/:columnId/:ticketId', guard.authenticateToken, controller.deleteTicket)



module.exports = router;