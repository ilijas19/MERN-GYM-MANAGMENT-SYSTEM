import express from "express";
import {
  authorizePermission,
  authenticateUser,
} from "../middleware/authentication.js";
import {
  registerUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/register", registerUser);
router.get(
  "/users",
  authenticateUser,
  authorizePermission("Admin"),
  getAllUsers
);
router
  .route("/user/:id")
  .get(authenticateUser, authorizePermission("Admin"), getUserById)
  .patch(authenticateUser, authorizePermission("Admin"), updateUserById)
  .delete(authenticateUser, authorizePermission("Admin"), deleteUserById);

export default router;
