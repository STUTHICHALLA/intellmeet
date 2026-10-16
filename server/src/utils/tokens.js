import jwt from "jsonwebtoken";

export const signAccess = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.ACCESS_SECRET, { expiresIn: "15m" });

export const signRefresh = (user) =>
  jwt.sign({ id: user._id }, process.env.REFRESH_SECRET, { expiresIn: "7d" });

export const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};