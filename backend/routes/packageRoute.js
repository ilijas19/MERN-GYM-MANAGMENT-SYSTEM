import express from "express";
import {
  authenticateUser,
  authorizePermission,
} from "../middleware/authentication.js";
import {
  createPackage,
  getAllPackages,
  getSinglePackage,
  deletePackage,
  updatePackage,
} from "../controllers/packageController.js";

const router = express.Router();

router
  .route("/")
  .post(authenticateUser, authorizePermission("Admin"), createPackage)
  .get(
    authenticateUser,
    authorizePermission("Admin", "Staff", "Trainer"),
    getAllPackages
  );

router
  .route("/:id")
  .get(
    authenticateUser,
    authorizePermission("Admin", "Staff"),
    getSinglePackage
  )
  .patch(authenticateUser, authorizePermission("Admin"), updatePackage)
  .delete(authenticateUser, authorizePermission("Admin"), deletePackage);

export default router;
