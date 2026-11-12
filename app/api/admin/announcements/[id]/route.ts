import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Announcement from "@/models/Announcement";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    const body = await request.json();
    const announcement = await Announcement.findByIdAndUpdate(id, body, { new: true });
    
    if (!announcement) {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
    }
    
    return NextResponse.json(announcement);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    const announcement = await Announcement.findByIdAndDelete(id);
    
    if (!announcement) {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Announcement deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
