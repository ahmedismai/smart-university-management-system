import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import { getAdminContext } from "@/lib/adminAuth";
import User from "@/models/User";

const unauthorized = () => NextResponse.json({ error: "Unauthorized" }, { status: 401 });

export async function GET(request: Request) {
  try {
    if (!(await getAdminContext())) return unauthorized();
    const { searchParams } = new URL(request.url);
    const query: any = {};

    const search = searchParams.get("search");
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const role = searchParams.get("role");
    if (role && role !== "All") {
      query.role = role;
    }

    // password hashes never leave the server
    const users = await User.find(query).select("-password").sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await getAdminContext())) return unauthorized();
    await dbConnect();
    const body = await request.json();
    if (!body.password || String(body.password).length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }
    body.password = await bcrypt.hash(String(body.password), 10);
    const user = await User.create(body);
    const { password: _pw, ...safe } = user.toObject();
    return NextResponse.json(safe, { status: 201 });
  } catch (error: any) {
    return error?.code === 11000
      ? NextResponse.json({ error: "A user with this email already exists." }, { status: 409 })
      : NextResponse.json({ error: error.message }, { status: 500 });
  }
}
