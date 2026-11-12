import mongoose from "mongoose";

const WaiverSchema = new mongoose.Schema(
  {
    waiverId: { type: String, required: true, unique: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    type: { type: String, required: true }, // Merit-based, Need-based, Martyrs Families, Sibling, etc.
    value: { type: String, required: true }, // e.g., "100%", "50%"
    amount: { type: Number, required: true }, // Benefit amount in EGP
    status: { type: String, enum: ["Active", "Pending", "Expired"], default: "Active" },
  },
  { timestamps: true }
);

export default mongoose.models.Waiver || mongoose.model("Waiver", WaiverSchema);
