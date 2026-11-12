import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Book from "@/models/Book";
import BookIssue from "@/models/BookIssue";

export async function GET() {
  try {
    await dbConnect();

    const totalBooksObj = await Book.aggregate([
      { $group: { _id: null, total: { $sum: "$copies" } } }
    ]);
    const totalBooks = totalBooksObj[0]?.total || 0;

    const issuedBooks = await BookIssue.countDocuments({ status: "Active" });
    const overdueBooks = await BookIssue.countDocuments({ status: "Overdue" });

    // Optional: Count new arrivals based on createdAt within last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newArrivals = await Book.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    // Popular Books (e.g., sorting by total issues, or just returning some high demand)
    // Here we'll just fetch some random books with availableCopies < copies as a proxy for high demand
    const popularBooks = await Book.find({ availableCopies: { $lt: 5 } }).limit(5).lean();
    
    // We also need recent issues for the table
    const recentIssues = await BookIssue.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("book")
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalBooks,
          issuedBooks,
          overdueBooks,
          newArrivals,
        },
        popularBooks,
        recentIssues,
      },
    });
  } catch (error: any) {
    console.error("Library Stats API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
