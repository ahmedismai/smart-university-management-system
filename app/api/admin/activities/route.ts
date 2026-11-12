import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Activity from "@/models/Activity";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "All";
    const action = searchParams.get("action") || "All";
    const pageStr = searchParams.get("page");
    const limitStr = searchParams.get("limit");

    // If no page/limit is provided and no filters are present, 
    // keep it simple and backward compatible for widgets.
    if (!pageStr && !limitStr && search === "" && status === "All" && action === "All") {
      const activities = await Activity.find().sort({ timestamp: -1 }).limit(10);
      return NextResponse.json(activities);
    }

    const page = parseInt(pageStr || "1", 10);
    const limit = parseInt(limitStr || "20", 10);
    const query: any = {};

    if (search) {
      query.$or = [
        { user: { $regex: search, $options: "i" } },
        { action: { $regex: search, $options: "i" } },
        { details: { $regex: search, $options: "i" } }
      ];
    }

    if (status !== "All") {
      query.status = status;
    }

    if (action !== "All") {
      // Allow prefix matching (e.g. "Create" matches "Create Student", "Create Course")
      query.action = { $regex: action, $options: "i" };
    }

    const skip = (page - 1) * limit;

    const total = await Activity.countDocuments(query);
    const activities = await Activity.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    // If page is explicitly requested or filters are applied, return paginated structure
    if (pageStr || limitStr || search || status !== "All" || action !== "All") {
      return NextResponse.json({
        activities,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      });
    }

    // Default fallback (though typically filters/pages will trigger the block above)
    return NextResponse.json(activities);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
