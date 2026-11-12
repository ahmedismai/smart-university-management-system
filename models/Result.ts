import mongoose from "mongoose";

const ResultSchema = new mongoose.Schema(
  {
    resultId: { type: String, required: true, unique: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    semester: { type: String, required: true }, // e.g., "Summer 2026"
    avgGpa: { type: Number, default: 0 },
    passRate: { type: String, default: "0%" },
    status: { type: String, enum: ["Published", "Pending", "Archived"], default: "Pending" },
  },
  { timestamps: true }
);

export default mongoose.models.Result || mongoose.model("Result", ResultSchema);
