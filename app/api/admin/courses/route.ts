import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Course from "@/models/Course";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    let query: any = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { courseCode: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
      ];
    }

    const courses = await Course.find(query).sort({ courseCode: 1 });
    return NextResponse.json(courses);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const course = await Course.create(body);
    return NextResponse.json(course, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
