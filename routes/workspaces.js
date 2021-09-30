const { Router } = require("express");
const controller = require("../controllers/workspaces");
const guard = require("../middleware/guard");

const router = Router();

router.post("/", guard.authenticateToken, controller.createWorkspace);

router.get("/", guard.authenticateToken, controller.getAllWorkspaces);

router.patch("/membership", guard.authenticateToken, controller.addMember);

router.patch(
  "/membership/accept",
  guard.authenticateToken,
  controller.confirmMember
);

router.patch("/:workspaceId", guard.authenticateToken, controller.addData);

router.get("/:workspaceId", guard.authenticateToken, controller.getWorkspace);

router.delete(
  "/:workspaceId",
  guard.authenticateToken,
  controller.deleteWorkspace
);

module.exports = router;
