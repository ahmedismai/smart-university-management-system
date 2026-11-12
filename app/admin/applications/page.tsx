"use client";

import React, { useState } from "react";
import useSWR from "swr";
import toast from "react-hot-toast";
import { FileText, Search } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const STATUSES = ["Pending", "Under Review", "Accepted", "Rejected"];
const COLORS: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700",
  "Under Review": "bg-blue-100 text-blue-700",
  Accepted: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-700",
};

export default function ApplicationsPage() {
  const { data, mutate, isLoading } = useSWR("/api/admin/applications", fetcher);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<any>(null);

  const apps: any[] = data?.applications || [];
  const q = query.trim().toLowerCase();
  const list = apps.filter(
    (a) =>
      (filter === "All" || a.status === filter) &&
      (!q || a.fullName.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || a.applicationId.toLowerCase().includes(q))
  );

  const setStatus = async (id: string, status: string) => {
    const res = await fetch("/api/admin/applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const json = await res.json();
    if (res.ok) {
      toast.success(`Marked as ${status}`);
      setOpen((o: any) => (o && o._id === id ? { ...o, status } : o));
      mutate();
    } else toast.error(json.error || "Failed");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Admission Applications</h1>
        <p className="text-slate-500">Applications submitted from the public admission form.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {["All", ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-bold cursor-pointer ${filter === s ? "bg-primary text-white" : "bg-white border border-slate-200 text-slate-600"}`}
          >
            {s} {s === "All" ? `(${apps.length})` : `(${apps.filter((a) => a.status === s).length})`}
          </button>
        ))}
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email or ID" className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm w-72" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
            <tr>
              {["Application", "Applicant", "Department", "Submitted", "Status", ""].map((h) => (
                <th key={h} className="px-6 py-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {list.map((a) => (
              <tr key={a._id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 font-bold text-primary">{a.applicationId}</td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-slate-800">{a.fullName}</p>
                  <p className="text-xs text-slate-400">{a.email}</p>
                </td>
                <td className="px-6 py-4">{a.department}</td>
                <td className="px-6 py-4 text-slate-500">{new Date(a.createdAt).toISOString().slice(0, 10)}</td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-extrabold px-2 py-1 rounded uppercase tracking-widest ${COLORS[a.status]}`}>{a.status}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => setOpen(a)} className="text-primary font-bold text-sm hover:underline cursor-pointer">View</button>
                </td>
              </tr>
            ))}
            {!isLoading && list.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-10 text-center text-slate-400"><FileText className="mx-auto mb-2" />No applications yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setOpen(null)}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-slate-800">{open.fullName}</h2>
                <p className="text-xs text-slate-400">{open.applicationId}</p>
              </div>
              <button onClick={() => setOpen(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">✕</button>
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {[
                ["Email", open.email], ["Phone", open.phone], ["Date of Birth", open.dob], ["Address", open.address],
                ["Faculty", open.faculty], ["Department", open.department],
                ["SSC / O-Level", [open.sscInstitution, open.sscYear, open.sscGpa].filter(Boolean).join(" · ")],
                ["HSC / A-Level", [open.hscInstitution, open.hscYear, open.hscGpa].filter(Boolean).join(" · ")],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{k}</dt>
                  <dd className="text-slate-700">{v || "-"}</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-wrap gap-2 pt-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(open._id, s)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer ${open.status === s ? "bg-primary text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
