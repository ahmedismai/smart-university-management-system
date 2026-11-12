"use client";

import { actions } from "@/lib/siteActions";
import React, { useState, useEffect } from "react";
import { 
  Award, 
  Settings2, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Info, 
  Percent, 
  Calculator, 
  ShieldCheck, 
  ArrowUpRight,
  History,
  Lock,
  Target,
  Loader2,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

export default function GradeManagement() {
  const [gradingScale, setGradingScale] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedTier, setSelectedTier] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    grade: "",
    min: 0,
    max: 100,
    point: 0.00,
    remarks: ""
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/marks/grades");
      const data = await res.json();
      if (Array.isArray(data)) {
        setGradingScale(data);
      }
    } catch (error) {
      console.error("Error fetching grades:", error);
      toast.error("Failed to load grading scale");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (mode: "add" | "edit", tier: any = null) => {
    setModalMode(mode);
    setSelectedTier(tier);
    if (tier && mode === "edit") {
      setFormData({
        grade: tier.grade,
        min: tier.min,
        max: tier.max,
        point: tier.point,
        remarks: tier.remarks || ""
      });
    } else {
      setFormData({
        grade: "",
        min: 0,
        max: 100,
        point: 0.00,
        remarks: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const method = modalMode === "edit" ? "PUT" : "POST";
      const body = modalMode === "edit" ? { ...formData, _id: selectedTier._id } : formData;
      
      const res = await fetch("/api/admin/marks/grades", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(`Grade ${modalMode === "edit" ? "updated" : "added"} successfully`);
        setIsModalOpen(false);
        fetchData();
      } else {
        const data = await res.json();
        toast.error(data.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this grading tier?")) return;
    
    try {
      const res = await fetch(`/api/admin/marks/grades?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Tier deleted successfully");
        fetchData();
      } else {
        toast.error("Failed to delete tier");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Grade Management</h1>
          <p className="text-slate-500">Configure university grading scales, GPA rules and passing criteria.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => openModal("add")} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer">
            <Plus size={18} />
            Add Grade Tier
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Grading Scale Table */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                   <Award size={18} className="text-primary" />
                   Grading Scale (UGC Standard)
                </h3>
                <button 
                  onClick={() => openModal("add")}
                  className="flex items-center gap-1 text-xs font-bold text-primary hover:underline cursor-pointer"
                >
                   <Plus size={14} />
                   Add Tier
                </button>
             </div>
             {loading ? (
               <div className="flex items-center justify-center py-20">
                 <Loader2 className="w-8 h-8 text-primary animate-spin" />
               </div>
             ) : (
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                      <tr>
                        <th className="px-6 py-4">Letter Grade</th>
                        <th className="px-6 py-4">Percentage Range</th>
                        <th className="px-6 py-4">Grade Point</th>
                        <th className="px-6 py-4">Remarks</th>
                        <th className="px-6 py-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {gradingScale.length > 0 ? gradingScale.map((item, i) => (
                        <motion.tr 
                          key={item._id || i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="px-6 py-4">
                             <span className={`text-sm font-bold px-3 py-1 rounded-lg ${
                               item.grade === 'F' ? 'bg-red-50 text-red-600' : 'bg-primary/5 text-primary'
                             }`}>{item.grade}</span>
                          </td>
                          <td className="px-6 py-4">
                             <span className="text-xs font-bold text-slate-700">{item.min}% - {item.max}%</span>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-slate-800">
                             {Number(item.point).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-xs font-medium text-slate-500">{item.remarks}</td>
                          <td className="px-6 py-4">
                             <div className="flex items-center justify-center gap-2">
                                <button 
                                  onClick={() => openModal("edit", item)}
                                  className="p-1.5 text-slate-400 hover:text-amber-600 cursor-pointer"
                                >
                                  <Edit3 size={14} />
                                </button>
                                <button 
                                  onClick={() => handleDelete(item._id)}
                                  className="p-1.5 text-slate-400 hover:text-red-600 cursor-pointer"
                                >
                                  <Trash2 size={14} />
                                </button>
                             </div>
                          </td>
                        </motion.tr>
                      )) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm">No grading scale defined.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
               </div>
             )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                   <Target size={18} className="text-primary" />
                   Passing Criteria
                </h4>
                <div className="space-y-4">
                   <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Min. Passing Mark (%)</label>
                      <input type="number" defaultValue={40} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20" />
                   </div>
                   <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <span className="text-xs font-medium text-slate-600">Must pass Mid-Term & Final separately?</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                   </div>
                </div>
             </div>
             <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                   <Calculator size={18} className="text-primary" />
                   GPA Scaling
                </h4>
                <div className="space-y-4">
                   <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Maximum GPA Point</label>
                      <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20">
                        <option>4.00 Scale (University Standard)</option>
                        <option>5.00 Scale (National Standard)</option>
                      </select>
                   </div>
                   <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <span className="text-xs font-medium text-slate-600">Round GPA to 2 decimal places?</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Sidebar Configuration */}
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
             <div className="relative z-10">
                <Settings2 size={32} className="text-secondary mb-6" />
                <h3 className="text-xl font-bold mb-4">Auto-Grading</h3>
                <p className="text-sm text-slate-400 mb-6">Automatically convert marks to letter grades and points based on defined scales during result processing.</p>
                <div className="flex items-center gap-3 mb-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Automation Active</span>
                </div>
                <button onClick={() => actions.go("/admin/settings")} className="w-full py-4 bg-secondary text-primary font-extrabold rounded-2xl hover:bg-white transition-all cursor-pointer flex items-center justify-center gap-2">
                   System Settings
                   <ArrowUpRight size={14} />
                </button>
             </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
             <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <ShieldCheck size={18} className="text-primary" />
                University Compliance
             </h3>
             <div className="space-y-4">
                <div className="flex gap-3 items-start p-3 rounded-xl bg-slate-50 border border-slate-100">
                   <Lock size={16} className="text-amber-500 mt-1" />
                   <p className="text-[11px] text-slate-600 leading-relaxed font-medium">Grading changes are locked for the current semester (Summer 2026). Modifications require Academic Council approval.</p>
                </div>
                
             </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-start gap-3">
             <Info size={18} className="text-blue-500 mt-0.5" />
             <p className="text-[11px] text-blue-700 font-medium">This scale follows the University Grants Commission (UGC) standardized grading system for higher education.</p>
          </div>
        </div>
      </div>

      {/* CRUD Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <form onSubmit={handleSubmit} className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-slate-800">
                    {modalMode === "add" ? "Add New Tier" : "Edit Grading Tier"}
                  </h2>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                    <X size={20} className="text-slate-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Letter Grade</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. A+"
                      value={formData.grade}
                      onChange={(e) => setFormData({...formData, grade: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Min %</label>
                      <input 
                        type="number" 
                        required
                        value={formData.min}
                        onChange={(e) => setFormData({...formData, min: parseInt(e.target.value)})}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Max %</label>
                      <input 
                        type="number" 
                        required
                        value={formData.max}
                        onChange={(e) => setFormData({...formData, max: parseInt(e.target.value)})}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Grade Point</label>
                    <input 
                      type="number" 
                      step="0.01"
                      required
                      value={formData.point}
                      onChange={(e) => setFormData({...formData, point: parseFloat(e.target.value)})}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Remarks</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Excellent"
                      value={formData.remarks}
                      onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full mt-8 py-4 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  {modalMode === "add" ? "Create Tier" : "Update Tier"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
