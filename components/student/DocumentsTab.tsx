"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { FileText, Download, Trash2, Upload, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { formatSize } from "@/lib/lectureFiles";

type Doc = { id: string; fileName: string; size: number; createdAt: string };

export function DocumentsTab() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/student/documents");
    const json = await res.json();
    if (res.ok) setDocs(json.documents);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const upload = async (file: File) => {
    setUploading(true);
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/student/documents", { method: "POST", body });
    const json = await res.json();
    setUploading(false);
    if (!res.ok) return toast.error(json.error || "Upload failed");
    toast.success("Document uploaded");
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this document?")) return;
    const res = await fetch(`/api/student/documents/${id}`, { method: "DELETE" });
    if (res.ok) {
      setDocs((d) => d.filter((x) => x.id !== id));
      toast.success("Deleted");
    } else toast.error("Delete failed");
  };

  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-6 gap-4">
        <h3 className="text-lg font-bold text-gray-900">My Documents</h3>
        <div>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
              e.target.value = "";
            }}
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:opacity-90 disabled:opacity-60"
          >
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            Upload document
          </button>
        </div>
      </div>
      <p className="text-xs text-gray-400 mb-4">PDF, DOC, DOCX, JPG or PNG, up to 4 MB each. Only you can see these files.</p>
      {loading ? (
        <p className="text-gray-400 text-sm">Loading...</p>
      ) : (
        <div className="space-y-4">
          {docs.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-gray-400 shrink-0">
                  <FileText size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{doc.fileName}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    {formatSize(doc.size)} • {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <a href={`/api/student/documents/${doc.id}`} className="p-2 text-gray-400 hover:text-primary" title="Download">
                  <Download size={18} />
                </a>
                <button onClick={() => remove(doc.id)} className="p-2 text-gray-400 hover:text-red-500" title="Delete">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {docs.length === 0 && <p className="text-gray-400 text-sm py-6 text-center">No documents yet. Upload your first one.</p>}
        </div>
      )}
    </div>
  );
}
