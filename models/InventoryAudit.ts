import mongoose from "mongoose";

// One stock-take: what the system expected vs. what was physically counted.
const InventoryAuditSchema = new mongoose.Schema(
  {
    performedBy: { type: String, default: "Admin" },
    items: [
      {
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Inventory" },
        itemName: String,
        expected: Number,
        counted: Number,
      },
    ],
    itemsChecked: { type: Number, default: 0 },
    discrepancies: { type: Number, default: 0 },
    applied: { type: Boolean, default: false },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.InventoryAudit || mongoose.model("InventoryAudit", InventoryAuditSchema);
