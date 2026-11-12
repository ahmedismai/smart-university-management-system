import mongoose from "mongoose";

const LectureSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    fileName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    // File bytes are stored in MongoDB (max 4MB, enforced in the upload route). Always `.select("-data")` in listings.
    data: { type: Buffer, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Lecture || mongoose.model("Lecture", LectureSchema);
