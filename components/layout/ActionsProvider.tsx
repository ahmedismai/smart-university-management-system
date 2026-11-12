"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { X, Loader2, Search, Copy } from "lucide-react";
import type { InquiryField, InquiryOptions } from "@/lib/siteActions";

type InquiryState = InquiryOptions & { subject: string };

const DEFAULT_FIELDS: Record<string, InquiryField[]> = {
  contact: ["name", "email", "phone", "message"],
  apply: ["name", "email", "phone", "message"],
  registration: ["name", "email", "phone", "message"],
  subscribe: ["email"],
  leave: ["fromDate", "toDate", "message"],
  deactivation: ["message"],
  "password-reset": ["reference", "email", "message"],
  other: ["name", "email", "message"],
};

const LABELS: Record<InquiryField, string> = {
  name: "Full name",
  email: "Email",
  phone: "Phone (optional)",
  message: "Message",
  fromDate: "From date",
  toDate: "To date",
  reference: "Student / Employee ID",
};

const inputCls =
  "w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 bg-white outline-none focus:border-[#0F2E5D] focus:ring-2 focus:ring-[#0F2E5D]/10";

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl">
          <h3 className="font-black text-[#0F2E5D] text-lg">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function InquiryDialog({ state, onClose }: { state: InquiryState; onClose: () => void }) {
  const pathname = usePathname();
  const type = state.type || "contact";
  const fields = state.fields || DEFAULT_FIELDS[type] || DEFAULT_FIELDS.contact;
  const [values, setValues] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((me) => {
        if (me?.role)
          setValues((v) => ({ name: me.name || "", email: me.email || "", reference: me.id || "", ...v }));
      })
      .catch(() => {});
  }, []);

  const set = (k: string, v: string) => setValues((s) => ({ ...s, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { fromDate, toDate, reference, ...rest } = values;
    const meta: Record<string, any> = { ...(state.meta || {}) };
    if (fromDate) meta.fromDate = fromDate;
    if (toDate) meta.toDate = toDate;
    if (reference) meta.userId = reference;
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, subject: state.subject, ...rest, meta, pagePath: pathname }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to send");
      toast.success(type === "subscribe" ? "Subscribed successfully" : "Your request was sent. We will get back to you soon.");
      onClose();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal title={state.title || state.subject} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        {state.description && <p className="text-sm text-gray-500">{state.description}</p>}
        {state.context && <p className="text-xs font-bold text-[#0F2E5D] bg-[#0F2E5D]/5 rounded-xl px-4 py-2">{state.context}</p>}
        {fields.map((f) => (
          <label key={f} className="block">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{LABELS[f]}</span>
            {f === "message" ? (
              <textarea
                rows={4}
                value={values[f] || ""}
                onChange={(e) => set(f, e.target.value)}
                className={`${inputCls} mt-1`}
                placeholder="Write your message..."
              />
            ) : (
              <input
                type={f === "email" ? "email" : f === "fromDate" || f === "toDate" ? "date" : f === "phone" ? "tel" : "text"}
                required={f === "email" || f === "name" || f === "fromDate" || f === "toDate"}
                value={values[f] || ""}
                onChange={(e) => set(f, e.target.value)}
                className={`${inputCls} mt-1`}
              />
            )}
          </label>
        ))}
        <button
          disabled={busy}
          className="w-full flex items-center justify-center gap-2 bg-[#0F2E5D] text-white font-bold rounded-xl py-3 disabled:opacity-60 hover:opacity-90"
        >
          {busy && <Loader2 size={16} className="animate-spin" />}
          {state.submitLabel || (type === "subscribe" ? "Subscribe" : "Send")}
        </button>
      </form>
    </Modal>
  );
}

/** Walks up from the clicked element to the card / table row it belongs to and describes it. */
function describe(el: HTMLElement): { title: string; rows: [string, string][]; text: string } {
  const tr = el.closest("tr");
  if (tr) {
    const table = tr.closest("table");
    const heads = table ? Array.from(table.querySelectorAll("thead th")).map((h) => (h as HTMLElement).innerText.trim()) : [];
    const cells = Array.from(tr.querySelectorAll("td")).map((c) => (c as HTMLElement).innerText.replace(/\s+/g, " ").trim());
    const rows = cells.map((c, i) => [heads[i] || `Column ${i + 1}`, c] as [string, string]).filter(([k, v]) => v && k.toLowerCase() !== "actions");
    return { title: rows[1]?.[1] || rows[0]?.[1] || "Details", rows, text: rows.map((r) => r.join(": ")).join("\n") };
  }
  let node: HTMLElement | null = el.parentElement;
  let best: HTMLElement | null = null;
  while (node && node !== document.body) {
    const len = node.innerText?.trim().length || 0;
    if (len > 80) {
      best = node;
      break;
    }
    node = node.parentElement;
  }
  best = best || el;
  const heading = best.querySelector("h1,h2,h3,h4") as HTMLElement | null;
  const text = best.innerText.trim().replace(/\n{3,}/g, "\n\n").slice(0, 3000);
  return { title: heading?.innerText.trim() || "Details", rows: [], text };
}

function DetailsDialog({ el, onClose }: { el: HTMLElement; onClose: () => void }) {
  const info = describe(el);
  return (
    <Modal title={info.title} onClose={onClose}>
      {info.rows.length > 0 ? (
        <dl className="divide-y divide-gray-100">
          {info.rows.map(([k, v], i) => (
            <div key={i} className="py-2.5 flex gap-4 text-sm">
              <dt className="w-32 shrink-0 font-bold text-gray-400 uppercase text-[11px] tracking-wider pt-0.5">{k}</dt>
              <dd className="text-gray-900 font-medium break-words">{v}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{info.text}</p>
      )}
      <button
        onClick={() => {
          navigator.clipboard?.writeText(info.text).then(() => toast.success("Copied"));
        }}
        className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[#0F2E5D] hover:underline"
      >
        <Copy size={14} /> Copy details
      </button>
    </Modal>
  );
}

/** The rows the filter applies to: table body rows, or the biggest group of similar sibling cards. */
function filterTargets(): HTMLElement[] {
  const tables = Array.from(document.querySelectorAll("table")).filter((t) => (t as HTMLElement).offsetParent !== null);
  if (tables.length) {
    const t = tables.sort((a, b) => b.rows.length - a.rows.length)[0];
    return Array.from(t.querySelectorAll("tbody tr")) as HTMLElement[];
  }
  let best: HTMLElement[] = [];
  document.querySelectorAll("main *, body > div *").forEach((p) => {
    const kids = Array.from(p.children) as HTMLElement[];
    if (kids.length < 3 || p.closest("nav,aside,header,footer")) return;
    const cls = kids[0].className;
    const same = kids.filter((k) => k.tagName === kids[0].tagName && k.className === cls && (k.innerText || "").trim().length > 10);
    if (same.length >= 3 && same.length > best.length) best = same;
  });
  return best;
}

function FilterDialog({ label, onClose }: { label: string; onClose: () => void }) {
  const [q, setQ] = useState("");
  const targets = useRef<HTMLElement[]>([]);
  const [counts, setCounts] = useState({ shown: 0, total: 0 });
  useEffect(() => {
    targets.current = filterTargets();
    setCounts({ shown: targets.current.length, total: targets.current.length });
  }, []);
  const apply = (value: string) => {
    setQ(value);
    const needle = value.trim().toLowerCase();
    let shown = 0;
    targets.current.forEach((r) => {
      const match = !needle || (r.innerText || "").toLowerCase().includes(needle);
      r.style.display = match ? "" : "none";
      if (match) shown++;
    });
    setCounts({ shown, total: targets.current.length });
  };
  return (
    <Modal title={label} onClose={onClose}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input autoFocus value={q} onChange={(e) => apply(e.target.value)} placeholder="Type to filter..." className={`${inputCls} pl-10`} />
      </div>
      <p className="text-xs text-gray-400 mt-3">
        {counts.total ? `${counts.shown} of ${counts.total} items shown` : "Nothing to filter on this page."}
      </p>
      <div className="flex gap-3 mt-5">
        <button onClick={() => apply("")} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50">
          Clear
        </button>
        <button onClick={onClose} className="flex-1 bg-[#0F2E5D] text-white rounded-xl py-2.5 text-sm font-bold hover:opacity-90">
          Done
        </button>
      </div>
    </Modal>
  );
}

export default function ActionsProvider() {
  const router = useRouter();
  const pathname = usePathname();
  const [inquiry, setInquiry] = useState<InquiryState | null>(null);
  const [details, setDetails] = useState<HTMLElement | null>(null);
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    setInquiry(null);
    setDetails(null);
    setFilter(null);
  }, [pathname]);

  useEffect(() => {
    const on = (name: string, fn: (d: any) => void) => {
      const h = (e: Event) => fn((e as CustomEvent).detail);
      window.addEventListener(name, h);
      return () => window.removeEventListener(name, h);
    };
    const offs = [
      on("sums:go", (d) => router.push(d.path)),
      on("sums:toast", (d) => (d.type === "success" ? toast.success(d.message) : d.type === "error" ? toast.error(d.message) : toast(d.message))),
      on("sums:inquiry", (d) => setInquiry(d)),
      on("sums:details", (d) => d.el && setDetails(d.el)),
      on("sums:filter", (d) => setFilter(d.label || "Filter rows")),
    ];
    return () => offs.forEach((f) => f());
  }, [router]);

  return (
    <>
      {inquiry && <InquiryDialog state={inquiry} onClose={() => setInquiry(null)} />}
      {details && <DetailsDialog el={details} onClose={() => setDetails(null)} />}
      {filter !== null && <FilterDialog label={filter} onClose={() => setFilter(null)} />}
    </>
  );
}
