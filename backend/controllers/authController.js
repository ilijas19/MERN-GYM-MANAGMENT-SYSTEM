import { StatusCodes } from "http-status-codes";
import crypto from "crypto";
import User from "../models/User.js";
import Token from "../models/Token.js";
import CustomError from "../errors/errorIndex.js";
import { attachCookiesToResponse } from "../utils/jwt.js";
import createTokenUser from "../utils/createTokenUser.js";

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError("All credientials must be provided");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.BadRequestError("Invalid Credientials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.BadRequestError("Invalid Credientials");
  }
  const tokenUser = createTokenUser(user);
  const existingToken = await Token.findOne({ user: tokenUser._id });
  if (existingToken) {
    attachCookiesToResponse({
      res,
      user: tokenUser,
      refreshToken: existingToken.refreshToken,
    });
    return res
      .status(StatusCodes.OK)
      .json({ msg: "Login Successfully", tokenUser });
  }
  const refreshToken = crypto.randomBytes(64).toString("hex");
  const ip = req.ip;
  const userAgent = req.headers["user-agent"];
  await Token.create({ user: tokenUser._id, ip, refreshToken, userAgent });
  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
  res.status(StatusCodes.OK).json({ msg: "Login Successfully", tokenUser });
};

export const logout = async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  await Token.findOneAndDelete({ user: req.user._id });
  res.status(StatusCodes.OK).json({ msg: "Logout" });
};

export const getCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ currentUser: req.user });
};
