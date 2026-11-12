import mongoose from "mongoose";

const AnnouncementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, enum: ["Academic", "Administrative", "Event", "Urgent"], default: "Academic" },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    targetAudience: { type: String, enum: ["All", "Students", "Teachers", "Staff"], default: "All" },
    status: { type: String, enum: ["Published", "Draft", "Archived"], default: "Published" },
  },
  { timestamps: true }
);

export default mongoose.models.Announcement || mongoose.model("Announcement", AnnouncementSchema);
