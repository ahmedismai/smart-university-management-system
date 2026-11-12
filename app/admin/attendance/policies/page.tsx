"use client";

import { actions } from "@/lib/siteActions";
import React from "react";
import { 
  Settings2, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Info, 
  Bell, 
  ArrowUpRight,
  Globe,
  UserCheck,
  History,
  Lock,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface Policy {
  _id?: string;
  minAttendance: number;
  lateBuffer: number;
  penaltyType: string;
  biometricSync: boolean;
  automation: {
    autoSMS: boolean;
    weeklyReports: boolean;
    thresholdAlerts: boolean;
  };
}

interface Holiday {
  _id: string;
  name: string;
  type: string;
  startDate: string;
  endDate: string;
  status: string;
}

export default function AttendancePolicies() {
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHoliday, setNewHoliday] = useState({
    name: "",
    type: "Religious",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [policyRes, holidaysRes] = await Promise.all([
        fetch("/api/admin/attendance/policies"),
        fetch("/api/admin/attendance/holidays")
      ]);
      
      const policyData = await policyRes.json();
      const holidaysData = await holidaysRes.json();
      
      if (policyData.success) setPolicy(policyData.data);
      if (holidaysData.success) setHolidays(holidaysData.data);
    } catch (error) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyChanges = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/admin/attendance/policies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(policy)
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Policies updated successfully");
      } else {
        toast.error("Failed to update policies");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAutomation = (key: keyof Policy["automation"]) => {
    if (!policy) return;
    setPolicy({
      ...policy,
      automation: {
        ...policy.automation,
        [key]: !policy.automation[key]
      }
    });
  };

  const handleDeleteHoliday = async (id: string) => {
    if (!confirm("Are you sure you want to delete this holiday?")) return;
    try {
      const res = await fetch(`/api/admin/attendance/holidays?id=${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        setHolidays(holidays.filter(h => h._id !== id));
        toast.success("Holiday deleted");
      }
    } catch (error) {
      toast.error("Failed to delete holiday");
    }
  };

  const handleAddHoliday = async () => {
    if (!newHoliday.name || !newHoliday.startDate || !newHoliday.endDate) {
      return toast.error("Please fill all fields");
    }
    try {
      setSaving(true);
      const res = await fetch("/api/admin/attendance/holidays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newHoliday)
      });
      const result = await res.json();
      if (result.success) {
        setHolidays([...holidays, result.data].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()));
        setShowAddModal(false);
        setNewHoliday({ name: "", type: "Religious", startDate: "", endDate: "" });
        toast.success("Holiday added successfully");
      }
    } catch (error) {
      toast.error("Failed to add holiday");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="font-bold text-sm animate-pulse uppercase tracking-widest">Loading Policies...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Attendance Policies</h1>
          <p className="text-slate-500">Configure global attendance rules, thresholds and holiday schedules.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleApplyChanges}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Apply Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Policy Configuration */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Settings2 size={18} className="text-primary" />
                  Global Attendance Rules
                </h3>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded">Active</span>
             </div>
             <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                   <div>
                      <label className="text-xs font-bold text-slate-600 block mb-2 flex items-center gap-2">
                         Minimum Attendance (%)
                         <Info size={14} className="text-slate-300" />
                      </label>
                      <input 
                        type="number" 
                        value={policy?.minAttendance} 
                        onChange={(e) => setPolicy(prev => prev ? {...prev, minAttendance: parseInt(e.target.value)} : null)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20" 
                      />
                      <p className="text-[10px] text-slate-400 mt-2">Students below this threshold will be flagged as defaulters.</p>
                   </div>
                   <div>
                      <label className="text-xs font-bold text-slate-600 block mb-2">Late Entrance Buffer (Min)</label>
                      <div className="flex items-center gap-3">
                        <input 
                          type="number" 
                          value={policy?.lateBuffer} 
                          onChange={(e) => setPolicy(prev => prev ? {...prev, lateBuffer: parseInt(e.target.value)} : null)}
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20" 
                        />
                        <span className="text-xs font-bold text-slate-400">Minutes</span>
                      </div>
                   </div>
                </div>
                <div className="space-y-6">
                   <div>
                      <label className="text-xs font-bold text-slate-600 block mb-2">Penalty for Absence</label>
                      <select 
                        value={policy?.penaltyType}
                        onChange={(e) => setPolicy(prev => prev ? {...prev, penaltyType: e.target.value} : null)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option>Deduct Marks (Automatic)</option>
                        <option>Fine Assignment (Daily)</option>
                        <option>Manual Review Only</option>
                      </select>
                   </div>
                   <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10">
                      <div>
                        <p className="text-xs font-bold text-primary">Biometric Sync</p>
                        <p className="text-[10px] text-slate-500">Auto-sync gate entries daily</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={policy?.biometricSync} 
                          onChange={() => setPolicy(prev => prev ? {...prev, biometricSync: !prev.biometricSync} : null)}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                   </div>
                </div>
             </div>
          </div>

          {/* Holiday Calendar */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Calendar size={18} className="text-primary" />
                  Holiday Calendar {new Date().getFullYear()}
                </h3>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-1 text-xs font-bold text-primary hover:underline cursor-pointer"
                >
                  <Plus size={14} />
                  Add Holiday
                </button>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                    <tr>
                      <th className="px-6 py-4">Holiday Name</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Duration</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {holidays.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">No holidays scheduled</td>
                      </tr>
                    ) : holidays.map((h) => (
                      <tr key={h._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                           <span className="text-sm font-bold text-slate-800">{h.name}</span>
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-slate-500">{h.type}</td>
                        <td className="px-6 py-4">
                           <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-slate-700">{new Date(h.startDate).toLocaleDateString()}</span>
                              {h.startDate !== h.endDate && <span className="text-[10px] text-slate-400">to {new Date(h.endDate).toLocaleDateString()}</span>}
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                             h.status === 'Upcoming' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                           }`}>
                             {h.status}
                           </span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex gap-2">
                              <button onClick={(e) => actions.details(e)} className="p-1.5 text-slate-400 hover:text-amber-600 cursor-pointer"><Edit3 size={14} /></button>
                              <button 
                                onClick={() => handleDeleteHoliday(h._id)}
                                className="p-1.5 text-slate-400 hover:text-red-600 cursor-pointer"
                              >
                                <Trash2 size={14} />
                              </button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
             <div className="relative z-10">
                <Bell size={32} className="text-secondary mb-6" />
                <h3 className="text-xl font-bold mb-4">Automation Hub</h3>
                <div className="space-y-4 mb-8">
                   {[
                     { label: "Auto-SMS on Absence", key: "autoSMS" as const },
                     { label: "Weekly Admin Reports", key: "weeklyReports" as const },
                     { label: "Student Threshold Alerts", key: "thresholdAlerts" as const },
                   ].map((item, i) => (
                     <div key={i} className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-300">{item.label}</span>
                        <button 
                          onClick={() => handleToggleAutomation(item.key)}
                          className={`w-8 h-4 rounded-full relative transition-colors cursor-pointer ${policy?.automation[item.key] ? 'bg-secondary' : 'bg-slate-700'}`}
                        >
                           <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${policy?.automation[item.key] ? 'right-0.5' : 'left-0.5'}`} />
                        </button>
                     </div>
                   ))}
                </div>
                <button onClick={() => actions.go("/admin/settings")} className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-bold transition-all border border-white/10 flex items-center justify-center gap-2 cursor-pointer">
                  Configure Notifications
                  <ArrowUpRight size={14} />
                </button>
             </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
             <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <ShieldCheck size={18} className="text-primary" />
                Compliance & Rules
             </h3>
             <div className="space-y-4">
                <div className="flex gap-3 items-start">
                   <div className="mt-1 p-1 bg-blue-50 text-blue-600 rounded">
                      <Globe size={14} />
                   </div>
                   <div>
                      <p className="text-xs font-bold text-slate-700">Academic Ordinance 2024</p>
                      <p className="text-[10px] text-slate-500 mt-1">Policies are synced with University regulation § 4.2.</p>
                   </div>
                </div>
                <div className="flex gap-3 items-start">
                   <div className="mt-1 p-1 bg-emerald-50 text-emerald-600 rounded">
                      <UserCheck size={14} />
                   </div>
                   <div>
                      <p className="text-xs font-bold text-slate-700">Biometric Integrity</p>
                      <p className="text-[10px] text-slate-500 mt-1">Manual edits require HOD digital signature.</p>
                   </div>
                </div>
             </div>
             <button onClick={() => actions.inquiry("Request: View Policy History", { type: "contact", title: "View Policy History", description: "Tell us how to reach you and we will send you this information." })} className="w-full mt-6 py-3 bg-slate-50 text-slate-500 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-all cursor-pointer">
                <History size={14} />
                View Policy History
             </button>
          </div>

          <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start gap-3">
             <Lock size={18} className="text-amber-500 mt-0.5" />
             <p className="text-[11px] text-amber-700 font-medium">Only Super Admins can modify Global Attendance Rules. Changes are logged for audit.</p>
          </div>
        </div>
      </div>

      {/* Add Holiday Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Plus size={18} className="text-primary" />
                Add New Holiday
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-all cursor-pointer text-slate-400"
              >
                <Plus size={20} className="rotate-45" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Holiday Name</label>
                <input 
                  type="text" 
                  value={newHoliday.name}
                  onChange={(e) => setNewHoliday({...newHoliday, name: e.target.value})}
                  placeholder="e.g. Eid-ul-Fitr"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Category</label>
                <select 
                  value={newHoliday.type}
                  onChange={(e) => setNewHoliday({...newHoliday, type: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option>Religious</option>
                  <option>National</option>
                  <option>Academic</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Start Date</label>
                  <input 
                    type="date" 
                    value={newHoliday.startDate}
                    onChange={(e) => setNewHoliday({...newHoliday, startDate: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">End Date</label>
                  <input 
                    type="date" 
                    value={newHoliday.endDate}
                    onChange={(e) => setNewHoliday({...newHoliday, endDate: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50/50 flex gap-3">
              <button 
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddHoliday}
                disabled={saving}
                className="flex-1 py-3 bg-primary text-white font-bold rounded-xl text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {saving && <Loader2 size={16} className="animate-spin" />}
                Add Holiday
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
