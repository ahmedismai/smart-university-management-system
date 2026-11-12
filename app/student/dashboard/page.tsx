"use client";

import { actions } from "@/lib/siteActions";

import Link from "next/link";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  TrendingUp, 
  CreditCard, 
  MessageSquare, 
  Calendar, 
  Clock, 
  AlertCircle, 
  ChevronRight,
  BookOpen,
  ArrowUpRight,
  MoreVertical,
  CheckCircle2,
  GraduationCap
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function StudentDashboard() {
  const [alertsDismissed, setAlertsDismissed] = React.useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/student/dashboard");
        if (!res.ok) {
          if (res.status === 401) {
            window.location.href = "/login/student";
            return;
          }
          throw new Error("Failed to fetch dashboard data");
        }
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const getIcon = (title: string) => {
    switch (title.toLowerCase()) {
      case "attendance":
        return Users;
      case "cgpa":
        return TrendingUp;
      case "fees due":
        return CreditCard;
      default:
        return MessageSquare;
    }
  };

  const getStatColors = (title: string) => {
    switch (title.toLowerCase()) {
      case "attendance":
        return {
          color: "bg-blue-500",
          bgLight: "bg-blue-50",
          text: "text-blue-600",
        };
      case "cgpa":
        return {
          color: "bg-emerald-500",
          bgLight: "bg-emerald-50",
          text: "text-emerald-600",
        };
      case "fees due":
        return {
          color: "bg-amber-500",
          bgLight: "bg-amber-50",
          text: "text-amber-600",
        };
      default:
        return {
          color: "bg-purple-500",
          bgLight: "bg-purple-50",
          text: "text-purple-600",
        };
    }
  };

  const getAlertIcon = (type: string) => {
    if (type === "warning") return AlertCircle;
    return MessageSquare;
  };

  if (loading) {
    return (
      <div className="space-y-8 pb-10 animate-pulse">
        {/* Welcome Section Skeleton */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="h-9 w-64 bg-gray-200 rounded-xl"></div>
            <div className="h-5 w-80 bg-gray-150 rounded-lg mt-2"></div>
          </div>
          <div className="h-10 w-44 bg-gray-100 rounded-xl"></div>
        </div>

        {/* Quick Stats Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gray-100 rounded-xl animate-pulse"></div>
                <div className="w-4 h-6 bg-gray-100 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-20 bg-gray-100 rounded"></div>
                <div className="flex items-baseline gap-2">
                  <div className="h-8 w-16 bg-gray-200 rounded-lg"></div>
                  <div className="h-5 w-12 bg-gray-100 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Chart Skeleton */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 h-[350px] flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <div className="h-6 w-48 bg-gray-200 rounded"></div>
                  <div className="h-4 w-64 bg-gray-100 rounded"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-7 w-24 bg-gray-100 rounded-lg"></div>
                  <div className="h-7 w-24 bg-gray-100 rounded-lg"></div>
                </div>
              </div>
              <div className="h-48 flex items-end justify-between gap-4 mt-6">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="flex-1 bg-gray-100 rounded-t-lg" style={{ height: `${[50, 70, 40, 85, 65, 80, 55, 90, 80][i]}%` }}></div>
                ))}
              </div>
            </div>

            {/* Courses Skeleton */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="h-6 w-36 bg-gray-200 rounded"></div>
                <div className="h-4 w-16 bg-gray-100 rounded"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 space-y-4">
                    <div className="flex justify-between">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl"></div>
                      <div className="space-y-1">
                        <div className="h-3 w-16 bg-gray-100 rounded ml-auto"></div>
                        <div className="h-4 w-28 bg-gray-100 rounded ml-auto"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-5 w-44 bg-gray-200 rounded"></div>
                      <div className="h-4 w-32 bg-gray-100 rounded"></div>
                    </div>
                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between">
                        <div className="h-3 w-20 bg-gray-100 rounded"></div>
                        <div className="h-3 w-8 bg-gray-100 rounded"></div>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 space-y-6">
              <div className="flex justify-between items-center">
                <div className="h-6 w-20 bg-gray-200 rounded"></div>
                <div className="h-6 w-28 bg-gray-100 rounded-lg"></div>
              </div>
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="p-4 rounded-2xl border border-gray-100 flex gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex-shrink-0"></div>
                    <div className="space-y-2 w-full">
                      <div className="h-4 w-full bg-gray-100 rounded"></div>
                      <div className="h-3 w-24 bg-gray-100 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-150 h-[280px] rounded-3xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center p-8 bg-white rounded-3xl border border-red-100 shadow-sm space-y-4">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
          <AlertCircle size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Failed to Load Dashboard</h3>
        <p className="text-gray-500 max-w-md">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { student, stats, courses, exams } = data;
  const alerts: any[] = alertsDismissed ? [] : data.alerts;

  // Format today's date beautifully
  const todayFormatted = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome Back, {student.name}! 👋</h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your academic progress today.</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
          <Calendar size={16} />
          <span>{todayFormatted}</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(stats).map(([key, statVal]: [string, any], index) => {
          // Reconstruct dynamic keys to matching display names
          let displayTitle = "Attendance";
          if (key === "cgpa") displayTitle = "CGPA";
          if (key === "feesDue") displayTitle = "Fees Due";
          if (key === "messages") displayTitle = "Messages";

          const colors = getStatColors(displayTitle);
          const IconComponent = getIcon(displayTitle);

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-3 rounded-xl", colors.bgLight)}>
                  <IconComponent className={cn("size-6", colors.text)} />
                </div>
                <button onClick={() => actions.go(({ attendance: "/student/attendance", cgpa: "/student/results", feesDue: "/student/fees", messages: "/student/messages" } as Record<string, string>)[key] || "/student/dashboard")} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <MoreVertical size={18} />
                </button>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{displayTitle}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="text-2xl font-bold text-gray-900">{statVal.value}</h3>
                  <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", colors.bgLight, colors.text)}>
                    {statVal.trend}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress & Charts Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* Mock Chart Visualization */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Attendance & Performance</h3>
                <p className="text-sm text-gray-500">Academic year 2025-2026 progress</p>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-xs font-medium text-gray-600">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Attendance
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-xs font-medium text-gray-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  CGPA
                </div>
              </div>
            </div>
            
            {(data.attendanceByMonth || []).length === 0 && <p className="text-sm text-gray-400 py-16 text-center">No attendance recorded yet.</p>}
            <div className="h-64 flex items-end justify-between gap-4 px-2">
              {(data.attendanceByMonth as { label: string; value: number }[]).map(({ label, value: height }, i, arr) => (
                <div key={i} className="flex-1 h-full flex flex-col justify-end items-center gap-2 group relative">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className={cn(
                      "w-full min-h-[4px] rounded-t-lg transition-all duration-300 relative overflow-hidden",
                      i === arr.length - 1 ? "bg-primary" : "bg-blue-100 group-hover:bg-blue-200"
                    )}
                  >
                    <motion.div 
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       transition={{ delay: 1.5 }}
                       className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" 
                    />
                  </motion.div>
                  <span className="text-[10px] font-medium text-gray-400 uppercase tracking-tighter">
                    {label}
                  </span>
                  
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {height}% Attendance
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Courses */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Current Courses</h3>
              <Link href="/student/courses" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                View All <ChevronRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((course: any, index: number) => (
                <motion.div 
                  key={course.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-primary/20 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold", course.color)}>
                      {course.code.split(' ')[0][0]}{course.code.split(' ')[1]?.[0] || 'C'}
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{course.code}</span>
                      <p className="text-xs font-medium text-gray-900 mt-0.5">{course.nextClass}</p>
                    </div>
                  </div>
                  <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors">{course.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">{course.teacher}</p>
                  
                  <div className="mt-6">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-gray-500 font-medium">Syllabus Progress</span>
                      <span className="text-gray-900 font-bold">{course.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress}%` }}
                        transition={{ duration: 1.5, delay: 1 }}
                        className={cn("h-full rounded-full", course.color)}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar content */}
        <div className="space-y-8">
          {/* Alerts Section */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Alerts</h3>
              <span className="bg-red-50 text-red-600 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider animate-pulse">
                Action Required
              </span>
            </div>
            <div className="space-y-4">
              {alerts.length > 0 ? (
                alerts.map((alert: any) => {
                  const Icon = getAlertIcon(alert.type);
                  return (
                    <div 
                      key={alert.id}
                      className={cn("p-4 rounded-2xl border flex gap-4 transition-transform hover:scale-[1.02] cursor-pointer", alert.bg, alert.border)}
                    >
                      <div className={cn("shrink-0 w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm", alert.color)}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 leading-snug">{alert.message}</p>
                        <p className="text-[10px] font-medium text-gray-500 mt-1 uppercase tracking-tight flex items-center gap-1">
                          <Clock size={10} /> {alert.date}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No active alerts</p>
              )}
            </div>
            <button onClick={() => setAlertsDismissed(true)} className="w-full mt-6 py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-semibold text-gray-500 hover:border-primary/50 hover:text-primary transition-all">
              Dismiss All Alerts
            </button>
          </div>

          {/* Upcoming Events/Tasks */}
          <div className="bg-primary text-white p-6 rounded-3xl shadow-xl shadow-primary/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 -mr-4 -mt-4 transition-transform group-hover:scale-125 duration-700">
              <GraduationCap size={120} />
            </div>
            <div className="relative z-10">
              {exams.length > 0 ? (
                <>
                  <h3 className="text-lg font-bold mb-2">{exams[0]?.name || "Upcoming Exam"}</h3>
                  <p className="text-primary-foreground/70 text-sm mb-6">
                    Your {(exams[0]?.name || "Exam").toLowerCase()} starts on {exams[0]?.startDate ? new Date(exams[0].startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "the scheduled date"}. Start your preparation today!
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-bold mb-2">Final Exams</h3>
                  <p className="text-primary-foreground/70 text-sm mb-6">Your final exams start in 24 days. Start your preparation today!</p>
                </>
              )}
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                  <div className="bg-secondary text-primary p-2 rounded-lg">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Exam Schedule</p>
                    <p className="text-[10px] opacity-70">Released recently</p>
                  </div>
                  <ArrowUpRight size={16} className="ml-auto opacity-50" />
                </div>
                
                <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                  <div className="bg-emerald-500 text-white p-2 rounded-lg">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Admit Card</p>
                    <p className="text-[10px] opacity-70">Ready to download</p>
                  </div>
                  <ArrowUpRight size={16} className="ml-auto opacity-50" />
                </div>
              </div>
              
              <Link href="/student/results" className="w-full mt-6 bg-secondary text-primary font-bold py-3 rounded-2xl hover:bg-white transition-colors">
                View Exam Center
              </Link>
            </div>
          </div>

          {/* Quick Support */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                <HelpCircle size={24} />
              </div>
              <div>
                <p className="font-bold text-gray-900">Need Help?</p>
                <p className="text-xs text-gray-500">Contact academic advisor</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
              <ChevronRight size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HelpCircle({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>
    </svg>
  );
}
