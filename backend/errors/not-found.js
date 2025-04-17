import CustomApiError from "./custom-error.js";
import { StatusCodes } from "http-status-codes";

class NotFoundError extends CustomApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

export default NotFoundError;
