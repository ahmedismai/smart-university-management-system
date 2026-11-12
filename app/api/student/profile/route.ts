import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import Student from "@/models/Student";
import Class from "@/models/Class";
import Section from "@/models/Section";
import mongoose from "mongoose";
import { computeStudentResults } from "@/lib/gpa";

export async function GET() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const studentSession = cookieStore.get("student_session")?.value;

    if (!studentSession) {
      return NextResponse.json({ error: "Unauthorized: No active session" }, { status: 401 });
    }

    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json({ error: "Database connection not available" }, { status: 500 });
    }

    // Fetch student document matching studentId using raw MongoDB
    const student = await db.collection("students").findOne({ studentId: studentSession });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Manually fetch Class name and code
    let studentClass = "Bachelor of Science in CSE";
    let classCode = "CSE";
    if (student.classId) {
      const classDoc = await db.collection("classes").findOne({ _id: new mongoose.Types.ObjectId(student.classId) });
      if (classDoc) {
        studentClass = classDoc.name || classDoc.code || studentClass;
        classCode = classDoc.code || classCode;
      }
    }

    // Manually fetch Section name
    let studentSection = "A";
    if (student.sectionId) {
      const sectionDoc = await db.collection("sections").findOne({ _id: new mongoose.Types.ObjectId(student.sectionId) });
      if (sectionDoc) {
        studentSection = sectionDoc.name || studentSection;
      }
    }

    // Academic metrics from the student's real marks
    const { cgpa, credits: creditsCompleted } = await computeStudentResults(student);
    const semester = student.semester || "";

    return NextResponse.json({
      student: {
        id: student.studentId,
        _id: student._id.toString(),
        name: student.name,
        email: student.email,
        class: studentClass,
        joinedAt: student.createdAt,
        classCode: classCode,
        section: studentSection,
        status: student.status,
        phone: student.phone || "",
        address: student.address || "",
        about: student.about || "",
        linkedin: student.linkedin || "",
        github: student.github || "",
        twitter: student.twitter || "",
        website: student.website || "",
        avatar: student.avatar || "",
      },
      stats: {
        cgpa: cgpa.toFixed(2),
        creditsCompleted,
        semester,
      }
    });

  } catch (error: any) {
    console.error("Profile API GET Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const studentSession = cookieStore.get("student_session")?.value;

    if (!studentSession) {
      return NextResponse.json({ error: "Unauthorized: No active session" }, { status: 401 });
    }

    const body = await request.json();
    const { phone, address, about, linkedin, github, twitter, website, avatar } = body;

    const student = await Student.findOne({ studentId: studentSession });
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Update profile fields
    if (phone !== undefined) student.phone = phone;
    if (address !== undefined) student.address = address;
    if (about !== undefined) student.about = about;
    if (linkedin !== undefined) student.linkedin = linkedin;
    if (github !== undefined) student.github = github;
    if (twitter !== undefined) student.twitter = twitter;
    if (website !== undefined) student.website = website;
    if (avatar !== undefined) student.avatar = avatar;

    await student.save();

    return NextResponse.json({
      success: true,
      student: {
        id: student.studentId,
        name: student.name,
        email: student.email,
        phone: student.phone,
        address: student.address,
        about: student.about,
        linkedin: student.linkedin,
        github: student.github,
        twitter: student.twitter,
        website: student.website,
        avatar: student.avatar,
      }
    });

  } catch (error: any) {
    console.error("Profile API PUT Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
