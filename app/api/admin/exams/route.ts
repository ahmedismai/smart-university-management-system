import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Exam from "@/models/Exam";
import Course from "@/models/Course";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    let query: any = {};
    if (search) {
      // Find courses matching the search to filter exams
      const courses = await Course.find({ 
        $or: [
          { title: { $regex: search, $options: "i" } },
          { courseCode: { $regex: search, $options: "i" } }
        ]
      }).select("_id");
      const courseIds = courses.map(c => c._id);
      
      query.$or = [
        { examId: { $regex: search, $options: "i" } },
        { hall: { $regex: search, $options: "i" } },
        { courseId: { $in: courseIds } }
      ];
    }

    const exams = await Exam.find(query)
      .populate("courseId", "title courseCode")
      .sort({ date: 1, time: 1 });
    return NextResponse.json(exams);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const exam = await Exam.create(body);
    const populated = await Exam.findById(exam._id).populate("courseId", "title courseCode");
    return NextResponse.json(populated, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
