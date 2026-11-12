import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Book from "@/models/Book";
import BookIssue from "@/models/BookIssue";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { memberId, isbn, dueDate } = await req.json();

    if (!memberId || !isbn || !dueDate) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const book = await Book.findOne({ isbn });
    if (!book) {
      return NextResponse.json({ success: false, message: "Book not found with this ISBN" }, { status: 404 });
    }

    if (book.availableCopies <= 0) {
      return NextResponse.json({ success: false, message: "No available copies for this book" }, { status: 400 });
    }

    // Decrement available copies
    book.availableCopies -= 1;
    await book.save();

    const issue = await BookIssue.create({
      book: book._id,
      memberId,
      dueDate,
      status: "Active"
    });

    return NextResponse.json({
      success: true,
      message: "Book issued successfully",
      data: issue,
    });
  } catch (error: any) {
    console.error("Issue Book API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const { issueId, action } = await req.json();

    if (!issueId || action !== "return") {
      return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
    }

    const issue = await BookIssue.findById(issueId).populate("book");
    if (!issue) {
      return NextResponse.json({ success: false, message: "Issue record not found" }, { status: 404 });
    }

    if (issue.status === "Returned") {
      return NextResponse.json({ success: false, message: "Book already returned" }, { status: 400 });
    }

    // Update issue status
    issue.status = "Returned";
    issue.returnDate = new Date();
    await issue.save();

    // Increment available copies
    if (issue.book) {
      await Book.findByIdAndUpdate(issue.book._id, { $inc: { availableCopies: 1 } });
    }

    return NextResponse.json({ success: true, message: "Book returned successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
