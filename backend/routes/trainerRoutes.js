import express from "express";
import {
  addClient,
  removeClient,
  getAllClients,
} from "../controllers/trainerController.js";
import {
  authenticateUser,
  authorizePermission,
} from "../middleware/authentication.js";

// /api/v1/trainer
const router = express.Router();

router.get(
  "/",
  authenticateUser,
  authorizePermission("Trainer"),
  getAllClients
);

router
  .route("/:id")
  .post(authenticateUser, authorizePermission("Trainer"), addClient)
  .delete(authenticateUser, authorizePermission("Trainer"), removeClient);

export default router;
