import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Teacher from "@/models/Teacher";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const query: any = {};

    const search = searchParams.get("search");
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { teacherId: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const teachers = await Teacher.find(query).sort({ createdAt: -1 });
    return NextResponse.json(teachers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const teacher = await Teacher.create(body);
    return NextResponse.json(teacher, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
