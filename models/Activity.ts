import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    action: { type: String, required: true },
    details: { type: String },
    status: { type: String, default: "Success" },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Activity || mongoose.model("Activity", ActivitySchema);
