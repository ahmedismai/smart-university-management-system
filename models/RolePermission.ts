import mongoose from "mongoose";

// permissions: { "<Module name>": ["View", "Create", ...] }
const RolePermissionSchema = new mongoose.Schema(
  {
    role: { type: String, required: true, unique: true },
    permissions: { type: Map, of: [String], default: {} },
  },
  { timestamps: true }
);

export default mongoose.models.RolePermission || mongoose.model("RolePermission", RolePermissionSchema);
