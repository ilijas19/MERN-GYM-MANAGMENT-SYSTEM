import CustomError from "../errors/errorIndex.js";
import { StatusCodes } from "http-status-codes";
import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  const { name, image, price, countInStock } = req.body;
  if (!name || !image || !price || !countInStock) {
    throw new CustomError.BadRequestError("All credientials must be provided");
  }
  if (price < 1 || countInStock < 1) {
    throw new CustomError.BadRequestError(
      "Price and InStock must be positive values"
    );
  }
  await Product.create({ name, image, price, countInStock });
  res.status(StatusCodes.CREATED).json({ msg: "Product created" });
};
export const getAllProducts = async (req, res) => {
  const { page = 1, name, priceGte, priceLte } = req.query;

  const queryObject = {};

  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }

  if (priceGte || priceLte) {
    queryObject.price = {};
    if (priceGte) queryObject.price.$gte = Number(priceGte);
    if (priceLte) queryObject.price.$lte = Number(priceLte);
  }

  const limit = 10;
  const currentPage = Math.max(1, Number(page));
  const skip = (currentPage - 1) * limit;

  const totalProducts = await Product.countDocuments(queryObject);
  const totalPages = Math.ceil(totalProducts / limit);

  const products = await Product.find(queryObject)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(StatusCodes.OK).json({
    currentPage,
    totalPages,
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
    prevPage: currentPage > 1 ? currentPage - 1 : null,
    totalProducts,
    products,
  });
};

export const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  if (!productId) {
    throw new CustomError.BadRequestError("Product Id needs to be provided");
  }
  const product = await Product.findOne({ productId });
  if (!product) {
    throw new CustomError.NotFoundError(
      "Product with specified id was not found"
    );
  }
  res.status(StatusCodes.OK).json({ product });
};

export const updateProduct = async (req, res) => {
  const { name, image, price, countInStock } = req.body;
  const { id: productId } = req.params;
  if (!productId) {
    throw new CustomError.BadRequestError("Product Id needs to be provided");
  }
  const product = await Product.findOne({ productId });
  if (!product) {
    throw new CustomError.NotFoundError(
      "Product with specified id was not found"
    );
  }
  product.name = name || product.name;
  product.image = image || product.image;
  product.price = price || product.price;
  product.countInStock = countInStock || product.countInStock;
  await product.save();
  res.status(StatusCodes.OK).json({ msg: "Product Updated" });
};

export const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  if (!productId) {
    throw new CustomError.BadRequestError("Product Id needs to be provided");
  }
  const product = await Product.findOne({ productId });
  if (!product) {
    throw new CustomError.NotFoundError(
      "Product with specified id was not found"
    );
  }
  await product.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "Product Deleted" });
};
