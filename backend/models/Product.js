import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    countInStock: {
      type: Number,
      required: true,
      min: 1,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 1,
    },
    productId: {
      type: Number,
      unique: true,
    },
  },
  { timestamps: true }
);

const generateUniqueProductId = async function () {
  let productId;
  let exists = true;
  while (exists) {
    productId = Math.floor(10000 + Math.random() * 90000);
    exists = await mongoose.model("Product").exists({ productId });
  }
  return productId;
};

productSchema.pre("save", async function (next) {
  if (!this.productId) {
    this.productId = await generateUniqueProductId();
  }
  next();
});

export default mongoose.model("Product", productSchema);
