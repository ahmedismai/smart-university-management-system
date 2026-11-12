import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Waiver from "@/models/Waiver";
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
      // Find students matching the search query
      const students = await Student.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { studentId: { $regex: search, $options: "i" } },
        ],
      });
      const studentIds = students.map((s) => s._id);
      query.studentId = { $in: studentIds };
    }

    const waivers = await Waiver.find(query)
      .populate("studentId", "name studentId email")
      .sort({ createdAt: -1 });

    // Calculate stats
    const allWaivers = await Waiver.find({});
    const totalAmount = allWaivers.reduce((acc, curr) => acc + curr.amount, 0);
    const activeRecipients = allWaivers.filter(w => w.status === "Active").length;
    const meritScholars = allWaivers.filter(w => w.type === "Merit-based").length;
    const pendingApps = allWaivers.filter(w => w.status === "Pending").length;

    return NextResponse.json({
      waivers,
      stats: {
        totalAmount,
        activeRecipients,
        meritScholars,
        pendingApps
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const waiver = await Waiver.create(body);
    return NextResponse.json(waiver, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
