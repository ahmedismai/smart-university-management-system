import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    applicationId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    nationalId: { type: String },
    dob: { type: String },
    address: { type: String },
    // Preparatory certificate (stored in the legacy "ssc*" fields)
    sscInstitution: { type: String },
    sscYear: { type: String },
    sscGpa: { type: String },
    // Thanaweya Amma / equivalent secondary certificate (stored in the legacy "hsc*" fields)
    hscInstitution: { type: String },
    hscYear: { type: String },
    hscGpa: { type: String },
    faculty: { type: String },
    department: { type: String, required: true },
    // Code of the program (Class) applied for, e.g. "CSE"
    programCode: { type: String },
    status: { type: String, enum: ["Pending", "Under Review", "Accepted", "Rejected"], default: "Pending" },
    // Message from the admissions office, shown to the applicant on the status page
    decisionNote: { type: String, default: "" },
    // bcrypt hash of the password the applicant chose; becomes their student login password
    passwordHash: { type: String, select: false },
    // Lets the browser that submitted the application upload its documents for a short time
    uploadToken: { type: String, select: false },
    uploadTokenExpires: { type: Date, select: false },
    // Filled when the applicant is accepted and enrolled
    studentId: { type: String },
    enrolledAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Application || mongoose.model("Application", ApplicationSchema);
