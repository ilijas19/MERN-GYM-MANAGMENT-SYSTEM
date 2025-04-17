import express from "express";
import {
  authenticateUser,
  authorizePermission,
} from "../middleware/authentication.js";
import {
  registerMember,
  checkMembership,
  renewMembership,
  getSingleMember,
  getAllMembers,
  updateMember,
  deleteMember,
} from "../controllers/staffController.js";

const router = express.Router();
// /api/v1/staff

router
  .route("/")
  .get(authenticateUser, authorizePermission("Staff", "Trainer"), getAllMembers)
  .post(
    authenticateUser,
    authorizePermission("Staff", "Trainer"),
    registerMember
  );

router
  .route("/member/:id")
  .get(
    authenticateUser,
    authorizePermission("Staff", "Trainer"),
    getSingleMember
  )
  .patch(
    authenticateUser,
    authorizePermission("Staff", "Trainer"),
    updateMember
  )
  .delete(
    authenticateUser,
    authorizePermission("Staff", "Trainer"),
    deleteMember
  );

router.post(
  "/membership/check",
  authenticateUser,
  authorizePermission("Staff", "Trainer"),
  checkMembership
);

router
  .route("/membership/:id")
  .post(
    authenticateUser,
    authorizePermission("Staff", "Trainer"),
    renewMembership
  );

export default router;
