import mongoose from "mongoose";

const FeeSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    feeHeadId: { type: mongoose.Schema.Types.ObjectId, ref: "FeeHead" },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["Paid", "Pending", "Failed"], default: "Pending" },
    paymentMethod: { type: String },
    transactionId: { type: String },
    dueDate: { type: Date, required: true },
    paidDate: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Fee || mongoose.model("Fee", FeeSchema);
