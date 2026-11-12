import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import Student from "@/models/Student";
import Book from "@/models/Book";
import BookIssue from "@/models/BookIssue";
import Fine from "@/models/Fine";

// Helper function to generate a stable cover image based on ISBN
function getBookCover(isbn: string, index: number): string {
  const images = [
    "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=200",
    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=200",
    "https://images.unsplash.com/photo-1511649475669-e288648b2339?auto=format&fit=crop&q=80&w=200",
    "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=200",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=200",
    "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=200",
    "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=200",
    "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=200"
  ];
  if (!isbn) return images[index % images.length];
  let hash = 0;
  for (let i = 0; i < isbn.length; i++) {
    hash = isbn.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % images.length;
  return images[idx];
}

// Helper to generate a stable rating based on book title length
function getBookRating(title: string): number {
  if (!title) return 4.5;
  const rating = 4.0 + ((title.length * 7) % 10) / 10;
  return Number(rating.toFixed(1));
}

export async function GET(request: Request) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const studentSession = cookieStore.get("student_session")?.value;

    if (!studentSession) {
      return NextResponse.json({ error: "Unauthorized: No active session" }, { status: 401 });
    }

    // Fetch student profile using the session cookie
    const student = await Student.findOne({ studentId: studentSession });
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Get search/filter params
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    // 1. Fetch currently borrowed active issues
    const activeIssues = await BookIssue.find({
      memberId: student.studentId,
      status: { $in: ["Active", "Overdue"] }
    })
    .populate("book")
    .sort({ dueDate: 1 })
    .lean();

    // Transform active issues to include calculations (progress, days left, etc.)
    const today = new Date();
    const borrowedBooks = activeIssues.map((issue: any) => {
      const issueDate = issue.issueDate ? new Date(issue.issueDate) : new Date();
      const dueDate = new Date(issue.dueDate);
      
      const totalDuration = dueDate.getTime() - issueDate.getTime();
      const elapsed = today.getTime() - issueDate.getTime();
      let progress = 50; // fallback
      if (totalDuration > 0) {
        progress = Math.max(0, Math.min(100, Math.round((elapsed / totalDuration) * 100)));
      }

      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return {
        id: issue._id.toString(),
        title: issue.book?.title || "Unknown Book",
        author: issue.book?.author || "Unknown Author",
        isbn: issue.book?.isbn || "",
        dueDate: dueDate.toISOString().split("T")[0],
        status: issue.status,
        progress,
        daysLeft: diffDays
      };
    });

    // 2. Fetch/filter the book catalog for search and recommendations
    const bookQuery: any = {};
    if (category && category !== "All") {
      bookQuery.category = { $regex: new RegExp(`^${category}$`, "i") };
    }
    if (search) {
      bookQuery.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { isbn: { $regex: search, $options: "i" } }
      ];
    }

    const booksList = await Book.find(bookQuery).limit(12).lean();
    
    // Books of the catalogue (cover images are stock pictures: the library has no cover data)
    const catalogBooks = booksList.map((book: any, idx: number) => ({
      id: book._id.toString(),
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category || "General",
      available: book.availableCopies > 0,
      image: getBookCover(book.isbn, idx),
      location: book.location || "Main Shelf",
      availableCopies: book.availableCopies,
      copies: book.copies
    }));

    // 3. Calculate student library stats
    const totalBorrowedCount = await BookIssue.countDocuments({
      memberId: student.studentId
    });

    const returnedIssues = await BookIssue.find({
      memberId: student.studentId,
      status: "Returned"
    }).lean();

    const returnedOnTime = returnedIssues.filter((issue: any) => {
      if (!issue.returnDate) return true;
      return new Date(issue.returnDate) <= new Date(issue.dueDate);
    }).length;

    const onTimeRate = returnedIssues.length > 0
      ? Math.round((returnedOnTime / returnedIssues.length) * 100)
      : 98; // Realistic default if they haven't returned any book yet

    const unpaidFines = await Fine.find({
      studentId: student._id,
      type: "Library",
      status: "Unpaid"
    }).lean();

    const activeFinesAmount = unpaidFines.reduce((sum: number, fine: any) => sum + fine.amount, 0);

    return NextResponse.json({
      success: true,
      data: {
        borrowedBooks,
        catalogBooks,
        stats: {
          totalBorrowed: totalBorrowedCount,
          onTimeRate: `${onTimeRate}%`,
          activeFines: `EGP ${activeFinesAmount.toFixed(2)}`
        }
      }
    });

  } catch (error: any) {
    console.error("Student Library API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
