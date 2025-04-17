import { StatusCodes } from "http-status-codes";
import CustomError from "../errors/errorIndex.js";
import Package from "../models/Package.js";
import User from "../models/User.js";
import PackagePayment from "../models/PackagePayment.js";
import ProductPayment from "../models/ProductPayment.js";
import mongoose from "mongoose";
// ----------------------------------
//PRODUCT PAYMENTS
// ----------------------------------

export const createProductPayment = async (req, res) => {
  const { items, totalPrice } = req.body;
  if (!items || !totalPrice) {
    throw new CustomError.BadRequestError("All crediential must be provided");
  }
  const payment = await ProductPayment.create({
    items,
    totalPrice,
    workingStaffMember: req.user._id,
  });
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Payment Created", paymentId: payment._id });
};
export const getAllProductPayments = async (req, res) => {
  const { page = 1 } = req.query;
  const limit = 10;
  const skip = (page - 1) * limit;

  const total = await ProductPayment.countDocuments();

  const payments = await ProductPayment.find()
    .populate({ path: "workingStaffMember", select: "fullName userId" })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const hasNextPage = page * limit < total;

  res.status(StatusCodes.OK).json({
    nextPage: hasNextPage ? Number(page) + 1 : null,
    totalPages: Math.ceil(total / limit),
    totalItems: total,
    payments,
  });
};

export const getSingleProductPayment = async (req, res) => {
  const { id: paymentId } = req.params;

  if (!paymentId) {
    throw new CustomError.BadRequestError("paymentId needs to be provided");
  }

  const payment = await ProductPayment.findOne({ _id: paymentId })
    .populate({ path: "workingStaffMember", select: "fullName userId" })
    .populate("items.product");

  if (!payment) {
    throw new CustomError.BadRequestError(
      "Payment With Specified id was not found"
    );
  }

  res.status(StatusCodes.OK).json({ payment });
};

export const getTotalProductRevenue = async (req, res) => {
  const [stats] = await ProductPayment.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalPrice" },
        totalPayments: { $sum: 1 },
      },
    },
  ]);

  res.status(StatusCodes.OK).json({
    totalRevenue: stats?.totalRevenue || 0,
    totalPayments: stats?.totalPayments || 0,
  });
};

export const getMonthProductRevenue = async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59
  );

  const [stats] = await ProductPayment.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalPrice" },
        totalPayments: { $sum: 1 },
      },
    },
  ]);

  res.status(StatusCodes.OK).json({
    totalRevenue: stats?.totalRevenue || 0,
    totalPayments: stats?.totalPayments || 0,
  });
};

// ----------------------------------
//Package PAYMENTS
// ----------------------------------
export const getAllPackagePayments = async (req, res) => {
  const { page = 1 } = req.query;
  const limit = 10;
  const skip = (page - 1) * limit;

  const queryObject = {};

  const [payments, totalPayments] = await Promise.all([
    PackagePayment.find(queryObject)
      .sort({ createdAt: -1 }) // Sort by newest first
      .populate({
        path: "member",
        select: "userId _id fullName email",
      })
      .populate({ path: "package", select: "-__v" })
      .select("-__v")
      .skip(skip)
      .limit(limit),
    PackagePayment.countDocuments(queryObject),
  ]);

  const totalPages = Math.ceil(totalPayments / limit);
  const currentPage = Number(page);

  res.status(StatusCodes.OK).json({
    currentPage,
    totalPages,
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
    prevPage: currentPage > 1 ? currentPage - 1 : null,
    totalPayments,
    payments,
  });
};

export const getPackageRevenue = async (req, res) => {
  const { id: packageId } = req.params;
  if (!packageId) {
    throw new CustomError.BadRequestError("packageId needs to be provided");
  }

  const [stats] = await PackagePayment.aggregate([
    {
      $match: { package: new mongoose.Types.ObjectId(packageId) },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$price" },
        totalPayments: { $sum: 1 },
      },
    },
  ]);

  if (!stats) {
    throw new CustomError.NotFoundError("No payments found for this package");
  }

  res.status(StatusCodes.OK).json({
    packageId,
    totalRevenue: stats.totalRevenue,
    totalPayments: stats.totalPayments,
  });
};

export const getTotalPackagePayments = async (req, res) => {
  const [stats] = await PackagePayment.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$price" },
        totalPayments: { $sum: 1 },
      },
    },
  ]);

  res.status(StatusCodes.OK).json({
    totalRevenue: stats?.totalRevenue || 0,
    totalPayments: stats?.totalPayments || 0,
  });
};

export const getMonthPackagePayments = async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59
  );

  const [stats] = await PackagePayment.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$price" },
        totalPayments: { $sum: 1 },
      },
    },
  ]);

  res.status(StatusCodes.OK).json({
    totalRevenue: stats?.totalRevenue || 0,
    totalPayments: stats?.totalPayments || 0,
  });
};

//PRODUCT PAYMENTS
