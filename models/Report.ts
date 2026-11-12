import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    desc: { type: String, required: true },
    icon: { type: String, required: true, default: "FileText" },
  },
  { timestamps: true }
);

export default mongoose.models.Report || mongoose.model("Report", reportSchema);
