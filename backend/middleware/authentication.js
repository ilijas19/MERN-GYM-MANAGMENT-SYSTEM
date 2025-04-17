import CustomError from "../errors/errorIndex.js";
import { verifyJwt, attachCookiesToResponse } from "../utils/jwt.js";
import Token from "../models/Token.js";

export const authorizePermission = (...roles) => {
  return (req, res, next) => {
    if (req.user.role === "Admin") return next();
    if (roles.includes(req.user.role)) return next();
    throw new CustomError.UnauthorizedError(
      "Not Authorized to Access this route"
    );
  };
};

export const authenticateUser = async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies;
  try {
    if (!accessToken && !refreshToken) {
      throw new CustomError.UnauthenticatedError("Authentication Faileddd");
    }

    if (accessToken) {
      const decoded = verifyJwt(accessToken);
      req.user = decoded.user;
      return next();
    }
    if (refreshToken) {
      const decoded = verifyJwt(refreshToken);
      const token = await Token.findOne({
        user: decoded.user._id,
        refreshToken: decoded.refreshToken,
      });
      if (!token || !token.isValid) {
        throw new CustomError.UnauthenticatedError("Authentication Failed");
      }
      attachCookiesToResponse({
        res,
        user: decoded.user,
        refreshToken: token.refreshToken,
      });
      req.user = decoded.user;
      return next();
    }
  } catch (error) {
    throw new CustomError.UnauthenticatedError("Authentication Failed");
  }
};
