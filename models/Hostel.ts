import mongoose from "mongoose";

const HostelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["Boys", "Girls", "Mixed"], required: true },
    capacity: { type: Number, required: true },
    occupied: { type: Number, default: 0 },
    status: { type: String, enum: ["Available", "Full", "Maintenance"], default: "Available" },
  },
  { timestamps: true }
);

export default mongoose.models.Hostel || mongoose.model("Hostel", HostelSchema);
