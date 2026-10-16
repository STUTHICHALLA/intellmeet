import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { signAccess, signRefresh, refreshCookieOptions } from "../utils/tokens.js";

const sendTokens = (res, user, status = 200) => {
  res.cookie("refreshToken", signRefresh(user), refreshCookieOptions);
  res.status(status).json({
    accessToken: signAccess(user),
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

export const signup = async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password || password.length < 8)
    return res.status(400).json({ message: "Name, email and a password of 8+ characters are required" });

  if (await User.findOne({ email }))
    return res.status(409).json({ message: "Email already registered" });

  const user = await User.create({ name, email, password });
  sendTokens(res, user, 201);
};

export const login = async (req, res) => {
  const { email, password } = req.body || {};
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: "Invalid credentials" });
  sendTokens(res, user);
};

export const refresh = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });
  try {
    const { id } = jwt.verify(token, process.env.REFRESH_SECRET);
    const user = await User.findById(id);
    if (!user) return res.status(401).json({ message: "User not found" });
    sendTokens(res, user);
  } catch {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("refreshToken", refreshCookieOptions);
  res.json({ message: "Logged out" });
};

export const me = (req, res) => res.json({ user: req.user });