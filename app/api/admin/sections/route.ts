import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Section from "@/models/Section";
import Class from "@/models/Class";
import Teacher from "@/models/Teacher";
import Student from "@/models/Student";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { sectionId: { $regex: search, $options: "i" } },
        { room: { $regex: search, $options: "i" } },
      ];
    }

    const sections = await Section.find(query)
      .populate("classId")
      .populate("teacherId")
      .sort({ createdAt: -1 });

    const sectionsWithStats = await Promise.all(
      sections.map(async (sec) => {
        const studentCount = await Student.countDocuments({ sectionId: sec._id });
        return {
          ...sec.toObject(),
          studentCount,
        };
      })
    );

    return NextResponse.json(sectionsWithStats);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const section = await Section.create(body);
    return NextResponse.json(section, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
