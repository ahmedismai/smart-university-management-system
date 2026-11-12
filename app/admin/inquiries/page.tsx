"use client";

import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Inbox, Loader2, Trash2, KeyRound, UserX, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = {
  _id: string;
  type: string;
  subject: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  meta: Record<string, any>;
  pagePath: string;
  userRole: string;
  userRef: string;
  status: "New" | "In Progress" | "Resolved";
  adminNote: string;
  createdAt: string;
};

const TYPES = ["all", "contact", "apply", "registration", "subscribe", "leave", "deactivation", "password-reset", "other"];
const STATUSES = ["all", "New", "In Progress", "Resolved"];
const badge: Record<string, string> = {
  New: "bg-red-100 text-red-700",
  "In Progress": "bg-amber-100 text-amber-700",
  Resolved: "bg-emerald-100 text-emerald-700",
};

export default function InquiriesPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const load = useCallback(async () => {
    const qs = new URLSearchParams();
    if (type !== "all") qs.set("type", type);
    if (status !== "all") qs.set("status", status);
    const res = await fetch(`/api/admin/inquiries?${qs}`);
    const json = await res.json();
    if (res.ok) setItems(json.items);
    else toast.error(json.error || "Failed to load");
    setLoading(false);
  }, [type, status]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  const patch = async (id: string, body: Record<string, any>) => {
    const res = await fetch(`/api/admin/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) return toast.error(json.error || "Failed");
    toast.success(json.message || "Updated");
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this request?")) return;
    const res = await fetch(`/api/admin/inquiries/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Deleted");
      setItems((l) => l.filter((x) => x._id !== id));
    }
  };

  const select = "px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none";

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Requests & Inquiries</h1>
          <p className="text-slate-500">Contact forms, applications, leave requests, password resets and more from the site and portals.</p>
        </div>
        <div className="flex gap-3">
          <select value={type} onChange={(e) => setType(e.target.value)} className={select}>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t === "all" ? "All types" : t}
              </option>
            ))}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={select}>
            {STATUSES.map((t) => (
              <option key={t} value={t}>
                {t === "all" ? "All statuses" : t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((i) => (
            <div key={i._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm">
              <button
                onClick={() => {
                  setOpen(open === i._id ? null : i._id);
                  setNote(i.adminNote || "");
                }}
                className="w-full text-left p-5 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0">
                  <Inbox size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 truncate">{i.subject}</p>
                  <p className="text-xs text-slate-500 truncate">
                    {i.type} · {i.name || "Anonymous"}
                    {i.userRole ? ` (${i.userRole} ${i.userRef})` : ""} · {new Date(i.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase", badge[i.status])}>{i.status}</span>
              </button>

              {open === i._id && (
                <div className="px-5 pb-5 space-y-4 border-t border-slate-50 pt-4">
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-600">
                    {i.email && (
                      <a href={`mailto:${i.email}`} className="flex items-center gap-2 hover:text-primary">
                        <Mail size={14} /> {i.email}
                      </a>
                    )}
                    {i.phone && (
                      <a href={`tel:${i.phone}`} className="flex items-center gap-2 hover:text-primary">
                        <Phone size={14} /> {i.phone}
                      </a>
                    )}
                    {i.pagePath && <span className="text-slate-400">from {i.pagePath}</span>}
                  </div>
                  {i.message && <p className="text-sm text-slate-700 whitespace-pre-line bg-slate-50 rounded-xl p-4">{i.message}</p>}
                  {Object.keys(i.meta || {}).length > 0 && (
                    <dl className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      {Object.entries(i.meta).map(([k, v]) => (
                        <div key={k}>
                          <dt className="text-slate-400 uppercase font-bold tracking-wider">{k}</dt>
                          <dd className="text-slate-800 font-medium break-words">{String(v)}</dd>
                        </div>
                      ))}
                    </dl>
                  )}

                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Internal note..."
                    rows={2}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-primary"
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    {(["New", "In Progress", "Resolved"] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => patch(i._id, { status: st, adminNote: note })}
                        className={cn(
                          "px-4 py-2 rounded-lg text-xs font-bold border",
                          i.status === st ? "bg-primary text-white border-primary" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        )}
                      >
                        {st}
                      </button>
                    ))}
                    <button onClick={() => patch(i._id, { adminNote: note })} className="px-4 py-2 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50">
                      Save note
                    </button>
                    {i.type === "password-reset" && (
                      <button
                        onClick={() => confirm(`Reset the password for ${i.email} to the default password?`) && patch(i._id, { action: "reset-password" })}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-amber-500 text-white hover:opacity-90"
                      >
                        <KeyRound size={14} /> Reset password
                      </button>
                    )}
                    {i.type === "deactivation" && i.userRole === "Student" && (
                      <button
                        onClick={() => confirm(`Deactivate student ${i.userRef}?`) && patch(i._id, { action: "deactivate-student" })}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-red-600 text-white hover:opacity-90"
                      >
                        <UserX size={14} /> Deactivate student
                      </button>
                    )}
                    <button onClick={() => remove(i._id)} className="ml-auto p-2 text-slate-400 hover:text-red-600" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {items.length === 0 && <p className="text-center text-slate-400 py-16">No requests match these filters.</p>}
        </div>
      )}
    </div>
  );
}
