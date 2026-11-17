import mongoose from "mongoose";

export const APPLICATION_DOCUMENT_KINDS = ["photo", "nationalId", "secondaryCertificate", "birthCertificate"] as const;
export type ApplicationDocumentKind = (typeof APPLICATION_DOCUMENT_KINDS)[number];

// Files attached to an admission application. Stored in MongoDB, max 2MB each.
const ApplicationDocumentSchema = new mongoose.Schema(
  {
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application", required: true, index: true },
    kind: { type: String, enum: APPLICATION_DOCUMENT_KINDS, required: true },
    fileName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true }
);

ApplicationDocumentSchema.index({ applicationId: 1, kind: 1 }, { unique: true });

export default mongoose.models.ApplicationDocument ||
  mongoose.model("ApplicationDocument", ApplicationDocumentSchema);
