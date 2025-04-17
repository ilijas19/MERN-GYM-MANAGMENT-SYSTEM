import jwt from "jsonwebtoken";

const createJwt = ({ payload, expiresIn }) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

export const verifyJwt = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const attachCookiesToResponse = ({ res, user, refreshToken }) => {
  const accessTokenJwt = createJwt({ payload: { user }, expiresIn: "1h" });
  const refreshTokenJwt = createJwt({
    payload: { user, refreshToken },
    expiresIn: "7d",
  });

  res.cookie("accessToken", accessTokenJwt, {
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60, // 1 hour
    sameSite: "strict",
  });
  res.cookie("refreshToken", refreshTokenJwt, {
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    sameSite: "strict",
  });
};
