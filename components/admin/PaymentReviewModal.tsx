"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X, Loader2, Check, XCircle } from "lucide-react";

type Row = { feeId: string; id: string; student: string; amount: string; method: string; date: string; type: string };

/** Payments that students submitted (wallet / bank transfer) and the finance office has to verify. */
export function PaymentReviewModal({ rows, onClose, onDone }: { rows: Row[]; onClose: () => void; onDone: () => void }) {
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const act = async (action: "approve" | "reject", ids: string[] | "all", key: string) => {
    setBusy(key);
    try {
      const res = await fetch("/api/admin/financial/payments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ids === "all" ? { action, all: true } : { action, ids }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      toast.success(json.message);
      onDone();
      if (ids === "all" || rows.length <= 1) onClose();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50" onMouseDown={onClose}>
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-3xl shadow-2xl" onMouseDown={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="font-black text-slate-800 text-lg">Payments awaiting verification</h3>
            <p className="text-xs text-slate-500">Approve to mark the fee as paid. The student is notified either way.</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-4">
          {rows.length === 0 ? (
            <p className="py-10 text-center text-slate-400">Nothing to verify right now.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                <tr>
                  <th className="py-2">Student</th>
                  <th className="py-2">Fee</th>
                  <th className="py-2">Method</th>
                  <th className="py-2 text-right">Amount (EGP)</th>
                  <th className="py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rows.map((r) => (
                  <tr key={r.feeId}>
                    <td className="py-3 font-bold text-slate-800">
                      {r.student}
                      <div className="text-[10px] font-medium text-slate-400">{r.id}</div>
                    </td>
                    <td className="py-3 text-slate-600">{r.type}</td>
                    <td className="py-3 text-slate-600">{r.method}</td>
                    <td className="py-3 text-right font-bold">{r.amount}</td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => act("approve", [r.feeId], r.feeId + "a")}
                          disabled={busy !== null}
                          title="Approve"
                          className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 disabled:opacity-50"
                        >
                          {busy === r.feeId + "a" ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                        </button>
                        <button
                          onClick={() => act("reject", [r.feeId], r.feeId + "r")}
                          disabled={busy !== null}
                          title="Reject"
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50"
                        >
                          {busy === r.feeId + "r" ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {rows.length > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => act("approve", "all", "all")}
              disabled={busy !== null}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-60"
            >
              {busy === "all" && <Loader2 size={16} className="animate-spin" />} Approve all ({rows.length})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
