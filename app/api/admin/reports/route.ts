import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Report from "@/models/Report";

export async function GET(request: Request) {
  try {
    await dbConnect();
    let reports = await Report.find().sort({ createdAt: -1 });

    if (reports.length === 0) {
      const defaultReports = [
        {
          name: "Attendance Report",
          desc: "Daily, weekly and monthly attendance analysis.",
          icon: "BarChart3",
        },
        {
          name: "Academic Performance",
          desc: "GPA distribution and subject-wise results.",
          icon: "LineChart",
        },
        {
          name: "Financial Summary",
          desc: "Revenue collection and outstanding dues.",
          icon: "PieChart",
        },
        {
          name: "Inventory Usage",
          desc: "Stock levels and asset allocation tracking.",
          icon: "BarChart3",
        },
      ];
      await Report.insertMany(defaultReports);
      reports = await Report.find().sort({ createdAt: -1 });
    }

    return NextResponse.json(reports);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const report = await Report.create(body);
    return NextResponse.json(report, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
