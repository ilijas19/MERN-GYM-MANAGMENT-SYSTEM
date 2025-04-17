import mongoose from "mongoose";

const packagePaymentSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    package: {
      type: mongoose.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("PackagePayment", packagePaymentSchema);
