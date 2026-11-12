import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { getAdminContext } from "@/lib/adminAuth";
import Inventory from "@/models/Inventory";
import InventoryAudit from "@/models/InventoryAudit";
import InventoryLog from "@/models/InventoryLog";

// POST { counts: [{ id, counted }], apply: boolean, note? }
// Compares the physical count with the recorded stock, stores the audit, and (optionally) corrects the stock.
export async function POST(request: Request) {
  try {
    const admin: any = await getAdminContext();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const { counts, apply, note } = await request.json();
    if (!Array.isArray(counts) || counts.length === 0) return NextResponse.json({ error: "Nothing to audit" }, { status: 400 });

    const ids = counts.map((c: any) => c.id);
    const items: any[] = await Inventory.find({ _id: { $in: ids } });
    const rows: any[] = [];
    for (const c of counts) {
      const item = items.find((i) => String(i._id) === String(c.id));
      const counted = Number(c.counted);
      if (!item || !Number.isFinite(counted) || counted < 0) continue;
      rows.push({ itemId: item._id, itemName: item.itemName, expected: item.quantity, counted });
    }
    if (!rows.length) return NextResponse.json({ error: "No valid counts were provided" }, { status: 400 });

    const diffs = rows.filter((r) => r.expected !== r.counted);
    await InventoryAudit.create({
      performedBy: admin.name || admin.email,
      items: rows,
      itemsChecked: rows.length,
      discrepancies: diffs.length,
      applied: Boolean(apply),
      note: String(note || "").slice(0, 500),
    });

    if (apply) {
      for (const r of diffs) {
        const item = items.find((i) => String(i._id) === String(r.itemId));
        item.quantity = r.counted;
        if (item.status === "In Stock" || item.status === "Out of Stock") item.status = r.counted === 0 ? "Out of Stock" : "In Stock";
        await item.save();
        await InventoryLog.create({ action: "Adjusted", itemName: r.itemName, user: admin.name || "Admin", detail: `${r.expected} -> ${r.counted} (audit)` });
      }
    }
    await InventoryLog.create({
      action: "Audited",
      itemName: `${rows.length} items`,
      user: admin.name || "Admin",
      detail: diffs.length ? `${diffs.length} discrepancies${apply ? ", stock corrected" : ""}` : "no discrepancies",
    });

    return NextResponse.json({ success: true, checked: rows.length, discrepancies: diffs.length, applied: Boolean(apply) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
