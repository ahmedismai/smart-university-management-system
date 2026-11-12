import mongoose from "mongoose";

const FeeHeadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dept: { type: String, required: true },
    amount: { type: Number, required: true },
    frequency: { type: String, enum: ["One-time", "Semester", "Annual", "Monthly"], required: true },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  { timestamps: true }
);

export default mongoose.models.FeeHead || mongoose.model("FeeHead", FeeHeadSchema);
