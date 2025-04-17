import express from "express";
import {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import {
  authenticateUser,
  authorizePermission,
} from "../middleware/authentication.js";

const router = express.Router();

router
  .route("/")
  .post(authenticateUser, authorizePermission("Admin"), createProduct)
  .get(authenticateUser, authorizePermission("Admin", "Staff"), getAllProducts);

router
  .route("/:id")
  .get(
    authenticateUser,
    authorizePermission("Admin", "Staff"),
    getSingleProduct
  )
  .patch(authenticateUser, authorizePermission("Admin"), updateProduct)
  .delete(authenticateUser, authorizePermission("Admin"), deleteProduct);

export default router;
