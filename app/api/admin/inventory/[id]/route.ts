import { entityItemRoute } from "@/lib/crudRoute";
import Inventory from "@/models/Inventory";
import InventoryLog from "@/models/InventoryLog";

// Edit / remove an asset and keep the activity feed up to date.
export const { GET, PUT, DELETE } = entityItemRoute(Inventory, {
  beforeUpdate: (body) => {
    if (body.quantity !== undefined) {
      body.quantity = Number(body.quantity);
      if (!(body.quantity >= 0)) return "Quantity must be zero or more";
      if (body.status === undefined || body.status === "In Stock" || body.status === "Out of Stock") {
        body.status = body.quantity === 0 ? "Out of Stock" : "In Stock";
      }
    }
    if (body.unitPrice !== undefined) body.unitPrice = Number(body.unitPrice) || 0;
    return body;
  },
  afterUpdate: async (doc) => {
    await InventoryLog.create({ action: "Updated", itemName: doc.itemName, detail: `${doc.quantity} ${doc.unit}` });
  },
  afterDelete: async (doc) => {
    await InventoryLog.create({ action: "Removed", itemName: doc.itemName });
  },
});
