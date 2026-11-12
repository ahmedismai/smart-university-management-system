import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ReportCardBatch from "@/models/ReportCardBatch";

export async function GET() {
  try {
    await dbConnect();
    const batches = await ReportCardBatch.find()
      .populate("classId", "name code")
      .populate("sectionId", "name")
      .sort({ createdAt: -1 });
    return NextResponse.json(batches);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Generate a unique batch ID
    const count = await ReportCardBatch.countDocuments();
    const batchId = `RC-${new Date().getFullYear()}-${(count + 1).toString().padStart(3, '0')}`;
    
    const batch = await ReportCardBatch.create({
      ...body,
      batchId,
      status: "Processing"
    });

    // Simulate processing
    setTimeout(async () => {
      await ReportCardBatch.findByIdAndUpdate(batch._id, { status: "Ready" });
    }, 5000);

    return NextResponse.json(batch, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
