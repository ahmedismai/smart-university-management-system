"use client";

import { actions } from "@/lib/siteActions";
import React, { useEffect, useState } from "react";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Banknote as DollarSign, 
  Calendar, 
  AlertCircle, 
  Plus, 
  FileText, 
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [statsData, setStatsData] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, activitiesRes, alertsRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/activities"),
          fetch("/api/admin/alerts")
        ]);

        const stats = await statsRes.json();
        const acts = await activitiesRes.json();
        const alts = await alertsRes.json();

        setStatsData(stats);
        setActivities(acts);
        setAlerts(alts);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Students",
      value: statsData?.students?.toLocaleString() || "0",
      change: "+12%",
      isPositive: true,
      icon: GraduationCap,
      color: "bg-blue-500",
    },
    {
      title: "Total Teachers",
      value: statsData?.teachers?.toLocaleString() || "0",
      change: "+3%",
      isPositive: true,
      icon: Users,
      color: "bg-emerald-500",
    },
    {
      title: "Total Classes",
      value: statsData?.classes?.toLocaleString() || "0",
      change: "0%",
      isPositive: true,
      icon: BookOpen,
      color: "bg-purple-500",
    },
    {
      title: "Fee Collected",
      value: `EGP ${statsData?.fees?.collected?.toLocaleString() || "0"}`,
      change: `+${statsData?.fees?.percentage || 0}%`,
      isPositive: true,
      icon: DollarSign,
      color: "bg-amber-500",
    },
  ];

  const quickActions = [
    { title: "Add Student", icon: Plus, color: "bg-primary" },
    { title: "Add Teacher", icon: Plus, color: "bg-primary" },
    { title: "Create Class", icon: Plus, color: "bg-primary" },
    { title: "Generate Routine", icon: Calendar, color: "bg-primary" },
    { title: "Create Announcement", icon: AlertCircle, color: "bg-secondary" },
    { title: "Manage Fees", icon: DollarSign, color: "bg-secondary" },
    { title: "View Reports", icon: FileText, color: "bg-secondary" },
    { title: "Backup DB", icon: RefreshCw, color: "bg-secondary" },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
        <p className="text-slate-500">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      {/* Section 1: Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.color} p-3 rounded-xl text-white`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${stat.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </div>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Section 2: Charts & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend (Visual Placeholder) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">Attendance Trend</h3>
            <select className="bg-slate-50 border border-slate-200 text-xs rounded-lg px-2 py-1 outline-none">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {[40, 70, 45, 90, 65, 80, 50, 85, 60, 75, 45, 95].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                className="flex-1 bg-primary/20 rounded-t-sm hover:bg-primary transition-colors relative group"
              >
                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {h}% Present
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] text-slate-400 font-medium">
            <span>01 Apr</span>
            <span>10 Apr</span>
            <span>20 Apr</span>
            <span>30 Apr</span>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-6">Financial Overview</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500">Collected Fees</span>
                <span className="font-bold text-slate-800">EGP {statsData?.fees?.collected?.toLocaleString()}</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${statsData?.fees?.percentage || 0}%` }}
                  className="h-full bg-emerald-500" 
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500">Pending Dues</span>
                <span className="font-bold text-slate-800">EGP {statsData?.fees?.pending?.toLocaleString()}</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${100 - (statsData?.fees?.percentage || 0)}%` }}
                  className="h-full bg-amber-500" 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-slate-500 mb-1">Total Target</p>
                <p className="text-lg font-bold text-primary">EGP {(statsData?.fees?.collected + statsData?.fees?.pending)?.toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-slate-500 mb-1">Collection Rate</p>
                <p className="text-lg font-bold text-emerald-500">{statsData?.fees?.percentage}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Quick Actions */}
      <div>
        <h3 className="font-bold text-slate-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {quickActions.map((action, i) => (
            <motion.button
              key={action.title}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-primary/30 transition-all group cursor-pointer"
            >
              <div className={`${action.color} p-3 rounded-xl text-white mb-2 shadow-lg shadow-primary/10 group-hover:scale-110 transition-transform`}>
                <action.icon size={20} />
              </div>
              <span className="text-[10px] font-bold text-slate-600 text-center uppercase tracking-tight">{action.title}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Section 4: Recent Activities */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Recent Activities</h3>
            <button onClick={() => actions.go("/admin/audit-logs")} className="text-xs text-primary font-bold hover:underline cursor-pointer">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Details</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {activities.map((activity) => (
                  <tr key={activity._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-xs text-slate-500">{new Date(activity.timestamp).toLocaleString()}</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-800">{activity.user}</td>
                    <td className="px-6 py-4 text-xs text-slate-600">{activity.action}</td>
                    <td className="px-6 py-4 text-xs text-slate-600">{activity.details}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                        {activity.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {activities.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-slate-400 text-sm">No recent activities found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 5: Pending Tasks / Alerts */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle size={20} className="text-secondary" />
            <h3 className="font-bold text-slate-800">Pending Tasks & Alerts</h3>
          </div>
          <div className="space-y-4">
            {alerts.map((alert, i) => (
              <motion.div
                key={alert._id}
                whileHover={{ x: 5 }}
                className={`flex items-start gap-3 p-4 bg-slate-50 rounded-xl border-l-4 cursor-pointer ${
                  alert.type === 'Warning' ? 'border-amber-500' : 
                  alert.type === 'Error' ? 'border-red-500' : 'border-blue-500'
                }`}
              >
                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                  alert.type === 'Warning' ? 'bg-amber-500' : 
                  alert.type === 'Error' ? 'bg-red-500' : 'bg-blue-500'
                }`} />
                <p className="text-sm font-medium text-slate-700">{alert.message}</p>
              </motion.div>
            ))}
            {alerts.length === 0 && (
              <p className="text-center text-slate-400 text-sm py-10">No pending alerts.</p>
            )}
          </div>
          <button onClick={(e) => actions.details(e)} className="w-full mt-6 py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-primary hover:text-white transition-all cursor-pointer">
            View All Tasks
          </button>
        </div>
      </div>
    </div>
  );
}
