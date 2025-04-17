import CustomError from "../errors/errorIndex.js";
import { StatusCodes } from "http-status-codes";
import Package from "../models/Package.js";

export const createPackage = async (req, res) => {
  const { name, price, duration } = req.body;
  if (!name || !price || !duration) {
    throw new CustomError.BadRequestError("All values must be provided");
  }
  if (price < 1 || duration < 1) {
    throw new CustomError.BadRequestError(
      "Price and Duration Must be positive values"
    );
  }
  await Package.create({ name, price, duration });
  res.status(StatusCodes.CREATED).json({ msg: "Package created" });
};

export const getAllPackages = async (req, res) => {
  const packages = await Package.find({});
  res.status(StatusCodes.OK).json({ packages });
};

export const getSinglePackage = async (req, res) => {
  const { id: packageId } = req.params;
  const gymPackage = await Package.findOne({ _id: packageId });
  if (!gymPackage) {
    throw new CustomError.NotFoundError("Package Not Found");
  }
  res.status(StatusCodes.OK).json({ package: gymPackage });
};

export const updatePackage = async (req, res) => {
  const { id: packageId } = req.params;
  const { name, price, duration } = req.body;
  const gymPackage = await Package.findOne({ _id: packageId });
  if (!gymPackage) {
    throw new CustomError.NotFoundError("Package Not Found");
  }
  gymPackage.name = name || gymPackage.name;
  gymPackage.price = price || gymPackage.price;
  gymPackage.duration = duration || gymPackage.duration;
  await gymPackage.save();
  res.status(StatusCodes.OK).json({ msg: "Package Updated" });
};

export const deletePackage = async (req, res) => {
  const { id: packageId } = req.params;
  const gymPackage = await Package.findOne({ _id: packageId });
  if (!gymPackage) {
    throw new CustomError.NotFoundError("Package Not Found");
  }
  await gymPackage.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "Package Deleted" });
};
