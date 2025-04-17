import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema(
  {
    refreshToken: {
      type: String,
      required: [true, "Please provide refresh token"],
    },
    ip: {
      type: String,
      required: [true, "Please provide ip"],
    },
    userAgent: {
      type: String,
      required: [true, "Please provide user agent"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
    isValid: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Token = mongoose.model("Token", tokenSchema);
export default Token;
