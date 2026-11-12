import mongoose from "mongoose";

const HolidaySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true }, // e.g., "Religious", "National"
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ["Upcoming", "Passed"], default: "Upcoming" }
  },
  { timestamps: true }
);

export default mongoose.models.Holiday || mongoose.model("Holiday", HolidaySchema);
