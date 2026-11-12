import mongoose from "mongoose";

// Personal notifications for a student (fee reminders, payment confirmations, ...).
const NotificationSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true, index: true },
    kind: { type: String, enum: ["reminder", "payment", "info"], default: "info" },
    title: { type: String, required: true },
    body: { type: String, default: "" },
    link: { type: String, default: "" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);
