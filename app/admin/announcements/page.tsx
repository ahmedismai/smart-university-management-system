"use client";

import { actions } from "@/lib/siteActions";
import React, { useState } from "react";
import useSWR from "swr";
import { 
  Bell, 
  Plus, 
  Search, 
  Megaphone, 
  Calendar, 
  Users, 
  Eye, 
  Edit3, 
  Trash2, 
  MoreHorizontal,
  Clock,
  CheckCircle2,
  AlertCircle,
  Filter,
  Loader2,
  X
} from "lucide-react";
import { motion } from "framer-motion";
import Swal from 'sweetalert2';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AnnouncementsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [viewData, setViewData] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "Academic",
    priority: "Medium",
    targetAudience: "All",
    status: "Published"
  });

  const { data: allAnnouncements = [], isLoading: loading, mutate } = useSWR("/api/admin/announcements", fetcher);
  
  const fetchedAnnouncements = Array.isArray(allAnnouncements) ? allAnnouncements : [];

  const categories = [
    { name: "All", count: fetchedAnnouncements.length },
    { name: "Academic", count: fetchedAnnouncements.filter((a: any) => a.category === "Academic").length },
    { name: "Administrative", count: fetchedAnnouncements.filter((a: any) => a.category === "Administrative").length },
    { name: "Event", count: fetchedAnnouncements.filter((a: any) => a.category === "Event").length },
    { name: "Urgent", count: fetchedAnnouncements.filter((a: any) => a.category === "Urgent").length },
  ];

  const announcements = activeCategory === "All" 
    ? fetchedAnnouncements 
    : fetchedAnnouncements.filter((a: any) => a.category === activeCategory);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = editId ? `/api/admin/announcements/${editId}` : "/api/admin/announcements";
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        mutate();
        setIsModalOpen(false);
        setEditId(null);
        setFormData({ title: "", content: "", category: "Academic", priority: "Medium", targetAudience: "All", status: "Published" });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (ann: any) => {
    setFormData({
      title: ann.title,
      content: ann.content,
      category: ann.category,
      priority: ann.priority,
      targetAudience: ann.targetAudience,
      status: ann.status
    });
    setEditId(ann._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0ea5e9',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
        if (res.ok) {
          mutate();
          Swal.fire(
            'Deleted!',
            'The announcement has been deleted.',
            'success'
          );
        }
      } catch (error) {
        console.error(error);
        Swal.fire(
          'Error!',
          'Failed to delete the announcement.',
          'error'
        );
      }
    }
  };

  const openCreateModal = () => {
    setFormData({ title: "", content: "", category: "Academic", priority: "Medium", targetAudience: "All", status: "Published" });
    setEditId(null);
    setIsModalOpen(true);
  };

  return (
    <>
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Announcements & Notices</h1>
          <p className="text-slate-500">Create, manage and schedule system-wide notifications.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all hover:-translate-y-0.5 cursor-pointer"
        >
          <Plus size={20} />
          Create Announcement
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Filter size={18} />
              Categories
            </h3>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeCategory === cat.name 
                    ? 'bg-primary/5 text-primary border-l-4 border-primary' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  {cat.name}
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    activeCategory === cat.name ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-secondary/10 p-6 rounded-2xl border border-secondary/20">
            <div className="w-10 h-10 bg-secondary text-primary rounded-xl flex items-center justify-center mb-4">
              <Megaphone size={20} />
            </div>
            <h4 className="font-bold text-primary mb-2">Emergency Alert?</h4>
            <p className="text-xs text-slate-600 mb-4">You can broadcast critical alerts instantly to all active users via mobile push notifications.</p>
            <button onClick={() => actions.go("/admin/settings")} className="text-xs font-bold text-primary hover:underline cursor-pointer">Configure Alerts →</button>
          </div>
        </div>

        {/* Announcement List */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search & Bulk Actions */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search announcements..." 
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex items-center gap-2">
              <select className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none">
                <option>Newest First</option>
                <option>Oldest First</option>
              </select>
            </div>
          </div>

          {/* List */}
          <div className="space-y-4 min-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : (
              <>
                {announcements.map((ann, i) => (
                  <motion.div
                    key={ann._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-primary/20 hover:shadow-md transition-all group"
                  >
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            ann.category === 'Urgent' ? 'bg-red-100 text-red-600' :
                            ann.category === 'Event' ? 'bg-purple-100 text-purple-600' :
                            ann.category === 'Academic' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                          }`}>
                            {ann.category}
                          </span>
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Users size={14} />
                            <span className="text-xs font-medium">{ann.targetAudience}</span>
                          </div>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 group-hover:text-primary transition-colors mb-2">{ann.title}</h3>
                        <p className="text-sm text-slate-600 mb-4 line-clamp-2">{ann.content}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={14} />
                            {new Date(ann.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock size={14} />
                            By Admin
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row sm:flex-col justify-between items-end gap-4">
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${
                          ann.status === 'Published' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {ann.status === 'Published' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                          {ann.status}
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setViewData(ann)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all cursor-pointer"><Eye size={18} /></button>
                          <button onClick={() => handleEdit(ann)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all cursor-pointer"><Edit3 size={18} /></button>
                          <button onClick={() => handleDelete(ann._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"><Trash2 size={18} /></button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {announcements.length === 0 && (
                  <div className="py-20 text-center text-slate-400">
                    No announcements found.
                  </div>
                )}
              </>
            )}
          </div>

          <button onClick={(e) => actions.details(e)} className="w-full py-4 bg-slate-50 text-slate-500 rounded-2xl text-sm font-bold border-2 border-dashed border-slate-200 hover:bg-slate-100 hover:border-primary/20 hover:text-primary transition-all cursor-pointer">
            Load More Announcements
          </button>
        </div>
      </div>
    </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Megaphone className="text-primary" size={20} />
                {editId ? "Edit Announcement" : "Create Announcement"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer bg-white p-2 rounded-full shadow-sm"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="announcement-form" onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Title</label>
                  <input 
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="Enter announcement title"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Content</label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    placeholder="Enter detailed announcement content..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    >
                      <option value="Academic">Academic</option>
                      <option value="Administrative">Administrative</option>
                      <option value="Event">Event</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Priority</label>
                    <select 
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Target Audience</label>
                    <select 
                      value={formData.targetAudience}
                      onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    >
                      <option value="All">All Users</option>
                      <option value="Students">Students</option>
                      <option value="Teachers">Teachers</option>
                      <option value="Staff">Staff</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    >
                      <option value="Published">Published (Live)</option>
                      <option value="Draft">Draft</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-3 text-slate-500 font-bold text-sm bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                form="announcement-form"
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 text-white font-bold text-sm bg-primary hover:bg-primary/90 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : (editId ? "Update Announcement" : "Publish Announcement")}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* View Modal */}
      {viewData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Megaphone className="text-primary" size={20} />
                Announcement Details
              </h3>
              <button 
                onClick={() => setViewData(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer bg-white p-2 rounded-full shadow-sm"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    viewData.category === 'Urgent' ? 'bg-red-100 text-red-600' :
                    viewData.category === 'Event' ? 'bg-purple-100 text-purple-600' :
                    viewData.category === 'Academic' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {viewData.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Users size={14} />
                    <span className="text-xs font-medium">{viewData.targetAudience}</span>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">{viewData.title}</h2>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {new Date(viewData.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    By Admin
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-700 whitespace-pre-wrap">
                {viewData.content}
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setViewData(null)}
                className="px-6 py-2.5 text-white font-bold text-sm bg-primary hover:bg-primary/90 rounded-xl transition-all shadow-lg shadow-primary/20 cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
