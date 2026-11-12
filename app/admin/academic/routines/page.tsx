"use client";

import { actions } from "@/lib/siteActions";
import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Plus, 
  Search, 
  Clock, 
  MapPin, 
  User, 
  Filter, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  MoreVertical,
  Printer,
  Copy,
  LayoutGrid,
  Sparkles,
  Edit3,
  Trash2,
  Eye,
  X,
  Loader2,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const timeSlots = [
  "08:30 AM", "09:45 AM", "11:00 AM", "12:15 PM", "01:30 PM", "02:45 PM", "04:00 PM"
];

const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function RoutineManagement() {
  const [routinesList, setRoutinesList] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState("Saturday");
  const [dept, setDept] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view" | "delete">("add");
  const [selectedRoutine, setSelectedRoutine] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    day: "Saturday",
    startTime: "08:30 AM",
    endTime: "09:45 AM",
    courseId: "",
    sectionId: "",
    teacherId: "",
    room: "",
    type: "Lecture"
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [routinesRes, coursesRes, sectionsRes, teachersRes] = await Promise.all([
        fetch("/api/admin/routines"),
        fetch("/api/admin/courses"),
        fetch("/api/admin/sections"),
        fetch("/api/admin/teachers")
      ]);

      const [routinesData, coursesData, sectionsData, teachersData] = await Promise.all([
        routinesRes.json(),
        coursesRes.json(),
        sectionsRes.json(),
        teachersRes.json()
      ]);

      const loaded = Array.isArray(routinesData) ? routinesData : [];
      setRoutinesList(loaded);
      setActiveDay((current) => (loaded.some((r: any) => r.day === current) ? current : days.find((d) => loaded.some((r: any) => r.day === d)) || current));
      setCourses(Array.isArray(coursesData) ? coursesData : []);
      setSections(Array.isArray(sectionsData) ? sectionsData : []);
      setTeachers(Array.isArray(teachersData) ? teachersData : []);
    } catch (error) {
      console.error("Error fetching routine data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setFormData({
      day: activeDay,
      startTime: "08:30 AM",
      endTime: "09:45 AM",
      courseId: "",
      sectionId: "",
      teacherId: "",
      room: "",
      type: "Lecture"
    });
    setSelectedRoutine(null);
  };

  const openModal = (mode: "add" | "edit" | "view" | "delete", routine: any = null) => {
    setModalMode(mode);
    setSelectedRoutine(routine);
    if (routine && mode !== "add") {
      setFormData({
        day: routine.day,
        startTime: routine.startTime,
        endTime: routine.endTime,
        courseId: routine.courseId?._id || routine.courseId || "",
        sectionId: routine.sectionId?._id || routine.sectionId || "",
        teacherId: routine.teacherId?._id || routine.teacherId || "",
        room: routine.room,
        type: routine.type || "Lecture"
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = modalMode === "edit" ? `/api/admin/routines/${selectedRoutine._id}` : "/api/admin/routines";
      const method = modalMode === "edit" ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsModalOpen(false);
        resetForm();
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || `Failed to ${modalMode} routine`);
      }
    } catch (error) {
      console.error(`Error ${modalMode}ing routine:`, error);
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedRoutine) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/routines/${selectedRoutine._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete routine");
      }
    } catch (error) {
      console.error("Error deleting routine:", error);
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toMinutes = (t: string) => {
    const m = /(\d{1,2}):(\d{2})\s*(AM|PM)?/i.exec(t || "");
    if (!m) return 0;
    let h = parseInt(m[1], 10) % 12 === parseInt(m[1], 10) && !m[3] ? parseInt(m[1], 10) : parseInt(m[1], 10);
    if (m[3]) h = (h % 12) + (m[3].toUpperCase() === "PM" ? 12 : 0);
    return h * 60 + parseInt(m[2], 10);
  };
  const deptCodes = Array.from(new Set(routinesList.map((r) => r.sectionId?.classId?.code).filter(Boolean))) as string[];
  const dayRoutines = routinesList.filter((r) => r.day === activeDay && (dept === "All" || r.sectionId?.classId?.code === dept));
  const rowTimes = Array.from(new Set([...timeSlots, ...dayRoutines.map((r) => r.startTime)])).sort((a, b) => toMinutes(a) - toMinutes(b));

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Class Routines</h1>
          <p className="text-slate-500">Master timetable management and faculty scheduling.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => actions.print()} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer shadow-sm">
            <Printer size={18} />
            Print Routine
          </button>
          <button 
            onClick={() => openModal("add")}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer"
          >
            <Plus size={18} />
            Add Schedule
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Filter size={18} className="text-primary" />
              Filter Schedule
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Select Department</label>
                <select value={dept} onChange={(e) => setDept(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="All">All Departments</option>
                  {deptCodes.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
          </div>

          <div className="bg-primary p-6 rounded-2xl text-white shadow-xl shadow-primary/20">
             <div className="flex justify-between items-start mb-4">
                <Sparkles size={32} className="text-secondary" />
                <span className="bg-white/10 px-2 py-1 rounded text-[10px] font-bold uppercase">Beta</span>
             </div>
             <h4 className="font-bold mb-2 text-lg">Auto-Schedule AI</h4>
             <p className="text-xs text-white/60 mb-4 leading-relaxed">Let our AI engine generate an optimized, conflict-free routine based on faculty availability and room constraints.</p>
             <button onClick={() => actions.go("/admin/academic/routines")} className="w-full py-3 bg-white text-primary font-bold rounded-xl text-xs hover:bg-secondary transition-all cursor-pointer">
              Try Smart Scheduler
             </button>
          </div>
        </div>

        {/* Main Timetable Area */}
        <div className="xl:col-span-3 space-y-6">
           {/* Day Selector */}
           <div className="flex items-center justify-between bg-white p-2 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
              {days.map(day => (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`px-6 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                    activeDay === day 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-primary'
                  }`}
                >
                  {day}
                </button>
              ))}
           </div>

           {/* Routine Grid */}
           <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[600px]">
              {loading ? (
                <div className="flex items-center justify-center h-[600px]">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 divide-y divide-slate-100">
                  {rowTimes.map((time, idx) => {
                    const items = dayRoutines.filter((r) => r.startTime === time);
                    return (
                      <div key={idx} className="flex group min-h-[100px] hover:bg-slate-50/30 transition-colors">
                        <div className="w-32 flex flex-col items-center justify-center border-r border-slate-50 bg-slate-50/20 group-hover:bg-primary group-hover:text-white transition-all">
                          <Clock size={16} className="mb-1 opacity-50 group-hover:opacity-100" />
                          <span className="text-[11px] font-bold uppercase tracking-tighter">{time}</span>
                        </div>
                        <div className="flex-1 p-6 relative">
                          {items.length ? (
                            <div className="space-y-3">
                            {items.map((classItem) => (
                            <motion.div
                              key={classItem._id}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="bg-white border-l-4 border-primary rounded-xl p-4 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 group/item"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="text-sm font-extrabold text-slate-800">{classItem.courseId?.courseCode}: {classItem.courseId?.title}</span>
                                  <span className="px-2 py-0.5 bg-primary/5 text-primary text-[10px] font-bold rounded">
                                    {classItem.sectionId?.classId?.code} - Section {classItem.sectionId?.name}
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-4 text-xs text-slate-500 font-medium">
                                  <span className="flex items-center gap-1.5"><User size={14} className="text-slate-400" /> {classItem.teacherId?.name}</span>
                                  <span className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-400" /> Room {classItem.room}</span>
                                  <span className="flex items-center gap-1.5"><Clock size={14} className="text-slate-400" /> {classItem.startTime} - {classItem.endTime}</span>
                                </div>
                              </div>
                              <div className="flex gap-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => openModal("view", classItem)}
                                  className="p-2 text-slate-400 hover:text-primary transition-all cursor-pointer"
                                >
                                  <Eye size={18} />
                                </button>
                                <button 
                                  onClick={() => openModal("edit", classItem)}
                                  className="p-2 text-slate-400 hover:text-amber-600 transition-all cursor-pointer"
                                >
                                  <Edit3 size={18} />
                                </button>
                                <button 
                                  onClick={() => openModal("delete", classItem)}
                                  className="p-2 text-slate-400 hover:text-red-600 transition-all cursor-pointer"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </motion.div>
                            ))}
                            </div>
                          ) : (
                            <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-100 rounded-xl group/empty opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => {
                                  setActiveDay(activeDay);
                                  setFormData({...formData, day: activeDay, startTime: time});
                                  openModal("add");
                                }}
                                className="text-xs font-bold text-slate-400 hover:text-primary transition-all flex items-center gap-2 cursor-pointer"
                              >
                                <Plus size={14} />
                                Add Class Slot
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
           </div>

           {/* Conflict Alert (Fixed Bottom) */}
           <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                    <Calendar size={20} />
                 </div>
                 <div>
                    <h5 className="text-sm font-bold text-amber-900 leading-none">Routine System Active</h5>
                    <p className="text-[11px] text-amber-700 mt-1">Showing classes for {activeDay}. Use the smart scheduler to auto-fill vacant slots.</p>
                 </div>
              </div>
              <button onClick={() => actions.go("/admin/academic/routines")} className="px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 transition-all cursor-pointer">
                Smart Fill
              </button>
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
              className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                      {modalMode === "add" && <>Add <span className="text-primary">Schedule</span></>}
                      {modalMode === "edit" && <>Edit <span className="text-primary">Schedule</span></>}
                      {modalMode === "view" && <><span className="text-primary">Schedule</span> Details</>}
                      {modalMode === "delete" && <>Delete <span className="text-primary">Schedule</span></>}
                    </h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">
                      {modalMode === "delete" ? "This action cannot be undone" : "Timetable & Resource Allocation"}
                    </p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <X size={20} className="text-slate-400" />
                  </button>
                </div>

                {modalMode === "delete" ? (
                  <div className="space-y-6">
                    <div className="p-6 bg-red-50 border border-red-100 rounded-[2rem] flex items-start gap-4">
                      <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
                        <Trash2 size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-red-900">Delete Confirmation</p>
                        <p className="text-xs text-red-700 mt-1 leading-relaxed font-medium">
                          You are about to delete this class slot. 
                          This will remove the entry from the master routine.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button 
                        onClick={() => setIsModalOpen(false)}
                        className="flex-1 py-4 border border-slate-200 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleDelete}
                        disabled={isSubmitting}
                        className="flex-1 py-4 bg-red-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-200 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Delete Now"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Day</label>
                        <select 
                          required
                          disabled={modalMode === "view"}
                          value={formData.day}
                          onChange={(e) => setFormData({...formData, day: e.target.value})}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all disabled:opacity-60"
                        >
                          {days.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Start Time</label>
                          <select 
                            required
                            disabled={modalMode === "view"}
                            value={formData.startTime}
                            onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all disabled:opacity-60"
                          >
                            {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">End Time</label>
                          <select 
                            required
                            disabled={modalMode === "view"}
                            value={formData.endTime}
                            onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all disabled:opacity-60"
                          >
                            {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Room Number</label>
                        <input 
                          type="text" 
                          required
                          disabled={modalMode === "view"}
                          placeholder="e.g. L-401"
                          value={formData.room}
                          onChange={(e) => setFormData({...formData, room: e.target.value})}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all disabled:opacity-60"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Course</label>
                        <select 
                          required
                          disabled={modalMode === "view"}
                          value={formData.courseId}
                          onChange={(e) => setFormData({...formData, courseId: e.target.value})}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all disabled:opacity-60"
                        >
                          <option value="">Select Course</option>
                          {courses.map(c => <option key={c._id} value={c._id}>{c.courseCode}: {c.title}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Section</label>
                        <select 
                          required
                          disabled={modalMode === "view"}
                          value={formData.sectionId}
                          onChange={(e) => setFormData({...formData, sectionId: e.target.value})}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all disabled:opacity-60"
                        >
                          <option value="">Select Section</option>
                          {sections.map(s => (
                            <option key={s._id} value={s._id}>
                              {s.classId?.code} - Section {s.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Teacher</label>
                        <select 
                          required
                          disabled={modalMode === "view"}
                          value={formData.teacherId}
                          onChange={(e) => setFormData({...formData, teacherId: e.target.value})}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all disabled:opacity-60"
                        >
                          <option value="">Select Teacher</option>
                          {teachers.map(t => <option key={t._id} value={t._id}>{t.name} ({t.department})</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="col-span-2 pt-4">
                      {modalMode === "view" ? (
                        <button 
                          type="button"
                          onClick={() => setIsModalOpen(false)}
                          className="w-full py-4 border border-slate-200 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-slate-50 transition-all cursor-pointer"
                        >
                          Close Details
                        </button>
                      ) : (
                        <button 
                          type="submit" 
                          disabled={isSubmitting}
                          className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          {isSubmitting ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <>
                              <Check size={18} /> 
                              {modalMode === "edit" ? "Update Schedule" : "Add to Routine"}
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
