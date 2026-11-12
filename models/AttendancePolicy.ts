import mongoose from "mongoose";

const AttendancePolicySchema = new mongoose.Schema(
  {
    minAttendance: { type: Number, default: 75 },
    lateBuffer: { type: Number, default: 15 },
    penaltyType: { 
      type: String, 
      enum: ["Deduct Marks (Automatic)", "Fine Assignment (Daily)", "Manual Review Only"],
      default: "Deduct Marks (Automatic)" 
    },
    biometricSync: { type: Boolean, default: true },
    automation: {
      autoSMS: { type: Boolean, default: true },
      weeklyReports: { type: Boolean, default: false },
      thresholdAlerts: { type: Boolean, default: true }
    }
  },
  { timestamps: true }
);

export default mongoose.models.AttendancePolicy || mongoose.model("AttendancePolicy", AttendancePolicySchema);
