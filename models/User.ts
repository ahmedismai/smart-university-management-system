import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for social login or managed separately
    role: { type: String, enum: ["Admin", "Student", "Teacher", "Staff", "Parent"], default: "Student" },
    department: { type: String },
    status: { type: String, enum: ["Active", "Inactive", "Suspended"], default: "Active" },
    image: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
