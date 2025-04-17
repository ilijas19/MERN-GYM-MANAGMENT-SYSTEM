import express from "express";
//PACKAGE PAYMENTS
import {
  getAllPackagePayments,
  getPackageRevenue,
  getTotalPackagePayments,
  getMonthPackagePayments,
} from "../controllers/paymentController.js";
// PRODUCT PAYMENTS
import {
  createProductPayment,
  getAllProductPayments,
  getSingleProductPayment,
  getTotalProductRevenue,
  getMonthProductRevenue,
} from "../controllers/paymentController.js";

import {
  authenticateUser,
  authorizePermission,
} from "../middleware/authentication.js";

const router = express.Router();

// ---------------------------------------
// PRODUCT PAYMENT
// ---------------------------------------
router
  .route("/productPayment")
  .get(authenticateUser, authorizePermission("Staff"), getAllProductPayments)
  .post(authenticateUser, authorizePermission("Staff"), createProductPayment);

router
  .route("/productPayment/total")
  .get(authenticateUser, authorizePermission("Staff"), getTotalProductRevenue);
router
  .route("/productPayment/month")
  .get(authenticateUser, authorizePermission("Staff"), getMonthProductRevenue);

router
  .route("/productPayment/:id")
  .get(authenticateUser, authorizePermission("Staff"), getSingleProductPayment);

// ---------------------------------------
//PACKAGE PAYMENTS
// ---------------------------------------
router
  .route("/packagePayment")
  .get(authenticateUser, authorizePermission("Admin"), getAllPackagePayments);

router.get(
  "/packagePayment/total",
  authenticateUser,
  authorizePermission("Admin"),
  getTotalPackagePayments
);

router.get(
  "/packagePayment/month",
  authenticateUser,
  authorizePermission("Admin"),
  getMonthPackagePayments
);

router
  .route("/packagePayment/:id")
  .get(authenticateUser, authorizePermission("Admin"), getPackageRevenue);

export default router;
