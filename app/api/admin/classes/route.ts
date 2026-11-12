import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Class from "@/models/Class";
import Teacher from "@/models/Teacher"; // Ensure Teacher model is registered

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { code: { $regex: search, $options: "i" } },
        ],
      };
    }

    const classes = await Class.find(query)
      .populate("teacherId", "name department")
      .sort({ createdAt: -1 });

    return NextResponse.json(classes);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const newClass = await Class.create(body);
    const populatedClass = await Class.findById(newClass._id).populate("teacherId", "name department");
    return NextResponse.json(populatedClass, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
