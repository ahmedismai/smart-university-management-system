import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";

export async function GET() {
  try {
    await dbConnect();
    if (!(await cookies()).get("admin_session")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const db = mongoose.connection.db;
    if (!db) return NextResponse.json({ error: "Database connection not available" }, { status: 500 });

    const started = Date.now();
    await db.command({ ping: 1 });
    const latencyMs = Date.now() - started;

    const [stats, collections, pending, unreadAlerts] = await Promise.all([
      db.stats(),
      db.listCollections().toArray(),
      db.collection("applications").countDocuments({ status: "Pending" }),
      db.collection("alerts").countDocuments({ isRead: false }),
    ]);

    return NextResponse.json({
      success: true,
      database: {
        name: db.databaseName,
        sizeMB: +((stats.dataSize || 0) / 1024 / 1024).toFixed(2),
        storageMB: +((stats.storageSize || 0) / 1024 / 1024).toFixed(2),
        collections: collections.length,
        documents: stats.objects || 0,
        latencyMs,
      },
      pendingApplications: pending,
      unreadAlerts,
      serverUptimeHours: +(process.uptime() / 3600).toFixed(1),
      checkedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
