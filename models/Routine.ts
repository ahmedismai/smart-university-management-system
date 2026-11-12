import mongoose from "mongoose";

const RoutineSchema = new mongoose.Schema(
  {
    day: { 
      type: String, 
      required: true, 
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] 
    },
    startTime: { type: String, required: true }, // e.g., "09:00"
    endTime: { type: String, required: true },   // e.g., "10:30"
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    sectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Section", required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    room: { type: String, required: true },
    type: { type: String, enum: ["Lecture", "Lab", "Seminar"], default: "Lecture" },
  },
  { timestamps: true }
);

export default mongoose.models.Routine || mongoose.model("Routine", RoutineSchema);
