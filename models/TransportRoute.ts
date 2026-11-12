import mongoose from "mongoose";

const TransportRouteSchema = new mongoose.Schema(
  {
    route: { type: String, required: true },
    vehicle: { type: String, required: true },
    time: { type: String, required: true },
    students: { type: Number, default: 0 },
    status: { type: String, enum: ["On Time", "Delayed", "Cancelled"], default: "On Time" },
  },
  { timestamps: true }
);

export default mongoose.models.TransportRoute || mongoose.model("TransportRoute", TransportRouteSchema);
