import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("teacher_session", "", { path: "/", maxAge: 0 });
  return response;
}
