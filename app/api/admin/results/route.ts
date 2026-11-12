import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Result from "@/models/Result";
import Course from "@/models/Course";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const query: any = {};

    const search = searchParams.get("search");
    const semester = searchParams.get("semester");

    if (search) {
      // Find courses matching the search term to filter results by course
      const courses = await Course.find({
        $or: [
          { title: { $regex: search, $options: "i" } },
          { courseCode: { $regex: search, $options: "i" } },
        ],
      });
      const courseIds = courses.map((c) => c._id);
      query.$or = [
        { resultId: { $regex: search, $options: "i" } },
        { courseId: { $in: courseIds } },
      ];
    }

    if (semester && semester !== "All") {
      query.semester = semester;
    }

    const results = await Result.find(query)
      .populate("courseId")
      .sort({ createdAt: -1 });
    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const result = await Result.create(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
