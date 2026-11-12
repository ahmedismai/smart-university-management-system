import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    studentId: { type: String, required: true, unique: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
    sectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Section" },
    hostelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hostel" },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    about: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
    twitter: { type: String, default: "" },
    website: { type: String, default: "" },
    avatar: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Student || mongoose.model("Student", StudentSchema);
