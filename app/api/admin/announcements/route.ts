import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Announcement from "@/models/Announcement";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const query: any = {};

    const category = searchParams.get("category");
    if (category && category !== "All") {
      query.category = category;
    }

    const announcements = await Announcement.find(query).sort({ createdAt: -1 });
    return NextResponse.json(announcements);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const announcement = await Announcement.create(body);
    return NextResponse.json(announcement, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
