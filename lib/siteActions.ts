"use client";

/**
 * Imperative helpers used by buttons across the site. They work without hooks:
 * UI actions are dispatched as window events and rendered by <ActionsProvider/>.
 */

export type InquiryField = "name" | "email" | "phone" | "message" | "fromDate" | "toDate" | "reference";
export type InquiryOptions = {
  type?: "contact" | "apply" | "subscribe" | "registration" | "leave" | "deactivation" | "password-reset" | "other";
  title?: string;
  description?: string;
  fields?: InquiryField[];
  submitLabel?: string;
  meta?: Record<string, any>;
  /** shown above the form, e.g. what the user is applying for */
  context?: string;
};

const emit = (name: string, detail: any) => {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(name, { detail }));
};

const csvCell = (v: string) => `"${v.replace(/\s+/g, " ").trim().replace(/"/g, '""')}"`;

const download = (name: string, content: string, mime: string) => {
  const blob = new Blob(["﻿" + content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

/** Largest visible table on the page as CSV. Returns false if the page has none. */
export function tableToCsv(filename: string): boolean {
  const tables = Array.from(document.querySelectorAll("table")).filter((t) => (t as HTMLElement).offsetParent !== null);
  if (!tables.length) return false;
  const table = tables.sort((a, b) => b.rows.length - a.rows.length)[0];
  const rows = Array.from(table.rows)
    .filter((r) => (r as HTMLElement).style.display !== "none")
    .map((r) => Array.from(r.cells).map((c) => csvCell(c.innerText)).join(","));
  download(filename.endsWith(".csv") ? filename : `${filename}.csv`, rows.join("\n"), "text/csv");
  return true;
}

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "export";

export const actions = {
  print() {
    window.print();
  },

  /** Export the page table as CSV; pages with no table fall back to the print dialog (save as PDF). */
  exportCsv(name: string) {
    const file = `${slug(name)}-${new Date().toISOString().slice(0, 10)}`;
    if (tableToCsv(file)) emit("sums:toast", { message: "Export downloaded", type: "success" });
    else window.print();
  },

  go(path: string) {
    emit("sums:go", { path });
  },

  external(url: string) {
    window.open(url, "_blank", "noopener,noreferrer");
  },

  mail(address: string, subject = "") {
    window.location.href = `mailto:${address}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;
  },

  tel(number: string) {
    window.location.href = `tel:${number.replace(/\s+/g, "")}`;
  },

  toast(message: string, type: "success" | "error" | "info" = "info") {
    emit("sums:toast", { message, type });
  },

  /**
   * Opens a form dialog and stores the request for admins (/admin/inquiries).
   * Newsletter subscriptions that have an email box next to the button use that email directly.
   */
  inquiry(subject: string, options: InquiryOptions = {}) {
    if (options.type === "subscribe") {
      const clicked = document.activeElement as HTMLElement | null;
      let node: HTMLElement | null = clicked;
      let input: HTMLInputElement | null = null;
      for (let i = 0; node && i < 6 && !input; i++, node = node.parentElement) {
        input = node.querySelector<HTMLInputElement>('input[type="email"], input[placeholder*="mail" i]');
      }
      const email = input?.value.trim() || "";
      if (email && /^\S+@\S+\.\S+$/.test(email)) {
        fetch("/api/inquiries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "subscribe", subject, email, pagePath: location.pathname }),
        })
          .then(async (res) => {
            const json = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(json.error || "Could not subscribe");
            emit("sums:toast", { message: "Subscribed successfully", type: "success" });
            if (input) input.value = "";
          })
          .catch((e) => emit("sums:toast", { message: e.message, type: "error" }));
        return;
      }
    }
    emit("sums:inquiry", { subject, ...options });
  },

  /** Shows the details of the card / table row the button belongs to. */
  details(ev: { currentTarget: EventTarget | null }) {
    emit("sums:details", { el: ev.currentTarget });
  },

  /** Opens a small "filter rows" box that hides non-matching rows of the page table. */
  filter(label = "Filter rows") {
    emit("sums:filter", { label });
  },
};
