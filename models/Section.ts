import mongoose from "mongoose";

const SectionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sectionId: { type: String, required: true, unique: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
    room: { type: String },
    capacity: { type: Number, default: 50 },
    status: { type: String, enum: ["Active", "Full", "Inactive"], default: "Active" },
  },
  { timestamps: true }
);

export default mongoose.models.Section || mongoose.model("Section", SectionSchema);
