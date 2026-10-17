import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    roomCode: { type: String, required: true, unique: true },
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["live", "ended"], default: "live" },
    transcript: { type: String, default: "" },
    summary: { type: String, default: "" },
    actionItems: [{ text: String, assignee: String, done: { type: Boolean, default: false } }],
  },
  { timestamps: true }
);

export default mongoose.model("Meeting", meetingSchema);