import { StatusCodes } from "http-status-codes";
import CustomApiError from "../errors/custom-error.js";

const errorHandler = async (err, req, res, next) => {
  if (err instanceof CustomApiError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ msg: err.message });
};

export default errorHandler;
