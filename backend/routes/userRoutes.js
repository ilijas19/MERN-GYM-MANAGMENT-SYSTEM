import express from "express";
import { authenticateUser } from "../middleware/authentication.js";
import {
  updateUserInfo,
  updateUserPassword,
  getUserProfile,
} from "../controllers/userController.js";
const router = express.Router();

router.patch("/updateInfo", authenticateUser, updateUserInfo);
router.patch("/updatePassword", authenticateUser, updateUserPassword);
router.get("/profile", authenticateUser, getUserProfile);

export default router;
