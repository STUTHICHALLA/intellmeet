import { Router } from "express";
import rateLimit from "express-rate-limit";
import { signup, login, refresh, logout, me } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.js";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: { message: "Too many attempts, try again later" },
});

router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", protect, me);

export default router;