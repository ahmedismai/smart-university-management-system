import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { getAdminContext } from "@/lib/adminAuth";
import Parent from "@/models/Parent";
import Student from "@/models/Student"; // Ensure Student model is registered

export async function GET(request: Request) {
  try {
    if (!(await getAdminContext())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { parentId: { $regex: search, $options: "i" } },
      ];
    }

    const parents = await Parent.find(query).populate("studentId").sort({ createdAt: -1 });
    return NextResponse.json(parents);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await getAdminContext())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const body = await request.json();
    if (body.studentRef !== undefined) {
      const ref = String(body.studentRef).trim();
      delete body.studentRef;
      if (ref) {
        const s: any = await Student.findOne({ studentId: ref.toUpperCase() }).lean();
        if (!s) return NextResponse.json({ error: `No student found with ID ${ref}` }, { status: 400 });
        body.studentId = s._id;
      }
    }
    if (!body.studentId) delete body.studentId;
    const parent = await Parent.create(body);
    return NextResponse.json(parent, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
