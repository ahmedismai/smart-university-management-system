import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import TransportRoute from "@/models/TransportRoute";

export async function GET() {
  try {
    await dbConnect();
    const routes = await TransportRoute.find().sort({ createdAt: -1 });

    let subscribed = 0;
    routes.forEach(r => subscribed += r.students);

    const stats = {
      totalVehicles: routes.length,
      activeRoutes: routes.filter(r => r.status !== 'Cancelled').length,
      subscribed
    };

    return NextResponse.json({
      success: true,
      data: {
        routes,
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
    
    const newRoute = await TransportRoute.create(body);

    return NextResponse.json({ success: true, data: newRoute });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
