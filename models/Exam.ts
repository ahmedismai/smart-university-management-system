import mongoose from "mongoose";

const ExamSchema = new mongoose.Schema(
  {
    examId: { type: String, required: true, unique: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    time: { type: String, required: true }, // e.g., "10:00 AM"
    hall: { type: String, required: true },
    studentsCount: { type: Number, default: 0 },
    status: { type: String, enum: ["Scheduled", "Draft", "Completed", "Cancelled"], default: "Scheduled" },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Exam || mongoose.model("Exam", ExamSchema);
