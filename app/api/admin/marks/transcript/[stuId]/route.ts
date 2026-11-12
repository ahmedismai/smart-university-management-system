import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Student from "@/models/Student";
import Mark from "@/models/Mark";
import GradeScale from "@/models/GradeScale";
import Class from "@/models/Class";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ stuId: string }> }
) {
  try {
    await dbConnect();
    const { stuId } = await params;

    // 1. Find Student
    const student = await Student.findOne({ studentId: stuId })
      .populate("classId")
      .populate("sectionId");

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // 2. Fetch all marks for this student
    const marks = await Mark.find({ studentId: student._id })
      .populate("classId");

    // 3. Fetch Grade Scale
    const gradeScale = await GradeScale.find().sort({ min: -1 });

    // 4. Group marks by Class (Course)
    const courseMarks: any = {};
    marks.forEach((m: any) => {
      const classId = m.classId._id.toString();
      if (!courseMarks[classId]) {
        courseMarks[classId] = {
          class: m.classId,
          totalObtained: 0,
          totalPossible: 0,
          marksList: []
        };
      }
      courseMarks[classId].totalObtained += m.obtainedMarks;
      courseMarks[classId].totalPossible += m.totalMarks;
      courseMarks[classId].marksList.push(m);
    });

    // 5. Calculate Grades for each course
    const results = Object.values(courseMarks).map((cm: any) => {
      const percentage = (cm.totalObtained / cm.totalPossible) * 100;
      const gradeInfo = gradeScale.find(gs => percentage >= gs.min && percentage <= gs.max);
      
      return {
        courseName: cm.class.name,
        courseCode: cm.class.code,
        obtained: cm.totalObtained,
        total: cm.totalPossible,
        percentage: percentage.toFixed(2),
        grade: gradeInfo ? gradeInfo.grade : "F",
        point: gradeInfo ? gradeInfo.point : 0,
        credits: 3 // Defaulting to 3 credits as it's not in Class model
      };
    });

    // 6. Calculate CGPA
    let totalPoints = 0;
    let totalCredits = 0;
    results.forEach((r: any) => {
      totalPoints += r.point * r.credits;
      totalCredits += r.credits;
    });

    const cgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";

    return NextResponse.json({
      student,
      results,
      cgpa,
      totalCredits
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
