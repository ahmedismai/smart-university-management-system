import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import Student from "@/models/Student";
import Book from "@/models/Book";
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

    const { bookId } = await req.json();
    if (!bookId) {
      return NextResponse.json({ success: false, message: "Book ID is required" }, { status: 400 });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return NextResponse.json({ success: false, message: "Book not found" }, { status: 404 });
    }

    // 1. Enforce borrowing limit (e.g. 5 books maximum)
    const activeIssuesCount = await BookIssue.countDocuments({
      memberId: student.studentId,
      status: { $in: ["Active", "Overdue"] }
    });

    if (activeIssuesCount >= 5) {
      return NextResponse.json({
        success: false,
        message: "Borrow limit reached. You can borrow a maximum of 5 books simultaneously."
      }, { status: 400 });
    }

    // 2. Prevent borrowing the duplicate book
    const alreadyBorrowed = await BookIssue.findOne({
      memberId: student.studentId,
      book: book._id,
      status: { $in: ["Active", "Overdue"] }
    });

    if (alreadyBorrowed) {
      return NextResponse.json({
        success: false,
        message: "You have already borrowed this book and it is currently active."
      }, { status: 400 });
    }

    // 3. Check availability
    if (book.availableCopies <= 0) {
      return NextResponse.json({
        success: false,
        message: "No copies currently available for this book."
      }, { status: 400 });
    }

    // 4. Decrement available copies
    book.availableCopies -= 1;
    await book.save();

    // 5. Create BookIssue
    const issueDate = new Date();
    const dueDate = new Date(issueDate.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days borrowing period

    const issue = await BookIssue.create({
      book: book._id,
      memberId: student.studentId,
      memberType: "Student",
      issueDate,
      dueDate,
      status: "Active"
    });

    return NextResponse.json({
      success: true,
      message: `Successfully borrowed "${book.title}". Please return by ${dueDate.toISOString().split("T")[0]}.`,
      data: issue
    });

  } catch (error: any) {
    console.error("Borrow Book API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
