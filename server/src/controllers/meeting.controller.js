import crypto from "node:crypto";
import Meeting from "../models/Meeting.js";

export const createMeeting = async (req, res) => {
  const { title } = req.body || {};
  if (!title) return res.status(400).json({ message: "Title is required" });
  const roomCode = crypto.randomBytes(4).toString("hex");
  const meeting = await Meeting.create({ title, roomCode, host: req.user._id });
  res.status(201).json({ meeting });
};

export const listMeetings = async (req, res) => {
  const meetings = await Meeting.find({ host: req.user._id }).sort({ createdAt: -1 });
  res.json({ meetings });
};

export const getMeeting = async (req, res) => {
  const meeting = await Meeting.findOne({ roomCode: req.params.roomCode }).populate("host", "name");
  if (!meeting) return res.status(404).json({ message: "Meeting not found" });
  res.json({ meeting });
};