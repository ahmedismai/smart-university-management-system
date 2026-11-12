import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import Student from "@/models/Student";
import BookIssue from "@/models/BookIssue";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const studentSession = cookieStore.get("student_session")?.value;

    if (!studentSession) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const student = await Student.findOne({ studentId: studentSession });
    if (!student) {
      return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });
    }

    const { issueId } = await req.json();
    if (!issueId) {
      return NextResponse.json({ success: false, message: "Issue ID is required" }, { status: 400 });
    }

    const issue = await BookIssue.findById(issueId);
    if (!issue) {
      return NextResponse.json({ success: false, message: "Borrow record not found" }, { status: 404 });
    }

    // Verify ownership
    if (issue.memberId !== student.studentId) {
      return NextResponse.json({ success: false, message: "Unauthorized operation" }, { status: 403 });
    }

    if (issue.status === "Returned") {
      return NextResponse.json({ success: false, message: "Book has already been returned" }, { status: 400 });
    }

    // Renew book: extend due date by 7 days
    const currentDueDate = new Date(issue.dueDate);
    const newDueDate = new Date(currentDueDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    issue.dueDate = newDueDate;
    // If it was overdue, let's see if we should reset status to Active if new due date is in the future
    if (newDueDate > new Date()) {
      issue.status = "Active";
    }
    await issue.save();

    return NextResponse.json({
      success: true,
      message: "Book renewed successfully! Due date extended by 7 days.",
      data: issue
    });

  } catch (error: any) {
    console.error("Renew Book API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
