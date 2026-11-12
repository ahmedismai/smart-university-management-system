"use client";

import React from "react";
import Link from "next/link";
import GlobalSearch from "@/components/dashboard/GlobalSearch";
import { Bell, Settings, User, LogOut, Mail, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export const StudentDashboardHeader = () => {
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [me, setMe] = React.useState<{ name: string; id: string } | null>(null);
  const [notices, setNotices] = React.useState<{ _id: string; title: string; createdAt: string }[]>([]);
  const [mine, setMine] = React.useState<{ id: string; title: string; body: string; link: string; read: boolean; createdAt: string }[]>([]);
  const [unread, setUnread] = React.useState(0);
  const openNotifications = () => {
    const next = !showNotifications;
    setShowNotifications(next);
    if (next && unread > 0) {
      fetch("/api/student/notifications", { method: "PATCH" }).then(() => setUnread(0)).catch(() => {});
    }
  };

  React.useEffect(() => {
    fetch("/api/student/profile")
      .then((r) => r.json())
      .then((j) => j.student && setMe({ name: j.student.name, id: j.student.id }))
      .catch(() => {});
    fetch("/api/student/notifications")
      .then((r) => r.json())
      .then((j) => {
        if (j.items) setMine(j.items.slice(0, 6));
        if (typeof j.unread === "number") setUnread(j.unread);
      })
      .catch(() => {});
    fetch("/api/student/announcements")
      .then((r) => r.json())
      .then((j) => j.announcements && setNotices(j.announcements.slice(0, 5)))
      .catch(() => {});
  }, []);

  const initials = (me?.name || "S").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const handleLogout = () => {
    // Clear the student session cookie
    document.cookie = "student_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    router.push("/login/student");
  };

  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-8 sticky top-0 z-30">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <GlobalSearch scope="student" placeholder="Search for courses, results, etc..." />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={openNotifications}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors relative group"
          >
            <Bell size={20} className="group-hover:text-primary transition-colors" />
            {unread > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>}
          </button>
          
          <AnimatePresence>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20"
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <h3 className="font-semibold text-sm">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {mine.map((n) => (
                      <Link
                        key={n.id}
                        href={n.link || "/student/fees"}
                        onClick={() => setShowNotifications(false)}
                        className={cn("block px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50", !n.read && "bg-primary/5")}
                      >
                        <p className="text-xs font-bold text-gray-900">{n.title}</p>
                        <p className="text-[11px] text-gray-600 mt-0.5">{n.body}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{new Date(n.createdAt).toLocaleDateString()}</p>
                      </Link>
                    ))}
                    {notices.map((n) => (
                      <Link
                        key={n._id}
                        href="/student/announcements"
                        onClick={() => setShowNotifications(false)}
                        className="block px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50"
                      >
                        <p className="text-xs font-medium text-gray-900">{n.title}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{new Date(n.createdAt).toLocaleDateString()}</p>
                      </Link>
                    ))}
                    {notices.length === 0 && mine.length === 0 && <p className="px-4 py-6 text-center text-xs text-gray-400">No notifications</p>}
                  </div>
                  <div className="px-4 py-2 text-center">
                    <Link href="/student/announcements" onClick={() => setShowNotifications(false)} className="text-xs text-primary font-medium hover:underline">View all</Link>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Settings */}
        <Link href="/student/settings" className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors group">
          <Settings size={20} className="group-hover:text-primary transition-colors" />
        </Link>

        {/* Profile */}
        <div className="relative ml-2">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-1 pr-3 hover:bg-gray-100 rounded-xl transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-900 leading-tight">{me?.name || "..."}</p>
              <p className="text-[10px] text-gray-500">Student ID: {me?.id || "..."}</p>
            </div>
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowProfileMenu(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20"
                >
                  <div className="px-4 py-2 border-b border-gray-100 mb-1">
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Account</p>
                  </div>
                  <Link href="/student/profile" onClick={() => setShowProfileMenu(false)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"><User size={16} />My Profile</Link>
                  <Link href="/student/messages" onClick={() => setShowProfileMenu(false)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"><Mail size={16} />Messages</Link>
                  <Link href="/feedback" onClick={() => setShowProfileMenu(false)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"><HelpCircle size={16} />Help Center</Link>
                  <div className="h-px bg-gray-100 my-1 mx-2" />
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
