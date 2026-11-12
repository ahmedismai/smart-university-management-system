"use client";

import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Download, 
  Plus, 
  Loader2, 
  XCircle 
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast, Toaster } from "react-hot-toast";

interface Student {
  name: string;
  studentId: string;
  deptCode: string;
  deptName: string;
}

interface RoutineItem {
  day: string;
  time: string;
  subject: string;
  code: string;
  room: string;
  teacher: string;
  color: string;
}

interface RecentChangeItem {
  message: string;
  timeAgo: string;
}

interface RoutineResponse {
  success: boolean;
  student: Student;
  routines: RoutineItem[];
  recentChanges: RecentChangeItem[];
}

const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

export default function RoutinePage() {
  const [data, setData] = useState<RoutineResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [nextSession, setNextSession] = useState<{
    subject: string;
    teacher: string;
    time: string;
    room: string;
    relativeTime: string;
  } | null>(null);

  const fetchRoutine = async () => {
    try {
      const res = await fetch("/api/student/routine");
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/login/student";
          return;
        }
        throw new Error("Failed to fetch academic routine schedules");
      }
      const json = await res.json();
      if (json.success) {
        setData(json);
        calculateNextSession(json.routines);
      } else {
        throw new Error(json.error || "An unexpected error occurred");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong while loading routines.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to parse "09:00 AM" into hour and minutes
  const parseTimeString = (timeStr: string) => {
    const clean = timeStr.trim().toUpperCase();
    const isPM = clean.includes("PM");
    const isAM = clean.includes("AM");
    
    const timeParts = clean.replace("AM", "").replace("PM", "").trim().split(":");
    if (timeParts.length < 2) return null;
    
    let hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    
    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;
    
    return { hours, minutes };
  };

  // Helper to find next class session
  const calculateNextSession = (routines: RoutineItem[]) => {
    const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const now = new Date();
    const todayName = weekdayNames[now.getDay()];
    
    // 1. Check if there are routines remaining today
    const todaysRoutines = routines.filter(r => r.day === todayName);
    const upcomingToday = todaysRoutines
      .map(r => {
        const timeRange = r.time.split("-");
        const startTimeStr = timeRange[0];
        const parsedStart = parseTimeString(startTimeStr);
        if (!parsedStart) return null;
        
        const classTime = new Date();
        classTime.setHours(parsedStart.hours, parsedStart.minutes, 0, 0);
        
        return {
          item: r,
          startTime: classTime
        };
      })
      .filter(r => r !== null && r.startTime > now)
      .sort((a, b) => a!.startTime.getTime() - b!.startTime.getTime());

    if (upcomingToday.length > 0) {
      const next = upcomingToday[0]!;
      const diffMs = next.startTime.getTime() - now.getTime();
      const diffMins = Math.round(diffMs / 60000);
      const timeText = diffMins < 60 ? `Starting in ${diffMins} minutes` : `Starting in ${Math.floor(diffMins / 60)}h ${diffMins % 60}m`;
      
      setNextSession({
        subject: next.item.subject,
        teacher: next.item.teacher,
        time: next.item.time.split("-")[0].trim(),
        room: next.item.room,
        relativeTime: timeText
      });
      return;
    }

    // 2. Check tomorrow's routines
    const tomorrowIndex = (now.getDay() + 1) % 7;
    const tomorrowName = weekdayNames[tomorrowIndex];
    const tomorrowsRoutines = routines.filter(r => r.day === tomorrowName);
    
    if (tomorrowsRoutines.length > 0) {
      const sortedTomorrow = tomorrowsRoutines
        .map(r => {
          const timeRange = r.time.split("-");
          const parsedStart = parseTimeString(timeRange[0]);
          return { item: r, parsed: parsedStart };
        })
        .filter(r => r.parsed !== null)
        .sort((a, b) => {
          return (a.parsed!.hours * 60 + a.parsed!.minutes) - (b.parsed!.hours * 60 + b.parsed!.minutes);
        });

      if (sortedTomorrow.length > 0) {
        const next = sortedTomorrow[0].item;
        setNextSession({
          subject: next.subject,
          teacher: next.teacher,
          time: next.time.split("-")[0].trim(),
          room: next.room,
          relativeTime: "Starting tomorrow"
        });
        return;
      }
    }

    // 3. Fallback to first available class in the week
    const dayIndices: Record<string, number> = {
      "Saturday": 0, "Sunday": 1, "Monday": 2, "Tuesday": 3, "Wednesday": 4, "Thursday": 5, "Friday": 6
    };
    
    const sortedAll = [...routines].sort((a, b) => {
      const dayDiff = (dayIndices[a.day] ?? 0) - (dayIndices[b.day] ?? 0);
      if (dayDiff !== 0) return dayDiff;
      
      const aStart = parseTimeString(a.time.split("-")[0]);
      const bStart = parseTimeString(b.time.split("-")[0]);
      if (!aStart || !bStart) return 0;
      return (aStart.hours * 60 + aStart.minutes) - (bStart.hours * 60 + bStart.minutes);
    });

    if (sortedAll.length > 0) {
      const next = sortedAll[0];
      setNextSession({
        subject: next.subject,
        teacher: next.teacher,
        time: `${next.day}, ${next.time.split("-")[0].trim()}`,
        room: next.room,
        relativeTime: "Next scheduled session"
      });
    } else {
      setNextSession(null);
    }
  };

  useEffect(() => {
    fetchRoutine();
    
    // Pre-select current day if it's a weekday in our schedules
    const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const todayName = weekdayNames[new Date().getDay()];
    if (days.includes(todayName)) {
      setSelectedDay(todayName);
    }
  }, []);

  const handleExportPDF = () => {
    toast.success("Exporting weekly routine to PDF...");
  };

  const handleGoogleCalendar = () => {
    toast.success("Syncing schedules to Google Calendar...");
  };

  const handleSetReminder = () => {
    toast.success("Routine class reminder configured!");
  };

  const handleJoinSession = (subject: string) => {
    toast.success(`Joining live classroom session for ${subject}...`);
  };

  const handleDownloadMaterials = (subject: string) => {
    toast.success(`Downloading lecture files for ${subject}...`);
  };

  const handleAddCustomEvent = () => {
    toast.success("Custom event creation is currently disabled for students.");
  };

  if (loading && !data) {
    return (
      <div className="space-y-8 pb-10 max-w-7xl mx-auto animate-pulse">
        {/* Title skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="h-4 bg-gray-100 rounded w-64"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-11 bg-gray-200 rounded-xl w-32"></div>
            <div className="h-11 bg-gray-200 rounded-xl w-36"></div>
          </div>
        </div>

        {/* Days selector skeleton */}
        <div className="h-14 bg-gray-200 rounded-[2rem] w-full"></div>

        {/* Content skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 h-[400px] bg-gray-100 rounded-[2rem] border border-gray-200/50"></div>
          <div className="space-y-6">
            <div className="h-64 bg-gray-200 rounded-[2rem]"></div>
            <div className="h-48 bg-gray-200 rounded-[2rem]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-white rounded-[2rem] border border-red-100 shadow-sm space-y-4 max-w-md mx-auto">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
          <XCircle size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Failed to Load Routine</h3>
        <p className="text-gray-500 text-sm max-w-md">{error}</p>
        <button 
          onClick={() => {
            setLoading(true);
            setError(null);
            fetchRoutine();
          }} 
          className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:opacity-90 transition-opacity cursor-pointer shadow-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { student, routines, recentChanges } = data!;
  const filteredRoutines = routines.filter(r => r.day === selectedDay);

  return (
    <div className="space-y-8 pb-10 max-w-7xl mx-auto">
      <Toaster position="top-right" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Class Routine</h1>
          <p className="text-gray-500 mt-1">
            Weekly class schedules and session details for {student.name} ({student.deptCode}).
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Download size={18} />
            Export PDF
          </button>
          <button 
            onClick={handleGoogleCalendar}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Calendar size={18} />
            Google Calendar
          </button>
        </div>
      </div>

      {/* Day Selector */}
      <div className="bg-white p-2 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between overflow-x-auto no-scrollbar gap-2">
         {days.map((day) => (
           <button
             key={day}
             onClick={() => setSelectedDay(day)}
             className={cn(
               "px-8 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex-1 text-center",
               selectedDay === day ? "bg-primary text-white shadow-xl shadow-primary/20 scale-105" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
             )}
           >
             {day}
           </button>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Timeline View */}
        <div className="lg:col-span-3 space-y-6">
           <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 relative">
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-xl font-bold text-gray-900">{selectedDay}'s Schedule</h2>
                 <div className="flex gap-2">
                    <button 
                      onClick={() => toast.success("Filters applied.")}
                      className="p-2 text-gray-400 hover:text-primary transition-colors cursor-pointer"
                    >
                      <Filter size={18} />
                    </button>
                 </div>
              </div>
              
              <div className="relative space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                 {filteredRoutines.length > 0 ? (
                   filteredRoutines.map((item, i) => (
                     <motion.div 
                       key={i}
                       initial={{ opacity: 0, x: -20 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ delay: i * 0.1 }}
                       className="relative pl-10 group"
                     >
                        <div className={cn("absolute left-0 top-2 w-6 h-6 rounded-full border-4 border-white shadow-sm z-10 transition-transform group-hover:scale-125", item.color)}></div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-gray-50/50 border border-gray-100 rounded-[1.5rem] group-hover:bg-white group-hover:shadow-xl group-hover:border-primary/10 transition-all">
                           <div className="space-y-3">
                              <div className="flex items-center gap-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                 <Clock size={14} className="text-primary" />
                                 {item.time}
                              </div>
                              <h3 className="text-xl font-black text-gray-900 group-hover:text-primary transition-colors leading-tight">
                                {item.subject} <span className="text-sm font-bold text-gray-300 ml-2">{item.code}</span>
                              </h3>
                              <div className="flex flex-wrap items-center gap-6">
                                 <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                                    <MapPin size={14} className="text-red-400" />
                                    {item.room}
                                 </div>
                                 <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                                    <User size={14} className="text-blue-400" />
                                    {item.teacher}
                                 </div>
                              </div>
                           </div>
                           <div className="mt-4 md:mt-0 flex gap-2">
                              <button 
                                onClick={() => handleDownloadMaterials(item.subject)}
                                className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-500 hover:text-primary hover:border-primary/20 transition-all cursor-pointer"
                              >
                                Materials
                              </button>
                              <button 
                                onClick={() => handleJoinSession(item.subject)}
                                className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-md shadow-primary/10"
                              >
                                Join Session
                              </button>
                           </div>
                        </div>
                     </motion.div>
                   ))
                 ) : (
                   <div className="py-20 text-center">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                         <Calendar size={32} className="text-gray-300" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">No classes scheduled</h3>
                      <p className="text-sm text-gray-500 mt-1">Take a break or focus on self-study today.</p>
                   </div>
                 )}
              </div>
           </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
           {nextSession ? (
             <div className="bg-primary text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
                <div className="relative z-10">
                   <h3 className="text-lg font-bold mb-2">Next Session</h3>
                   <p className="text-blue-200 text-sm mb-6 font-semibold">{nextSession.relativeTime}</p>
                   <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 mb-6">
                      <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-1">{nextSession.subject}</p>
                      <p className="text-lg font-black leading-tight">{nextSession.teacher}</p>
                      <p className="text-xs text-blue-200/70 mt-2 font-medium">{nextSession.time} • {nextSession.room}</p>
                   </div>
                   <button 
                     onClick={handleSetReminder}
                     className="w-full py-4 bg-secondary text-primary font-black rounded-2xl hover:scale-105 transition-transform cursor-pointer shadow-md"
                   >
                      Set Reminder
                   </button>
                </div>
                <Clock size={150} className="absolute -bottom-10 -right-10 opacity-5 group-hover:scale-110 transition-transform duration-1000" />
             </div>
           ) : (
             <div className="bg-primary text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden text-center">
                <div className="relative z-10 py-6">
                   <Calendar size={48} className="mx-auto mb-4 text-secondary" />
                   <h3 className="text-lg font-bold mb-2">All Done</h3>
                   <p className="text-blue-200 text-sm">No upcoming sessions today or tomorrow.</p>
                </div>
             </div>
           )}

           <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-6">Recent Changes</h3>
              <div className="space-y-4">
                 {recentChanges.map((change, i) => (
                   <div key={i} className="flex gap-4 items-start">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                      <div>
                         <p className="text-xs font-bold text-gray-900 leading-snug">{change.message}</p>
                         <p className="text-[10px] text-gray-400 mt-1">{change.timeAgo}</p>
                      </div>
                   </div>
                 ))}
                 {recentChanges.length === 0 && (
                   <p className="text-xs text-gray-400">No recent schedule alterations.</p>
                 )}
              </div>
           </div>
           
           <button 
             onClick={handleAddCustomEvent}
             className="w-full py-4 border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center gap-2 hover:border-primary/40 hover:bg-primary/5 transition-all group cursor-pointer"
           >
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-primary transition-colors">
                <Plus size={20} />
              </div>
              <span className="text-xs font-bold text-gray-500 group-hover:text-primary">Add Custom Event</span>
           </button>
        </div>
      </div>
    </div>
  );
}
