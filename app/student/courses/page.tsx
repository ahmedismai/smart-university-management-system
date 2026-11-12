"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  User, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Play, 
  FileText, 
  Layout, 
  Grid, 
  List, 
  Loader2, 
  XCircle 
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Student {
  name: string;
  studentId: string;
  deptCode: string;
  deptName: string;
}

interface CourseItem {
  id: string | number;
  name: string;
  code: string;
  instructor: string;
  progress: number;
  completed: number;
  total: number;
  color: string;
  image: string;
}

interface CoursesResponse {
  success: boolean;
  student: Student;
  enrolledCourses: CourseItem[];
}

export default function CoursesPage() {
  const [data, setData] = useState<CoursesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Courses');

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/student/courses");
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/login/student";
          return;
        }
        throw new Error("Failed to fetch enrolled academic courses");
      }
      const json = await res.json();
      if (json.success) {
        setData(json);
      } else {
        throw new Error(json.error || "An unexpected error occurred");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong while loading courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const getRemainingTimeText = (course: CourseItem) => {
    if (course.progress === 100) return "Completed";
    if (course.progress === 0) return "Not Started";
    const remainingLessons = course.total - course.completed;
    const remainingHours = remainingLessons * 2; // Assume 2 hours per lesson
    return `${remainingHours}h Remaining`;
  };

  // Get department specific resources
  const getRecommendedResources = (deptCode: string) => {
    if (deptCode === "EEE") {
      return [
        { title: "Special Lecture: Smart Grid Technologies", instructor: "Dr. Ahmed", duration: "45 mins" },
        { title: "Tutorial: Oscilloscope Basics", instructor: "Prof. Chen", duration: "30 mins" },
        { title: "Seminar: Renewable Energy Systems", instructor: "Dr. Sarah", duration: "60 mins" },
        { title: "Tech Talk: PCB Design Fundamentals", instructor: "Dr. Emily Brown", duration: "50 mins" },
      ];
    } else if (deptCode === "BBA") {
      return [
        { title: "Special Lecture: Digital Marketing Trends", instructor: "Dr. Ahmed", duration: "45 mins" },
        { title: "Tutorial: Financial Modeling in Excel", instructor: "Prof. Chen", duration: "30 mins" },
        { title: "Seminar: Startup Funding Essentials", instructor: "Dr. Sarah", duration: "60 mins" },
        { title: "Tech Talk: Corporate Communication", instructor: "Dr. Emily Brown", duration: "50 mins" },
      ];
    } else {
      return [
        { title: "Special Lecture: Microservices with Docker", instructor: "Dr. Ahmed", duration: "45 mins" },
        { title: "Tutorial: Git & GitHub Best Practices", instructor: "Prof. Chen", duration: "30 mins" },
        { title: "Seminar: AI/ML in Modern Web Apps", instructor: "Dr. Sarah", duration: "60 mins" },
        { title: "Tech Talk: Clean Architecture in Next.js", instructor: "Dr. Emily Brown", duration: "50 mins" },
      ];
    }
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
            <div className="h-11 bg-gray-200 rounded-xl w-24"></div>
            <div className="h-11 bg-gray-200 rounded-xl w-36"></div>
          </div>
        </div>
        
        {/* Categories skeleton */}
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded-full w-28 shrink-0"></div>
          ))}
        </div>

        {/* Cards skeleton */}
        <div className={cn(
          "grid gap-8",
          view === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
        )}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className={cn(
              "bg-gray-100 rounded-[2rem] border border-gray-200/50",
              view === 'grid' ? "h-96" : "h-44"
            )}></div>
          ))}
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
        <h3 className="text-xl font-bold text-gray-900">Failed to Load Courses</h3>
        <p className="text-gray-500 text-sm max-w-md">{error}</p>
        <button 
          onClick={() => {
            setLoading(true);
            setError(null);
            fetchCourses();
          }} 
          className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:opacity-90 transition-opacity cursor-pointer shadow-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { student, enrolledCourses } = data!;

  // Category Filtering logic
  const filteredCourses = enrolledCourses.filter((course) => {
    if (selectedCategory === "All Courses") return true;
    if (selectedCategory === "In Progress") return course.progress > 0 && course.progress < 100;
    if (selectedCategory === "Completed") return course.progress === 100;
    if (selectedCategory === "Upcoming") return course.progress === 0;
    return true;
  });

  const recommendedResources = getRecommendedResources(student.deptCode);

  return (
    <div className="space-y-8 pb-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Courses</h1>
          <p className="text-gray-500 mt-1">
            Manage enrolled courses and academic resources for {student.name} ({student.deptCode}).
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-gray-200 rounded-xl p-1">
             <button 
               onClick={() => setView('grid')}
               className={cn("p-2 rounded-lg transition-colors cursor-pointer", view === 'grid' ? "bg-primary text-white" : "text-gray-400 hover:text-gray-600")}
             >
               <Grid size={18} />
             </button>
             <button 
               onClick={() => setView('list')}
               className={cn("p-2 rounded-lg transition-colors cursor-pointer", view === 'list' ? "bg-primary text-white" : "text-gray-400 hover:text-gray-600")}
             >
               <List size={18} />
             </button>
          </div>
          <Link href="/student/lectures" className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-opacity cursor-pointer">
            <Layout size={18} />
            All Lectures
          </Link>
        </div>
      </div>

      {/* Categories / Filter */}
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
         {['All Courses', 'In Progress', 'Completed', 'Upcoming'].map((cat) => (
           <button 
             key={cat} 
             onClick={() => setSelectedCategory(cat)}
             className={cn(
               "px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap cursor-pointer",
               selectedCategory === cat 
                 ? "bg-primary text-white shadow-lg shadow-primary/20" 
                 : "bg-white border border-gray-100 text-gray-500 hover:border-primary/20 hover:text-primary"
             )}
           >
             {cat}
           </button>
         ))}
      </div>

      {/* Courses List/Grid */}
      <div className={cn(
        "grid gap-8",
        view === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
      )}>
        {filteredCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all group",
              view === 'list' && "flex md:items-center p-2"
            )}
          >
            <div className={cn(
              "relative",
              view === 'grid' ? "h-48" : "w-48 h-40 shrink-0 rounded-2xl overflow-hidden"
            )}>
               <img src={course.image} alt={course.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
               <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
               <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-white text-[10px] font-black uppercase tracking-widest border border-white/30">
                  {course.code}
               </div>
               <Link href={`/student/courses/${course.id}`} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-xl scale-75 group-hover:scale-100 transition-transform">
                    <Play size={24} fill="currentColor" />
                  </div>
               </Link>
            </div>

            <div className={cn("p-6 flex-1", view === 'list' && "flex items-center justify-between")}>
               <div className={view === 'list' ? "max-w-md" : ""}>
                 <div className="flex items-center gap-2 text-xs font-bold text-primary mb-2">
                    <div className={cn("w-2 h-2 rounded-full", course.color)}></div>
                    {student.deptCode} Department
                 </div>
                 <h3 className="text-lg font-black text-gray-900 group-hover:text-primary transition-colors leading-tight mb-2">
                   <Link href={`/student/courses/${course.id}`}>{course.name}</Link>
                 </h3>
                 <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
                    <User size={14} />
                    {course.instructor}
                 </div>
               </div>

               <div className={cn(
                 view === 'grid' ? "space-y-4" : "flex items-center gap-12"
               )}>
                 <div className={view === 'list' ? "w-48" : "w-full"}>
                    <div className="flex items-center justify-between text-[10px] font-bold mb-1.5 uppercase tracking-tighter">
                       <span className="text-gray-400">Progress</span>
                       <span className="text-gray-900">{course.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${course.progress}%` }}
                         transition={{ duration: 1.5, delay: 0.5 }}
                         className={cn("h-full rounded-full", course.color)}
                       />
                    </div>
                 </div>

                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                          <FileText size={12} />
                          {course.completed}/{course.total} Lessons
                       </div>
                       <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                          <Clock size={12} />
                          {getRemainingTimeText(course)}
                       </div>
                    </div>
                    {view === 'grid' && (
                      <Link href={`/student/courses/${course.id}`} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-all cursor-pointer">
                        <ChevronRight size={16} />
                      </Link>
                    )}
                 </div>
                 {view === 'list' && (
                   <Link href={`/student/courses/${course.id}`} className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer">
                      {course.progress === 100 ? "Review Material" : course.progress === 0 ? "Start Learning" : "Continue Learning"}
                   </Link>
                 )}
               </div>
            </div>
          </motion.div>
        ))}

        {filteredCourses.length === 0 && (
          <div className="col-span-full py-16 text-center text-gray-400 bg-white border border-gray-100 rounded-[2rem] shadow-sm">
            <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-bold text-gray-800">No Courses Found</p>
            <p className="text-sm text-gray-500 mt-1">There are no courses matching "{selectedCategory}" for this semester.</p>
          </div>
        )}
      </div>

      {/* Featured Resources */}
      <div className="mt-12 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
         <h2 className="text-xl font-bold text-gray-900 mb-8">Recommended for You</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedResources.map((resource, i) => (
              <div key={i} className="space-y-3 cursor-pointer group">
                 <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <Play size={24} className="text-primary" />
                    </div>
                 </div>
                 <h4 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                   {resource.title}
                 </h4>
                 <p className="text-[10px] font-medium text-gray-500">By {resource.instructor} • {resource.duration}</p>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
