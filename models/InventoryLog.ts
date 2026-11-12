import mongoose from "mongoose";

// Activity feed of the inventory module (shown under "Recent Activities").
const InventoryLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true }, // Added | Updated | Removed | Audited | Adjusted
    itemName: { type: String, required: true },
    user: { type: String, default: "Admin" },
    detail: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.InventoryLog || mongoose.model("InventoryLog", InventoryLogSchema);
