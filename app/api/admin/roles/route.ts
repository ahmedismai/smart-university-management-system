import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import RolePermission from "@/models/RolePermission";

const ROLES = ["Admin", "Teacher", "Student", "Staff", "Parent"];
const MODULES = ["User Management", "Academic Records", "Financial Management", "Library System", "Inventory Control"];
const ACTIONS = ["View", "Create", "Edit", "Delete"];

function defaultsFor(role: string): Record<string, string[]> {
  const pick = (actions: string[]) => Object.fromEntries(MODULES.map((m) => [m, actions]));
  switch (role) {
    case "Admin": return pick(ACTIONS);
    case "Teacher": return { ...pick([]), "Academic Records": ["View", "Create", "Edit"], "Library System": ["View"] };
    case "Student": return { ...pick([]), "Academic Records": ["View"], "Library System": ["View", "Create"], "Financial Management": ["View"] };
    case "Staff": return { ...pick(["View"]), "Inventory Control": ["View", "Create", "Edit"] };
    default: return { ...pick([]), "Academic Records": ["View"] };
  }
}

async function guard() {
  return (await cookies()).get("admin_session") ? null : NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET() {
  try {
    await dbConnect();
    const denied = await guard();
    if (denied) return denied;

    const [counts, saved]: any[] = await Promise.all([
      User.aggregate([{ $group: { _id: "$role", n: { $sum: 1 } } }]),
      RolePermission.find().lean(),
    ]);

    const roles = ROLES.map((role) => {
      const doc = saved.find((s: any) => s.role === role);
      return {
        name: role,
        users: counts.find((c: any) => c._id === role)?.n || 0,
        permissions: doc ? Object.fromEntries(Object.entries(doc.permissions as any)) : defaultsFor(role),
        customized: !!doc,
        defaults: defaultsFor(role),
      };
    });
    return NextResponse.json({ success: true, roles, modules: MODULES, actions: ACTIONS });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT { role, permissions: { module: [actions] } }
export async function PUT(request: Request) {
  try {
    await dbConnect();
    const denied = await guard();
    if (denied) return denied;

    const { role, permissions } = await request.json();
    if (!ROLES.includes(role) || typeof permissions !== "object" || !permissions) {
      return NextResponse.json({ error: "Valid role and permissions are required" }, { status: 400 });
    }
    const clean: Record<string, string[]> = {};
    for (const m of MODULES) {
      const list = Array.isArray(permissions[m]) ? permissions[m] : [];
      clean[m] = list.filter((a: string) => ACTIONS.includes(a));
    }
    await RolePermission.findOneAndUpdate({ role }, { role, permissions: clean }, { upsert: true, new: true });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
