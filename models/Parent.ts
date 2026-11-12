import mongoose from "mongoose";

const ParentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    parentId: { type: String, required: true, unique: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    status: { type: String, enum: ["Active", "Pending", "Inactive"], default: "Active" },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Parent || mongoose.model("Parent", ParentSchema);
