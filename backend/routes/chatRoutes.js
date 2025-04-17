import express from "express";

import {
  createChat,
  getAllChats,
  getChatMesssages,
  deleteChat,
  getTrainerChat,
} from "../controllers/chatController.js";
import {
  authenticateUser,
  authorizePermission,
} from "../middleware/authentication.js";

const router = express.Router();

router
  .route("/")
  .post(authenticateUser, authorizePermission("Trainer"), createChat)
  .get(authenticateUser, authorizePermission("Trainer"), getAllChats);

router.get("/trainerChat", authenticateUser, getTrainerChat);

router
  .route("/:id")
  .get(authenticateUser, getChatMesssages)
  .delete(authenticateUser, authorizePermission("Trainer"), deleteChat);

export default router;
