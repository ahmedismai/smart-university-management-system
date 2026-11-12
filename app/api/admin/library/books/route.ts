import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Book from "@/models/Book";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const { title, author, isbn, category, copies, location } = body;

    if (!title || !author || !isbn) {
      return NextResponse.json(
        { success: false, message: "Title, Author, and ISBN are required" },
        { status: 400 }
      );
    }

    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return NextResponse.json(
        { success: false, message: "A book with this ISBN already exists" },
        { status: 400 }
      );
    }

    const newBook = await Book.create({
      title,
      author,
      isbn,
      category,
      copies: Number(copies) || 1,
      availableCopies: Number(copies) || 1,
      location,
    });

    return NextResponse.json({
      success: true,
      message: "Book added successfully",
      data: newBook,
    });
  } catch (error: any) {
    console.error("Add Book API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const books = await Book.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: books });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
