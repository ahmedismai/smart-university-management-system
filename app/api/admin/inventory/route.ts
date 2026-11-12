import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { getAdminContext } from "@/lib/adminAuth";
import Inventory from "@/models/Inventory";
import InventoryLog from "@/models/InventoryLog";
import InventoryAudit from "@/models/InventoryAudit";

const fmtMoney = (n: number) =>
  n >= 1_000_000 ? `EGP ${(n / 1_000_000).toFixed(2).replace(/\.?0+$/, "")}M` : n >= 1_000 ? `EGP ${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K` : `EGP ${n}`;

export async function GET() {
  try {
    await dbConnect();
    const [inventory, logs, lastAudit]: any[] = await Promise.all([
      Inventory.find().sort({ createdAt: -1 }),
      InventoryLog.find().sort({ createdAt: -1 }).limit(6).lean(),
      InventoryAudit.findOne().sort({ createdAt: -1 }).lean(),
    ]);

    const totalValue = inventory.reduce((n: number, i: any) => n + (i.quantity || 0) * (i.unitPrice || 0), 0);
    const stats = {
      totalAssets: inventory.length,
      lowStock: inventory.filter((item: any) => item.quantity > 0 && item.quantity <= 10).length,
      maintenance: inventory.filter((item: any) => item.status === "Under Maintenance").length,
      totalValue: fmtMoney(totalValue),
    };

    return NextResponse.json({
      success: true,
      data: {
        inventory,
        stats,
        recentActivities: logs.map((l: any) => ({ action: l.action, item: l.itemName, user: l.user, date: l.createdAt, detail: l.detail })),
        lastAudit: lastAudit
          ? { date: lastAudit.createdAt, itemsChecked: lastAudit.itemsChecked, discrepancies: lastAudit.discrepancies, applied: lastAudit.applied }
          : null,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!(await getAdminContext())) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const body = await req.json();

    let status = "In Stock";
    if (Number(body.quantity) === 0) status = "Out of Stock";
    if (body.status) status = body.status;

    const newItem = await Inventory.create({
      itemName: body.itemName,
      category: body.category,
      quantity: Number(body.quantity) || 0,
      unit: body.unit || "Pcs",
      unitPrice: Number(body.unitPrice) || 0,
      location: body.location || "",
      status,
    });
    await InventoryLog.create({ action: "Added", itemName: newItem.itemName, detail: `${newItem.quantity} ${newItem.unit}` });

    return NextResponse.json({ success: true, data: newItem });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
