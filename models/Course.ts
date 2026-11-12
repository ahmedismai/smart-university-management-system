import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
  {
    courseCode: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    department: { type: String, required: true },
    credits: { type: Number, required: true },
    type: { type: String, enum: ["Core", "Elective", "General"], default: "Core" },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Course || mongoose.model("Course", CourseSchema);
