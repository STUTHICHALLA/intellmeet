import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { createMeeting, listMeetings, getMeeting } from "../controllers/meeting.controller.js";

const router = Router();

router.use(protect);
router.post("/", createMeeting);
router.get("/", listMeetings);
router.get("/:roomCode", getMeeting);

export default router;