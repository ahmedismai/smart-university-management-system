import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Alert from "@/models/Alert";

export async function GET() {
  try {
    await dbConnect();
    const alerts = await Alert.find({ isRead: false }).sort({ createdAt: -1 });
    return NextResponse.json(alerts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
