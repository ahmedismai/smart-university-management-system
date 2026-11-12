import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    applicationId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    dob: { type: String },
    address: { type: String },
    sscInstitution: { type: String },
    sscYear: { type: String },
    sscGpa: { type: String },
    hscInstitution: { type: String },
    hscYear: { type: String },
    hscGpa: { type: String },
    faculty: { type: String },
    department: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Under Review", "Accepted", "Rejected"], default: "Pending" },
  },
  { timestamps: true }
);

export default mongoose.models.Application || mongoose.model("Application", ApplicationSchema);
