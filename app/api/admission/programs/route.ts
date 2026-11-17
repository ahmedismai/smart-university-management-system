import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ClassModel from "@/models/Class";

// Public: programs applicants can choose on the admission form
export async function GET() {
  try {
    await dbConnect();
    const classes: any[] = await ClassModel.find().sort({ name: 1 }).select("name code").lean();
    return NextResponse.json({ programs: classes.map((c) => ({ code: c.code, name: c.name })) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
