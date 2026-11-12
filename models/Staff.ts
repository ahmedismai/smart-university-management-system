import mongoose from "mongoose";

const StaffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    staffId: { type: String, required: true, unique: true },
    designation: { type: String, required: true },
    department: { type: String, required: true },
    phone: { type: String },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  { timestamps: true }
);

export default mongoose.models.Staff || mongoose.model("Staff", StaffSchema);
