import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Fee from "@/models/Fee";
import Student from "@/models/Student";
import Class from "@/models/Class";

export async function GET() {
  try {
    await dbConnect();

    // Fetch all fees and populate student info
    const fees = await Fee.find({})
      .populate({
        path: 'studentId',
        select: 'name studentId classId',
        populate: {
          path: 'classId',
          select: 'name'
        }
      })
      .sort({ createdAt: -1 });

    const now = new Date();

    // Calculate stats
    const stats = [
      { label: "Total Generated", value: fees.length.toLocaleString(), icon: "FileText", color: "bg-blue-500" },
      { label: "Paid Invoices", value: fees.filter((f: any) => f.status === 'Paid').length.toLocaleString(), icon: "CheckCircle2", color: "bg-emerald-500" },
      { label: "Pending Payments", value: fees.filter((f: any) => f.status === 'Pending' && new Date(f.dueDate) >= now).length.toLocaleString(), icon: "Clock", color: "bg-amber-500" },
      { label: "Overdue", value: fees.filter((f: any) => f.status === 'Pending' && new Date(f.dueDate) < now).length.toLocaleString(), icon: "AlertCircle", color: "bg-red-500" },
    ];

    // Calculate financial summary
    const totalExpected = fees.reduce((acc: number, f: any) => acc + f.amount, 0);
    const currentCollection = fees.filter((f: any) => f.status === 'Paid').reduce((acc: number, f: any) => acc + f.amount, 0);

    // Calculate departmental status
    const classStats: { [key: string]: { total: number, paid: number } } = {};
    fees.forEach((fee: any) => {
      const className = fee.studentId?.classId?.name || "Other";
      if (!classStats[className]) {
        classStats[className] = { total: 0, paid: 0 };
      }
      classStats[className].total++;
      if (fee.status === 'Paid') {
        classStats[className].paid++;
      }
    });

    const departmentalStatus = Object.keys(classStats).map(name => ({
      name,
      paid: Math.round((classStats[name].paid / classStats[name].total) * 100)
    })).sort((a, b) => b.paid - a.paid).slice(0, 3);

    return NextResponse.json({
      invoices: fees.map((f: any) => ({
        id: `INV-${f._id.toString().slice(-6).toUpperCase()}`,
        student: f.studentId?.name || "Unknown",
        stuId: f.studentId?.studentId || "N/A",
        amount: f.amount.toLocaleString(),
        dueDate: new Date(f.dueDate).toISOString().split('T')[0],
        status: f.status === 'Pending' && new Date(f.dueDate) < now ? 'Overdue' : f.status,
        method: f.status === 'Paid' ? 'Bank' : 'N/A' 
      })),
      stats,
      summary: {
        totalExpected: (totalExpected / 1000000).toFixed(1) + "M",
        currentCollection: (currentCollection / 1000000).toFixed(1) + "M"
      },
      departmentalStatus
    });
  } catch (error: any) {
    console.error("Invoices API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    
    if (!data.studentId || !data.amount || !data.dueDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newFee = await Fee.create({
      studentId: data.studentId,
      amount: Number(data.amount),
      dueDate: new Date(data.dueDate),
      status: "Pending"
    });

    return NextResponse.json(newFee, { status: 201 });
  } catch (error: any) {
    console.error("Create Invoice Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
