"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X, Loader2, ClipboardCheck } from "lucide-react";

type Item = { _id: string; itemName: string; category: string; quantity: number; unit: string; location?: string };

/** Physical stock-take: enter what you counted, see the differences, then store the audit (optionally fixing the stock). */
export function InventoryAuditModal({ items, onClose, onDone }: { items: Item[]; onClose: () => void; onDone: () => void }) {
  const [counts, setCounts] = useState<Record<string, string>>({});
  const [apply, setApply] = useState(true);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const entered = items.filter((i) => counts[i._id] !== undefined && counts[i._id] !== "");
  const diffs = entered.filter((i) => Number(counts[i._id]) !== i.quantity);

  const submit = async () => {
    if (!entered.length) return toast.error("Enter at least one counted quantity");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/inventory/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ counts: entered.map((i) => ({ id: i._id, counted: Number(counts[i._id]) })), apply, note }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Audit failed");
      toast.success(
        json.discrepancies
          ? `Audit saved: ${json.discrepancies} difference${json.discrepancies > 1 ? "s" : ""}${json.applied ? ", stock corrected" : ""}`
          : "Audit saved: everything matches"
      );
      onDone();
      onClose();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50" onMouseDown={onClose}>
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-3xl shadow-2xl" onMouseDown={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
            <ClipboardCheck size={20} className="text-primary" /> Inventory audit
          </h3>
          <button onClick={onClose} aria-label="Close" className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-4">
          <p className="text-xs text-slate-500 mb-3">Count the items physically and enter the quantity you found. Leave a row empty to skip it.</p>
          <table className="w-full text-left text-sm">
            <thead className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
              <tr>
                <th className="py-2">Item</th>
                <th className="py-2">Location</th>
                <th className="py-2 text-right">In system</th>
                <th className="py-2 text-right w-28">Counted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {items.map((i) => {
                const c = counts[i._id];
                const differs = c !== undefined && c !== "" && Number(c) !== i.quantity;
                return (
                  <tr key={i._id}>
                    <td className="py-2 font-bold text-slate-800">
                      {i.itemName} <span className="text-[10px] font-medium text-slate-400">{i.category}</span>
                    </td>
                    <td className="py-2 text-xs text-slate-500">{i.location || "-"}</td>
                    <td className="py-2 text-right text-slate-600">
                      {i.quantity} {i.unit}
                    </td>
                    <td className="py-2 text-right">
                      <input
                        type="number"
                        min="0"
                        value={c ?? ""}
                        onChange={(e) => setCounts((s) => ({ ...s, [i._id]: e.target.value }))}
                        className={`w-24 rounded-lg border px-2 py-1.5 text-right text-sm outline-none focus:border-primary ${differs ? "border-amber-400 bg-amber-50" : "border-slate-200"}`}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 space-y-3">
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note (optional)"
            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-primary"
          />
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={apply} onChange={(e) => setApply(e.target.checked)} />
            Correct the stock in the system to match my count
          </label>
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              {entered.length} counted · <span className={diffs.length ? "text-amber-600 font-bold" : ""}>{diffs.length} difference{diffs.length === 1 ? "" : "s"}</span>
            </p>
            <div className="flex gap-3">
              <button onClick={onClose} className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
              <button onClick={submit} disabled={busy} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-60">
                {busy && <Loader2 size={16} className="animate-spin" />} Save audit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
