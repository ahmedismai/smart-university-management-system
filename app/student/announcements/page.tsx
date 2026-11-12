"use client";

import Link from "next/link";

import React, { useEffect, useState } from "react";
import { Bell, Calendar, Megaphone, Info, AlertCircle, Bookmark, Share2, Search, Filter, ChevronRight, Clock, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { actions } from "@/lib/siteActions";

export default function AnnouncementsPage() {
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<string[]>([]);
  const [savedOnly, setSavedOnly] = useState(false);

  useEffect(() => {
    try {
      setSaved(JSON.parse(localStorage.getItem("saved_announcements") || "[]"));
    } catch {}
  }, []);

  const toggleSaved = (id: string) =>
    setSaved((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem("saved_announcements", JSON.stringify(next));
      } catch {}
      return next;
    });

  const share = async (item: any) => {
    const text = item.title + String.fromCharCode(10, 10) + item.content;
    try {
      if (navigator.share) await navigator.share({ title: item.title, text });
      else {
        await navigator.clipboard.writeText(text);
        toast.success("Announcement copied to clipboard");
      }
    } catch {}
  };

  // Fetch announcements from MongoDB
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch("/api/student/announcements");
        const data = await res.json();
        if (data.success && data.announcements) {
          setAnnouncements(data.announcements);
        }
      } catch (error) {
        console.error("Failed to load announcements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  // Filter and search announcements
  const filteredAnnouncements = announcements.filter((a) => {
    const matchesFilter = filter === "All" || a.category.toLowerCase() === filter.toLowerCase() || (filter === "Events" && a.category.toLowerCase() === "event");
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch && (!savedOnly || saved.includes(a._id));
  });

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Announcements</h1>
          <p className="text-gray-500 mt-1">Stay updated with the latest university news and important notices.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search notices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <button onClick={() => setSavedOnly((v) => !v)} aria-pressed={savedOnly} title="Show saved only" className="p-2.5 bg-white border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50 transition-colors">
            <Filter size={20} className={savedOnly ? "text-primary" : ""} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          {/* Categories */}
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
            {["All", "Academic", "Events", "Administrative", "Urgent"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap",
                  filter === cat
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-white border border-gray-100 text-gray-500 hover:border-primary/20 hover:text-primary"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Announcement List */}
          <div className="space-y-6">
            {filteredAnnouncements.map((item, index) => {
              const isUrgent = item.priority === "High" || item.category === "Urgent";
              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "p-8 rounded-[2rem] border transition-all hover:shadow-xl group relative overflow-hidden",
                    isUrgent ? "bg-red-50/30 border-red-100 hover:bg-red-50/50" : "bg-white border-gray-100 hover:border-primary/10"
                  )}
                >
                  {isUrgent && (
                    <div className="absolute top-0 right-0 px-6 py-2 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-2xl shadow-lg">
                      Urgent Notice
                    </div>
                  )}

                  <div className="flex items-start gap-6">
                    <div
                      className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                        isUrgent ? "bg-red-100 text-red-600" : "bg-primary/5 text-primary"
                      )}
                    >
                      {item.category === "Academic" ? (
                        <Megaphone size={24} />
                      ) : item.category === "Event" || item.category === "Events" ? (
                        <Calendar size={24} />
                      ) : item.category === "Administrative" ? (
                        <Info size={24} />
                      ) : (
                        <AlertCircle size={24} />
                      )}
                    </div>
                    <div className="space-y-4 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={cn(
                            "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider",
                            isUrgent ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"
                          )}
                        >
                          {item.category}
                        </span>
                        <span className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
                          <Clock size={14} />
                          {formatDate(item.createdAt)}
                        </span>
                        <span className="text-xs font-bold text-gray-400">•</span>
                        <span className="text-xs font-bold text-gray-400">University Admin</span>
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 group-hover:text-primary transition-colors leading-tight">
                        {item.title}
                      </h3>
                      <p className={cn("text-gray-600 leading-relaxed whitespace-pre-line transition-all duration-500", !expanded[item._id] && "line-clamp-2")}>
                        {item.content}
                      </p>
                      <div className="flex items-center justify-between pt-4">
                        <button onClick={() => setExpanded((e) => ({ ...e, [item._id]: !e[item._id] }))} className="flex items-center gap-2 text-sm font-bold text-primary hover:underline">
                          {expanded[item._id] ? "Show Less" : "Read Full Announcement"} <ChevronRight size={16} className={expanded[item._id] ? "rotate-90" : ""} />
                        </button>
                        <div className="flex items-center gap-2">
                          <button onClick={() => toggleSaved(item._id)} title="Save" className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                            <Bookmark size={18} className={saved.includes(item._id) ? "fill-current text-primary" : ""} />
                          </button>
                          <button onClick={() => share(item)} title="Share" className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                            <Share2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            {filteredAnnouncements.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-12">No announcements found matching the criteria.</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-primary text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <Bell size={40} className="text-secondary mb-6 animate-bounce" />
              <h3 className="text-xl font-bold mb-2">Notification Settings</h3>
              <p className="text-blue-200 text-sm mb-8">Choose how you want to receive important updates.</p>
              <button onClick={() => actions.go("/student/settings?tab=Notifications")} className="w-full py-4 bg-white text-primary font-black rounded-2xl hover:bg-secondary transition-colors">
                Manage Alerts
              </button>
            </div>
            <Bell size={200} className="absolute -bottom-20 -right-20 opacity-5 group-hover:scale-110 transition-transform duration-1000" />
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Calendar size={18} className="text-primary" />
              Upcoming Events
            </h3>
            <div className="space-y-6">
              {[
                { date: "30 Apr", event: "Workshop: React Performance" },
                { date: "02 May", event: "Career Fair 2026" },
                { date: "15 May", event: "Programming Contest" }
              ].map((ev, i) => (
                <div key={i} className="flex gap-4 items-start group cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex flex-col items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="text-[10px] font-black uppercase leading-none">{ev.date.split(" ")[1]}</span>
                    <span className="text-lg font-black leading-none">{ev.date.split(" ")[0]}</span>
                  </div>
                  <p className="text-sm font-bold text-gray-700 leading-tight group-hover:text-primary transition-colors">{ev.event}</p>
                </div>
              ))}
            </div>
            <Link href="/student/routine" className="w-full mt-8 py-3 text-sm font-bold text-primary hover:underline">View Calendar</Link>
          </div>

          <div className="p-8 rounded-[2rem] border-2 border-dashed border-gray-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Megaphone size={28} className="text-gray-300" />
            </div>
            <h4 className="font-bold text-gray-900 text-sm">Have something to share?</h4>
            <p className="text-xs text-gray-500 mt-2 mb-6">Contact your club lead or student rep to post announcements.</p>
            <button onClick={() => actions.inquiry("Request to post an announcement", { type: "contact", title: "Post an announcement", description: "Tell us what you would like to announce. The administration will review and publish it.", fields: ["message"] })} className="px-6 py-2 bg-gray-50 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-100 transition-colors">
              Guidelines
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
