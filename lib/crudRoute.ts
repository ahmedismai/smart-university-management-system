import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/adminAuth";

type Ctx = { params: Promise<{ id: string }> };

type Options = {
  /** fields that must never be sent back to the browser */
  hide?: string;
  /** transform the update payload (e.g. hash a password); return an error string to reject */
  beforeUpdate?: (body: any, existing: any) => Promise<any> | any;
  /** runs after the document was deleted (e.g. remove the matching login account) */
  afterDelete?: (doc: any) => Promise<void> | void;
  /** runs after an update (e.g. keep the login account in sync) */
  afterUpdate?: (doc: any, before: any) => Promise<void> | void;
};

/** GET / PUT / DELETE handlers for /api/admin/<entity>/[id], admin only. */
export function entityItemRoute(Model: any, opts: Options = {}) {
  const guard = async () => ((await getAdminContext()) ? null : NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  const find = (id: string) => (opts.hide ? Model.findById(id).select(opts.hide) : Model.findById(id));

  return {
    async GET(_req: Request, { params }: Ctx) {
      const denied = await guard();
      if (denied) return denied;
      try {
        const doc = await find((await params).id).catch(() => null);
        return doc ? NextResponse.json(doc) : NextResponse.json({ error: "Not found" }, { status: 404 });
      } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
      }
    },

    async PUT(request: Request, { params }: Ctx) {
      const denied = await guard();
      if (denied) return denied;
      try {
        const { id } = await params;
        const before: any = await Model.findById(id).lean().catch(() => null);
        if (!before) return NextResponse.json({ error: "Not found" }, { status: 404 });
        let body = await request.json();
        delete body._id;
        if (opts.beforeUpdate) {
          const out = await opts.beforeUpdate(body, before);
          if (typeof out === "string") return NextResponse.json({ error: out }, { status: 400 });
          body = out;
        }
        const doc = await Model.findByIdAndUpdate(id, body, { returnDocument: "after", runValidators: true });
        if (opts.afterUpdate) await opts.afterUpdate(doc, before);
        const clean = opts.hide ? await find(id) : doc;
        return NextResponse.json(clean);
      } catch (e: any) {
        const msg = e?.code === 11000 ? "A record with the same unique value (email or ID) already exists." : e.message;
        return NextResponse.json({ error: msg }, { status: e?.code === 11000 ? 409 : 500 });
      }
    },

    async DELETE(_req: Request, { params }: Ctx) {
      const denied = await guard();
      if (denied) return denied;
      try {
        const doc = await Model.findByIdAndDelete((await params).id).catch(() => null);
        if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
        if (opts.afterDelete) await opts.afterDelete(doc);
        return NextResponse.json({ success: true });
      } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
      }
    },
  };
}
