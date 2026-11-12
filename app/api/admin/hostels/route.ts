import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Hostel from "@/models/Hostel";

export async function GET() {
  try {
    await dbConnect();
    const hostels = await Hostel.find().sort({ createdAt: -1 });

    let totalCapacity = 0;
    let occupied = 0;
    
    hostels.forEach(h => {
      totalCapacity += h.capacity;
      occupied += h.occupied;
    });

    const stats = {
      totalCapacity,
      occupied,
      available: totalCapacity - occupied
    };

    return NextResponse.json({
      success: true,
      data: {
        hostels,
        stats
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    
    const newHostel = await Hostel.create(body);

    return NextResponse.json({ success: true, data: newHostel });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
