import User from "../models/User.js";
import CustomError from "../errors/errorIndex.js";
import { StatusCodes } from "http-status-codes";

export const getUserProfile = async (req, res) => {
  const user = await User.findOne({ _id: req.user._id })
    .select("-password -__v")
    .populate({
      path: "package",
      select: "name",
    })
    .populate({ path: "trainer", select: "fullName userId profilePicture" });
  if (!user) {
    throw new CustomError.UnauthenticatedError("Authentication Error");
  }
  res.status(StatusCodes.OK).json({ user });
};

export const updateUserInfo = async (req, res) => {
  const { fullName, email, profilePicture } = req.body;

  const user = await User.findOne({ userId: req.user.userId });
  if (!user) {
    throw new CustomError.NotFoundError("User Not Found");
  }
  user.fullName = fullName || user.fullName;
  user.email = email || user.email;
  user.profilePicture = profilePicture || user.profilePicture;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Profile Updated" });
};

export const updateUserPassword = async (req, res) => {
  const { newPassword, confirmNewPassword, oldPassword } = req.body;
  if (!newPassword || !confirmNewPassword || !oldPassword) {
    throw new CustomError.BadRequestError("All credientials must be provided");
  }
  if (newPassword !== confirmNewPassword) {
    throw new CustomError.BadRequestError("Passwords do not match");
  }
  const user = await User.findOne({ userId: req.user.userId });
  if (!user) {
    throw new CustomError.UnauthenticatedError("Authentication Error");
  }
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.BadRequestError("Wrong Password");
  }
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Password Updated" });
};
