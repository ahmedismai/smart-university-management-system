import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ["Present", "Absent", "Late", "Excused"], default: "Present" },
    remark: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Attendance || mongoose.model("Attendance", AttendanceSchema);
