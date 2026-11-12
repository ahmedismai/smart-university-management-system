"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, Bell, Moon, Sun, User, Settings, LogOut, ChevronDown, UserCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { getTheme, setTheme } from "@/lib/theme";
import GlobalSearch from "@/components/dashboard/GlobalSearch";

export const DashboardHeader = () => {
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showProfile, setShowProfile] = React.useState(false);
  const router = useRouter();
  const [dark, setDark] = React.useState(false);
  const [items, setItems] = React.useState<{ _id: string; subject: string; type: string; name: string; createdAt: string }[]>([]);
  const [lastSeen, setLastSeen] = React.useState(0);

  React.useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    const onTheme = () => setDark(document.documentElement.classList.contains("dark"));
    window.addEventListener("sums:theme", onTheme);
    try {
      setLastSeen(Number(localStorage.getItem("admin_notifications_seen") || 0));
    } catch {}
    const load = () =>
      fetch("/api/admin/inquiries?status=New")
        .then((r) => r.json())
        .then((j) => j.items && setItems(j.items.slice(0, 8)))
        .catch(() => {});
    load();
    const t = setInterval(load, 60000);
    return () => {
      window.removeEventListener("sums:theme", onTheme);
      clearInterval(t);
    };
  }, []);

  const unread = items.filter((i) => new Date(i.createdAt).getTime() > lastSeen).length;
  const markAllRead = () => {
    const now = Date.now();
    setLastSeen(now);
    try {
      localStorage.setItem("admin_notifications_seen", String(now));
    } catch {}
  };
  const toggleDark = () => {
    const next = document.documentElement.classList.contains("dark") ? "light" : "dark";
    setTheme(next);
    setDark(next === "dark");
  };
  void getTheme;
  const goTo = (href: string) => {
    setShowProfile(false);
    router.push(href);
  };
  const handleLogout = () => {
    document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    router.push("/login/employee");
  };

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30 shadow-sm">
      {/* Brand & Search */}
      <div className="flex items-center gap-8 flex-1">
        <div className="hidden md:flex items-center gap-3 min-w-max">
          <div className="relative w-12 h-12">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              fill 
              sizes="48px"
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800 leading-none">NextGen University</h1>
            <p className="text-[10px] text-slate-500 font-medium">of Bangladesh</p>
          </div>
        </div>

        <GlobalSearch scope="admin" placeholder="Global search (users, students, courses...)" className="flex-1 max-w-md ml-4" />
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-6">
        {/* Dark Mode Toggle */}
        <button onClick={toggleDark} aria-label="Toggle dark mode" title={dark ? "Switch to light mode" : "Switch to dark mode"} className="p-2.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer">
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-full hover:bg-slate-100 text-slate-500 relative transition-colors cursor-pointer"
          >
            <Bell size={20} />
            {unread > 0 && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
              >
                <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800">Notifications</h3>
                  <button onClick={markAllRead} className="text-xs text-primary font-medium hover:underline cursor-pointer">Mark all read</button>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {items.map((n) => {
                    const isNew = new Date(n.createdAt).getTime() > lastSeen;
                    return (
                      <button
                        key={n._id}
                        onClick={() => {
                          setShowNotifications(false);
                          router.push("/admin/inquiries");
                        }}
                        className="w-full text-left p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 cursor-pointer"
                      >
                        <p className={cn("text-sm mb-1", isNew ? "text-slate-800 font-semibold" : "text-slate-600")}>{n.subject}</p>
                        <span className="text-[10px] text-slate-400">
                          {n.name ? `${n.name} · ` : ""}
                          {new Date(n.createdAt).toLocaleString()}
                        </span>
                      </button>
                    );
                  })}
                  {items.length === 0 && <p className="p-6 text-center text-sm text-slate-400">No new requests</p>}
                </div>
                <div className="p-3 text-center bg-slate-50">
                  <button onClick={() => { setShowNotifications(false); router.push("/admin/inquiries"); }} className="text-xs text-slate-500 font-medium hover:text-primary transition-colors cursor-pointer">View all requests</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile */}
        <div className="relative">
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 p-1.5 pl-3 rounded-full hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all cursor-pointer"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800 leading-tight">Admin User</p>
              <p className="text-[10px] text-primary font-medium uppercase tracking-wider">Super Admin</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary overflow-hidden">
               <UserCircle size={24} />
            </div>
            <ChevronDown size={14} className={cn("text-slate-400 transition-transform", showProfile && "rotate-180")} />
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
              >
                <div className="p-2">
                  <button onClick={() => goTo("/admin/settings")} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary rounded-lg transition-all cursor-pointer">
                    <User size={18} />
                    <span>My Profile</span>
                  </button>
                  <button onClick={() => goTo("/admin/settings")} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary rounded-lg transition-all cursor-pointer">
                    <Settings size={18} />
                    <span>Settings</span>
                  </button>
                  <div className="my-1 border-t border-slate-100"></div>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer">
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

