import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import User from "@/models/User";

/** Returns the logged-in admin user (from the admin_session cookie) or null. */
export async function getAdminContext() {
  await dbConnect();
  const session = (await cookies()).get("admin_session")?.value;
  if (!session) return null;
  const user: any = await User.findOne({ email: session.toLowerCase(), role: "Admin" }).lean();
  return user || null;
}
