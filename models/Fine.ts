import mongoose from "mongoose";

const FineSchema = new mongoose.Schema(
  {
    fineId: { type: String, required: true, unique: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    type: { type: String, required: true }, // Library, Late Fee, Attendance, Conduct, etc.
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ["Paid", "Unpaid", "Processing"], default: "Unpaid" },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Fine || mongoose.model("Fine", FineSchema);
