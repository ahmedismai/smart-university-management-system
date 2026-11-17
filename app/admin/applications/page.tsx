"use client";

import React, { useEffect, useState } from "react";
import useSWR from "swr";
import toast from "react-hot-toast";
import { FileText, Search, Copy, CheckCircle2, Paperclip, GraduationCap, X } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const STATUSES = ["Pending", "Under Review", "Accepted", "Rejected"];
const COLORS: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700",
  "Under Review": "bg-blue-100 text-blue-700",
  Accepted: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-700",
};
const DOC_LABELS: Record<string, string> = {
  photo: "Personal Photo",
  nationalId: "National ID",
  secondaryCertificate: "Thanaweya Amma Certificate",
  birthCertificate: "Birth Certificate",
};

type Enrollment = { studentId: string; tempPassword: string | null; program: string; name: string };

export default function ApplicationsPage() {
  const { data, mutate, isLoading } = useSWR("/api/admin/applications", fetcher);
  const { data: programsData } = useSWR("/api/admission/programs", fetcher);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<any>(null);
  const [program, setProgram] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);

  const programs: { code: string; name: string }[] = programsData?.programs || [];
  const apps: any[] = data?.applications || [];
  const q = query.trim().toLowerCase();
  const list = apps.filter(
    (a) =>
      (filter === "All" || a.status === filter) &&
      (!q ||
        a.fullName.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.applicationId.toLowerCase().includes(q) ||
        (a.studentId || "").toLowerCase().includes(q))
  );

  useEffect(() => {
    if (!open) return;
    const byName = programs.find((p) => p.name === open.department)?.code;
    setProgram(open.programCode || byName || "");
    setNote(open.decisionNote || "");
  }, [open, programs]);

  const setStatus = async (status: string) => {
    if (!open) return;
    if (status === "Accepted" && !open.studentId && !program) {
      toast.error("Choose the program to enroll the applicant in");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: open._id, status, programCode: program, decisionNote: note }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      if (json.enrollment) {
        setEnrollment({ ...json.enrollment, name: open.fullName });
        setOpen(null);
      } else {
        toast.success(`Marked as ${status}`);
        setOpen((o: any) => (o ? { ...o, ...json.application, documents: o.documents } : o));
      }
      mutate();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const copy = (text: string) => {
    navigator.clipboard?.writeText(text).then(() => toast.success("Copied"), () => toast.error("Copy failed"));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Admission Applications</h1>
        <p className="text-slate-500">
          Review applications from the public admission form. Accepting an applicant enrolls them as a student.
        </p>
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
        <div className="relative w-full sm:w-72 sm:ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email or ID"
            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm w-full"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left min-w-[760px]">
          <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
            <tr>
              {["Application", "Applicant", "Program", "Submitted", "Status", ""].map((h) => (
                <th key={h} className="px-6 py-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {list.map((a) => (
              <tr key={a._id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4">
                  <p className="font-bold text-primary">{a.applicationId}</p>
                  {a.studentId && <p className="text-[11px] font-bold text-emerald-600">Student {a.studentId}</p>}
                </td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-slate-800">{a.fullName}</p>
                  <p className="text-xs text-slate-400">{a.email}</p>
                </td>
                <td className="px-6 py-4">
                  {a.department}
                  {a.documents?.length > 0 && (
                    <p className="text-[11px] text-slate-400 flex items-center gap-1"><Paperclip size={11} /> {a.documents.length} document(s)</p>
                  )}
                </td>
                <td className="px-6 py-4 text-slate-500">{new Date(a.createdAt).toISOString().slice(0, 10)}</td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-extrabold px-2 py-1 rounded uppercase tracking-widest ${COLORS[a.status]}`}>{a.status}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => setOpen(a)} className="text-primary font-bold text-sm hover:underline cursor-pointer">Review</button>
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
          <div
            className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">{open.fullName}</h2>
                <p className="text-xs text-slate-400">
                  {open.applicationId} ·{" "}
                  <span className={`font-extrabold px-1.5 py-0.5 rounded uppercase tracking-widest text-[10px] ${COLORS[open.status]}`}>{open.status}</span>
                </p>
              </div>
              <button onClick={() => setOpen(null)} aria-label="Close" className="text-slate-400 hover:text-slate-700 cursor-pointer"><X size={20} /></button>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {[
                ["Email", open.email], ["Phone", open.phone], ["National ID", open.nationalId], ["Date of Birth", open.dob],
                ["Address", open.address], ["Program applied for", open.department],
                ["Preparatory Certificate", [open.sscInstitution, open.sscYear, open.sscGpa].filter(Boolean).join(" · ")],
                ["Secondary Certificate", [open.hscInstitution, open.hscYear, open.hscGpa].filter(Boolean).join(" · ")],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{k}</dt>
                  <dd className="text-slate-700 break-words">{v || "-"}</dd>
                </div>
              ))}
            </dl>

            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Documents</p>
              {open.documents?.length ? (
                <div className="flex flex-wrap gap-2">
                  {open.documents.map((d: any) => (
                    <a
                      key={d.id}
                      href={`/api/admin/applications/documents/${d.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-700"
                    >
                      <Paperclip size={14} /> {DOC_LABELS[d.kind] || d.kind}
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">No documents uploaded.</p>
              )}
            </div>

            {open.studentId ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-sm text-emerald-800 flex gap-3">
                <GraduationCap className="shrink-0" size={20} />
                <p>
                  Enrolled as <b>{open.studentId}</b> in {open.department}. The decision can no longer be changed.
                </p>
              </div>
            ) : (
              <>
                <label className="block space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Enroll in program (when accepting)</span>
                  <select
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  >
                    <option value="">Choose a program</option>
                    {programs.map((p) => (
                      <option key={p.code} value={p.code}>{p.code} - {p.name}</option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Message to the applicant (optional)</span>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={2}
                    placeholder="Shown on the applicant's status page"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </label>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      disabled={saving}
                      onClick={() => setStatus(s)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50 ${
                        s === "Accepted"
                          ? "bg-emerald-600 text-white hover:bg-emerald-700"
                          : s === "Rejected"
                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                            : open.status === s
                              ? "bg-primary text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {s === "Accepted" ? "Accept & Enroll" : s === "Rejected" ? "Reject" : s}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {enrollment && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-md space-y-5 text-center">
            <CheckCircle2 className="mx-auto text-emerald-500" size={48} />
            <div>
              <h2 className="text-xl font-bold text-slate-800">{enrollment.name} is enrolled</h2>
              <p className="text-sm text-slate-500">{enrollment.program}</p>
            </div>
            {(
              [
                ["Student ID", enrollment.studentId],
                ...(enrollment.tempPassword ? [["Temporary password", enrollment.tempPassword]] : []),
              ] as [string, string][]
            ).map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl text-left">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{label}</p>
                  <p className="font-mono font-bold text-primary">{value}</p>
                </div>
                <button onClick={() => copy(value)} aria-label={`Copy ${label}`} className="p-2 rounded-lg hover:bg-slate-200 text-slate-500 cursor-pointer">
                  <Copy size={16} />
                </button>
              </div>
            ))}
            {enrollment.tempPassword ? (
              <p className="text-xs text-amber-700 bg-amber-50 rounded-xl p-3">
                This applicant did not choose a password, so give them the temporary password now: it is shown only once.
                They can change it from Settings after signing in.
              </p>
            ) : (
              <p className="text-xs text-emerald-700 bg-emerald-50 rounded-xl p-3">
                The student signs in with this Student ID and the password they created when applying. They can see their
                Student ID on the Application Status page.
              </p>
            )}
            <button onClick={() => setEnrollment(null)} className="w-full bg-primary text-white py-3 rounded-xl font-bold cursor-pointer">
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
