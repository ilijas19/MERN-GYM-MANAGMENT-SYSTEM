import User from "../models/User.js";
import CustomError from "../errors/errorIndex.js";
import { StatusCodes } from "http-status-codes";
import Package from "../models/Package.js";

export const registerUser = async (req, res) => {
  const { fullName, email, role, password } = req.body;
  if (!fullName || !email) {
    throw new CustomError.BadRequestError("All credientials must be provided");
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new CustomError.BadRequestError("Email already in use");
  }

  const user = await User.create({
    fullName,
    email,
    role,
    password,
  });

  res.status(StatusCodes.CREATED).json({
    msg: "User Created",
    fullName,
    email,
    userId: user.userId,
  });
};

export const getAllUsers = async (req, res) => {
  const { page = 1, fullName, role, gymPackage } = req.query;
  const queryObject = {};
  const limit = 10;
  // Filtering logic
  if (fullName) queryObject.fullName = { $regex: fullName, $options: "i" };
  if (role) queryObject.role = role;
  if (gymPackage) queryObject.package = gymPackage;

  const totalUsers = await User.countDocuments(queryObject);

  const totalPages = Math.ceil(totalUsers / limit);

  const users = await User.find(queryObject)
    .select("-password -__v")
    .populate({ path: "package", select: "name" })
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .lean();

  const nextPage = page < totalPages ? Number(page) + 1 : null;

  return res.status(200).json({
    page: Number(page),
    limit: Number(limit),
    totalUsers,
    totalPages,
    nextPage,
    users,
  });
};

export const getUserById = async (req, res) => {
  const { id: userId } = req.params;
  if (!userId) {
    throw new CustomError.BadRequestError("userId needs to be provided");
  }
  const user = await User.findOne({ userId })
    .select("-password -__v")
    .populate({ path: "package", select: "name" });
  if (!user) {
    throw new CustomError.NotFoundError("User Not Found");
  }
  res.status(StatusCodes.OK).json({ user });
};

export const updateUserById = async (req, res) => {
  const { fullName, email, role, note } = req.body;
  const { id: userId } = req.params;
  if (!userId) {
    throw new CustomError.BadRequestError("userId needs to be provided");
  }
  const user = await User.findOne({ userId });
  if (!user) {
    throw new CustomError.NotFoundError("User Not Found");
  }
  user.fullName = fullName || user.fullName;
  user.email = email || user.email;
  user.role = role || user.role;
  user.note = note || user.note;

  await user.save();
  res.status(StatusCodes.OK).json({ msg: "User Updated" });
};

export const deleteUserById = async (req, res) => {
  const { id: userId } = req.params;
  if (!userId) {
    throw new CustomError.BadRequestError("userId needs to be provided");
  }
  const user = await User.findOne({ userId });
  if (!user) {
    throw new CustomError.NotFoundError("User Not Found");
  }
  await user.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "User Deleted" });
};
