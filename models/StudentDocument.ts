import mongoose from "mongoose";

// Files a student uploads to their own profile (ID copies, certificates, ...). Stored in MongoDB, max 4MB.
const StudentDocumentSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true, index: true },
    fileName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.StudentDocument || mongoose.model("StudentDocument", StudentDocumentSchema);
