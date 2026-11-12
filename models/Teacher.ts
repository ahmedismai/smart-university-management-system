import mongoose from "mongoose";

const TeacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    teacherId: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  { timestamps: true }
);

export default mongoose.models.Teacher || mongoose.model("Teacher", TeacherSchema);
