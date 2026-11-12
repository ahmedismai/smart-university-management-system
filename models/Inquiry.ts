import mongoose from "mongoose";

/**
 * Generic request stored from the public site and the portals:
 * contact / apply / subscribe / registration / leave / deactivation / password-reset ...
 * Admins review them in /admin/inquiries.
 */
const InquirySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["contact", "apply", "subscribe", "registration", "leave", "deactivation", "password-reset", "other"],
      default: "contact",
    },
    subject: { type: String, required: true, trim: true },
    name: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, lowercase: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    message: { type: String, trim: true, default: "" },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
    pagePath: { type: String, default: "" },
    // who sent it, when logged in
    userRole: { type: String, default: "" },
    userRef: { type: String, default: "" },
    status: { type: String, enum: ["New", "In Progress", "Resolved"], default: "New" },
    adminNote: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Inquiry || mongoose.model("Inquiry", InquirySchema);
