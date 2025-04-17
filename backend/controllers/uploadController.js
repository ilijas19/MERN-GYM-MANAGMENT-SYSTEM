import CustomError from "../errors/errorIndex.js";
import { StatusCodes } from "http-status-codes";
import { v2 as cloudinary } from "cloudinary";
import checkFile from "../utils/checkFile.js";
import fs from "fs";

const uploadImage = async (req, res) => {
  const file = req?.files?.image;
  if (!file) {
    throw new CustomError.BadRequestError("File must be provided");
  }
  const fileCheck = checkFile(file);
  const filePath = file.tempFilePath;

  if (!fileCheck) {
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting temp file:", err);
    });
    throw new CustomError.BadRequestError("File not Supported");
  }

  const { secure_url } = await cloudinary.uploader.upload(filePath, {
    folder: "gym-system",
  });

  fs.unlink(filePath, (err) => {
    if (err) console.error("Error deleting temp file:", err);
  });

  if (!secure_url) {
    throw new CustomError.BadRequestError("Error while uploading");
  }
  res.status(StatusCodes.OK).json({ msg: "Image Uploaded", url: secure_url });
};

export { uploadImage };
