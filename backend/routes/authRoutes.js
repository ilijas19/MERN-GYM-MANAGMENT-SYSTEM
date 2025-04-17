import express from "express";
import {
  loginUser,
  getCurrentUser,
  logout,
} from "../controllers/authController.js";
import { authenticateUser } from "../middleware/authentication.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/logout", authenticateUser, logout);
router.get("/me", authenticateUser, getCurrentUser);

export default router;
