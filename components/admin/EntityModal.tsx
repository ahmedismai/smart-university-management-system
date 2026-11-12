"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X, Loader2 } from "lucide-react";

export type EntityField = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "password" | "select";
  options?: (string | { value: string; label: string })[];
  required?: boolean;
  /** only shown/sent when adding */
  addOnly?: boolean;
  help?: string;
};

type Props = {
  title: string;
  mode: "add" | "edit" | "view";
  fields: EntityField[];
  initial?: Record<string, any>;
  /** endpoint of the collection, e.g. /api/admin/students */
  endpoint: string;
  onClose: () => void;
  onSaved: () => void;
};

const cls =
  "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:bg-slate-50";

export function EntityModal({ title, mode, fields, initial = {}, endpoint, onClose, onSaved }: Props) {
  const [values, setValues] = useState<Record<string, any>>(initial);
  const [busy, setBusy] = useState(false);
  const readOnly = mode === "view";
  const visible = fields.filter((f) => !(f.addOnly && mode !== "add"));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const payload: Record<string, any> = {};
      visible.forEach((f) => {
        if (values[f.name] !== undefined && values[f.name] !== "") payload[f.name] = values[f.name];
      });
      const url = mode === "edit" ? `${endpoint}/${initial._id}` : endpoint;
      const res = await fetch(url, {
        method: mode === "edit" ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Request failed");
      toast.success(mode === "edit" ? "Changes saved" : "Created successfully");
      onSaved();
      onClose();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50" onMouseDown={onClose}>
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl" onMouseDown={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white rounded-t-3xl">
          <h3 className="font-black text-slate-800 text-lg">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          {visible.map((f) => (
            <label key={f.name} className="block">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{f.label}</span>
              {f.type === "select" ? (
                <select
                  disabled={readOnly}
                  required={f.required}
                  value={values[f.name] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                  className={`${cls} mt-1`}
                >
                  <option value="">Select...</option>
                  {f.options?.map((o) => {
                    const opt = typeof o === "string" ? { value: o, label: o } : o;
                    return (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    );
                  })}
                </select>
              ) : (
                <input
                  type={f.type || "text"}
                  disabled={readOnly}
                  required={f.required}
                  value={values[f.name] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                  className={`${cls} mt-1`}
                />
              )}
              {f.help && !readOnly && <span className="text-[11px] text-slate-400">{f.help}</span>}
            </label>
          ))}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-slate-200 rounded-xl py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50">
              {readOnly ? "Close" : "Cancel"}
            </button>
            {!readOnly && (
              <button disabled={busy} className="flex-1 flex items-center justify-center gap-2 bg-primary text-white rounded-xl py-2.5 text-sm font-bold hover:opacity-90 disabled:opacity-60">
                {busy && <Loader2 size={16} className="animate-spin" />}
                {mode === "edit" ? "Save changes" : "Create"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export function ConfirmDelete({ what, endpoint, id, onClose, onDone }: { what: string; endpoint: string; id: string; onClose: () => void; onDone: () => void }) {
  const [busy, setBusy] = useState(false);
  const run = async () => {
    setBusy(true);
    try {
      const res = await fetch(`${endpoint}/${id}`, { method: "DELETE" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Delete failed");
      toast.success("Deleted");
      onDone();
      onClose();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50" onMouseDown={onClose}>
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6" onMouseDown={(e) => e.stopPropagation()}>
        <h3 className="font-black text-slate-800 text-lg">Delete {what}?</h3>
        <p className="text-sm text-slate-500 mt-2">This permanently removes the record and cannot be undone.</p>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 border border-slate-200 rounded-xl py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50">
            Cancel
          </button>
          <button onClick={run} disabled={busy} className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white rounded-xl py-2.5 text-sm font-bold hover:bg-red-700 disabled:opacity-60">
            {busy && <Loader2 size={16} className="animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
