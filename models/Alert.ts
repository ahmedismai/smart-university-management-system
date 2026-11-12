import mongoose from "mongoose";

const AlertSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    type: { type: String, enum: ["Info", "Warning", "Error"], default: "Info" },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Alert || mongoose.model("Alert", AlertSchema);
