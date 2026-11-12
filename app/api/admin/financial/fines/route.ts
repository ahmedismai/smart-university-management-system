import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Fine from "@/models/Fine";
import Student from "@/models/Student";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const query: any = {};

    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    if (type && type !== "All") query.type = type;
    if (status && status !== "All") query.status = status;

    if (search) {
      const students = await Student.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { studentId: { $regex: search, $options: "i" } },
        ],
      });
      const studentIds = students.map((s) => s._id);
      query.studentId = { $in: studentIds };
    }

    const fines = await Fine.find(query)
      .populate("studentId", "name studentId email")
      .sort({ createdAt: -1 });

    // Calculate stats
    const allFines = await Fine.find({});
    const unpaidAmount = allFines.filter(f => f.status === "Unpaid").reduce((acc, curr) => acc + curr.amount, 0);
    const collectedAmount = allFines.filter(f => f.status === "Paid").reduce((acc, curr) => acc + curr.amount, 0);
    const activeDefaulters = new Set(allFines.filter(f => f.status === "Unpaid").map(f => f.studentId.toString())).size;
    const processingFines = allFines.filter(f => f.status === "Processing").length;

    // Type breakdown for chart
    const types = ["Library", "Late Fee", "Conduct", "Attendance"];
    const collectionSummary = types.map(t => ({
      name: t,
      collected: allFines.filter(f => f.type === t && f.status === "Paid").reduce((acc, curr) => acc + curr.amount, 0)
    }));

    return NextResponse.json({
      fines,
      stats: {
        unpaidAmount,
        collectedAmount,
        activeDefaulters,
        processingFines
      },
      collectionSummary
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const fine = await Fine.create(body);
    return NextResponse.json(fine, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
