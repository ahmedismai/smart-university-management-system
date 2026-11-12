import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    code: { type: String, required: true, unique: true }, // public room code, e.g. "abc-defg-hij"
    hostId: { type: String, required: true }, // teacher.teacherId
    hostName: { type: String, required: true },
    sectionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Section" }], // invited sections
    status: { type: String, enum: ["live", "ended"], default: "live" },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Meeting || mongoose.model("Meeting", MeetingSchema);
