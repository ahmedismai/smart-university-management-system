import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Waiver from "@/models/Waiver";
import FeeHead from "@/models/FeeHead";
import Fee from "@/models/Fee";

export async function GET() {
  try {
    await dbConnect();

    // Fetch all fee heads
    const feeHeads = await FeeHead.find({}).sort({ createdAt: -1 });

    // Calculate Stats
    const allFees = await Fee.find({});
    
    let totalRevenue = 0;
    let outstanding = 0;
    let paidCount = 0;
    let totalCount = allFees.length;

    allFees.forEach(fee => {
      if (fee.status === "Paid") {
        totalRevenue += fee.amount;
        paidCount++;
      } else {
        outstanding += fee.amount;
      }
    });

    const waiversTotal = (await Waiver.find().select("amount").lean()).reduce((n: number, w: any) => n + (w.amount || 0), 0);
    const collectionRate = totalCount > 0 ? (paidCount / totalCount) * 100 : 0;
    
    // Format stats for the frontend
    const stats = [
      { 
        label: "Total Revenue", 
        value: `EGP ${(totalRevenue / 1000000).toFixed(1)}M`, 
        icon: "DollarSign", 
        color: "bg-emerald-500",
        raw: totalRevenue
      },
      { 
        label: "Collection Rate", 
        value: `${collectionRate.toFixed(1)}%`, 
        icon: "TrendingUp", 
        color: "bg-blue-500",
        raw: collectionRate
      },
      { 
        label: "Outstanding", 
        value: `EGP ${(outstanding / 1000000).toFixed(1)}M`, 
        icon: "AlertCircle", 
        color: "bg-amber-500",
        raw: outstanding
      },
      { 
        label: "Total Waivers", 
        value: `EGP ${(waiversTotal / 1000000).toFixed(1)}M`,
        raw: waiversTotal,
        icon: "PieChart", 
        color: "bg-purple-500" 
      },
    ];

    return NextResponse.json({ feeHeads, stats });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    const newFeeHead = await FeeHead.create(data);
    return NextResponse.json(newFeeHead, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
