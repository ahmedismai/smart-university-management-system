import mongoose from "mongoose";

const ReportCardBatchSchema = new mongoose.Schema(
  {
    batchId: { type: String, required: true, unique: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    sectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Section" },
    studentCount: { type: Number, required: true },
    status: { type: String, enum: ["Processing", "Ready", "Sent"], default: "Processing" },
    template: { type: String, default: "Detailed" },
    createdBy: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.ReportCardBatch || mongoose.model("ReportCardBatch", ReportCardBatchSchema);
