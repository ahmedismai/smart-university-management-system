import mongoose from "mongoose";

const GradeScaleSchema = new mongoose.Schema(
  {
    grade: { type: String, required: true },
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    point: { type: Number, required: true },
    remarks: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.GradeScale || mongoose.model("GradeScale", GradeScaleSchema);
