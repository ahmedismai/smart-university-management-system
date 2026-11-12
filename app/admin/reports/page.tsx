"use client";

import React, { useState } from "react";
import useSWR from "swr";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import * as LucideIcons from "lucide-react";
import {
  Download,
  FileText,
  Share2,
  Plus,
  Edit3,
  Trash2,
  X,
  Loader2,
  ArrowRight
} from "lucide-react";

// Fetcher for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// List of icons available for reports
const ICON_OPTIONS = [
  { label: "Bar Chart", value: "BarChart3" },
  { label: "Pie Chart", value: "PieChart" },
  { label: "Line Chart", value: "LineChart" },
  { label: "File Text", value: "FileText" },
  { label: "Trending Up", value: "TrendingUp" },
  { label: "Activity", value: "Activity" },
  { label: "Dollar Sign", value: "DollarSign" },
  { label: "Clipboard List", value: "ClipboardList" }
];

export default function Reports() {
  const router = useRouter();
  const { data: reports = [], error, isLoading, mutate } = useSWR("/api/admin/reports", fetcher);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    desc: "",
    icon: "BarChart3"
  });

  // Dynamic Icon Renderer
  const renderIcon = (iconName: string, size = 24) => {
    const IconComponent = (LucideIcons as any)[iconName] || FileText;
    return <IconComponent size={size} />;
  };

  // Open modal for creating a new report
  const openCreateModal = () => {
    setFormData({ name: "", desc: "", icon: "BarChart3" });
    setEditId(null);
    setIsModalOpen(true);
  };

  // Open modal for editing an existing report
  const openEditModal = (report: any) => {
    setFormData({
      name: report.name,
      desc: report.desc,
      icon: report.icon || "BarChart3"
    });
    setEditId(report._id);
    setIsModalOpen(true);
  };

  // Handle Form Submission (Create or Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.desc.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const url = editId ? `/api/admin/reports/${editId}` : "/api/admin/reports";
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success(editId ? "Report updated successfully" : "Report created successfully");
        mutate();
        setIsModalOpen(false);
        setFormData({ name: "", desc: "", icon: "BarChart3" });
        setEditId(null);
      } else {
        const errData = await res.json();
        toast.error(errData.error || "Failed to save report.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Report Deletion
  const handleDelete = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete "${name}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0ea5e9", // primary color matched
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/admin/reports/${id}`, {
          method: "DELETE"
        });

        if (res.ok) {
          mutate();
          Swal.fire({
            title: "Deleted!",
            text: "The report template has been deleted successfully.",
            icon: "success",
            confirmButtonColor: "#0ea5e9"
          });
        } else {
          toast.error("Failed to delete the report.");
        }
      } catch (err) {
        console.error(err);
        toast.error("An error occurred during deletion.");
      }
    }
  };

  // Handle Report Generation Flow
  const handleGenerate = (report: any) => {
    const name = report.name.toLowerCase();

    // Smart route mapping for standard reports
    if (name.includes("attendance")) {
      router.push("/admin/attendance/reports");
    } else if (name.includes("academic") || name.includes("performance") || name.includes("gpa")) {
      router.push("/admin/marks/report-cards");
    } else if (name.includes("financial") || name.includes("revenue") || name.includes("collection")) {
      router.push("/admin/financial/reports");
    } else if (name.includes("inventory") || name.includes("asset")) {
      router.push("/admin/inventory");
    } else {
      // Simulate dynamic custom report generation
      setIsGenerating(report._id);
      setTimeout(() => {
        setIsGenerating(null);
        Swal.fire({
          title: "Report Generated!",
          text: `Detailed report for "${report.name}" has been compiled and is ready for export.`,
          icon: "success",
          confirmButtonColor: "#0ea5e9"
        });
      }, 2000);
    }
  };

  // Handle Static Export (Download PDF / CSV)
  const handleExport = (reportName: string, format: "PDF" | "CSV") => {
    toast.success(`Exporting "${reportName}" as ${format}...`);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Reports & Analytics</h1>
          <p className="text-slate-500">Generate and export detailed institutional reports.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/95 transition-all shadow-md shadow-primary/10 hover:shadow-lg cursor-pointer hover:-translate-y-0.5"
        >
          <Plus size={18} />
          Create New Report
        </button>
      </div>

      {/* Reports Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-slate-500 font-medium">Loading reports dashboard...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 p-8 rounded-2xl text-center text-red-700">
          Failed to load reports. Please check your database connection.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report: any, i: number) => (
            <motion.div
              key={report._id || i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-primary/10 p-3 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    {renderIcon(report.icon)}
                  </div>
                  <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditModal(report)}
                      className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit Template"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(report._id, report.name)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Template"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="w-[1px] bg-slate-100 mx-1 self-stretch" />
                    <button
                      onClick={() => handleExport(report.name, "PDF")}
                      className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors cursor-pointer"
                      title="Download PDF"
                    >
                      <FileText size={16} />
                    </button>
                    <button
                      onClick={() => handleExport(report.name, "CSV")}
                      className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors cursor-pointer"
                      title="Export CSV"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-1">{report.name}</h3>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">{report.desc}</p>
              </div>
              <button
                onClick={() => handleGenerate(report)}
                disabled={isGenerating === report._id}
                className="w-full py-2.5 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold group-hover:bg-primary group-hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2 hover:shadow-inner disabled:opacity-75"
              >
                {isGenerating === report._id ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Compiling Data...
                  </>
                ) : (
                  <>
                    Generate Detailed Report
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </>
                )}
              </button>
            </motion.div>
          ))}
          {reports.length === 0 && (
            <div className="col-span-full py-16 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3">
              <p className="text-slate-500 font-bold text-sm">No report templates defined yet.</p>
              <button
                onClick={openCreateModal}
                className="text-xs text-primary font-bold hover:underline cursor-pointer"
              >
                Create the first report template
              </button>
            </div>
          )}
        </div>
      )}

      {/* Custom Report Builder Banner */}
      <div className="bg-slate-800 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative shadow-lg">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Custom Report Builder</h2>
          <p className="text-slate-400 max-w-md leading-relaxed">
            Need a specific data set? Use our custom builder to filter exactly what you need and export in your preferred format.
          </p>
          <button
            onClick={() => toast.success("Opening Custom Report Builder...")}
            className="mt-6 px-6 py-3 bg-secondary text-primary font-extrabold rounded-xl hover:bg-white transition-all cursor-pointer shadow-md hover:-translate-y-0.5 active:translate-y-0"
          >
            Open Builder
          </button>
        </div>
        <div className="relative z-10 hidden md:block opacity-20 hover:opacity-35 transition-opacity">
          <Share2 size={120} />
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      </div>

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="bg-primary/10 p-2 rounded-lg text-primary">
                    {editId ? <Edit3 size={18} /> : <Plus size={18} />}
                  </span>
                  {editId ? "Edit Report Template" : "Add Report Template"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-full border border-slate-100 shadow-sm cursor-pointer hover:shadow"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">
                    Report Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="e.g. Attendance Summary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.desc}
                    onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                    placeholder="Provide a brief explanation of what data this report analyzes."
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">
                    Display Icon *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer appearance-none col-span-1"
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <div className="border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-center text-primary col-span-1 py-2">
                      <div className="flex items-center gap-2">
                        {renderIcon(formData.icon, 20)}
                        <span className="text-xs font-bold text-slate-600">Preview</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-500 font-bold rounded-xl text-sm hover:bg-slate-50 hover:text-slate-700 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/95 transition-all shadow-md shadow-primary/10 hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                  >
                    {isSubmitting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : editId ? (
                      "Save Changes"
                    ) : (
                      "Create Report"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
