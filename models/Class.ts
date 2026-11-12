import mongoose from "mongoose";

const ClassSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
  },
  { timestamps: true }
);

export default mongoose.models.Class || mongoose.model("Class", ClassSchema);
