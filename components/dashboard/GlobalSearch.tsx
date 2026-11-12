"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, BookOpen, FileText, Layout, User } from "lucide-react";

type Scope = "student" | "admin";
type Result = { group: string; title: string; hint?: string; href: string };

const STUDENT_PAGES: Result[] = [
  { group: "Pages", title: "Dashboard", href: "/student/dashboard" },
  { group: "Pages", title: "My Profile", hint: "documents, ID card", href: "/student/profile" },
  { group: "Pages", title: "Attendance", hint: "leave request", href: "/student/attendance" },
  { group: "Pages", title: "Marks & Results", hint: "grades transcript gpa", href: "/student/results" },
  { group: "Pages", title: "Fees & Payment", hint: "dues invoice fines", href: "/student/fees" },
  { group: "Pages", title: "Courses", href: "/student/courses" },
  { group: "Pages", title: "Lectures", hint: "files pdf materials", href: "/student/lectures" },
  { group: "Pages", title: "Class Routine", hint: "schedule timetable", href: "/student/routine" },
  { group: "Pages", title: "Library", hint: "books borrow", href: "/student/library" },
  { group: "Pages", title: "Announcements", hint: "news notices", href: "/student/announcements" },
  { group: "Pages", title: "Messaging", hint: "chat teachers", href: "/student/messages" },
  { group: "Pages", title: "Online Classes", hint: "meeting live video", href: "/student/meetings" },
  { group: "Pages", title: "Downloads", href: "/student/downloads" },
  { group: "Pages", title: "Digital ID card", href: "/student/id-card" },
  { group: "Pages", title: "Settings", hint: "password theme notifications", href: "/student/settings" },
];

const ADMIN_PAGES: Result[] = [
  { group: "Pages", title: "Dashboard", href: "/admin/dashboard" },
  { group: "Pages", title: "All Users", href: "/admin/users" },
  { group: "Pages", title: "Students", href: "/admin/students" },
  { group: "Pages", title: "Teachers", href: "/admin/teachers" },
  { group: "Pages", title: "Parents", href: "/admin/parents" },
  { group: "Pages", title: "Staff", href: "/admin/staff" },
  { group: "Pages", title: "Role Assignment", href: "/admin/roles" },
  { group: "Pages", title: "Admission Applications", href: "/admin/applications" },
  { group: "Pages", title: "Requests & Inquiries", href: "/admin/inquiries" },
  { group: "Pages", title: "Classes", href: "/admin/academic/classes" },
  { group: "Pages", title: "Sections", href: "/admin/academic/sections" },
  { group: "Pages", title: "Courses", href: "/admin/academic/courses" },
  { group: "Pages", title: "Routines", href: "/admin/academic/routines" },
  { group: "Pages", title: "Exams", href: "/admin/academic/exams" },
  { group: "Pages", title: "Academic Results", href: "/admin/academic/results" },
  { group: "Pages", title: "Attendance", href: "/admin/attendance" },
  { group: "Pages", title: "Attendance Records", href: "/admin/attendance/records" },
  { group: "Pages", title: "Attendance Reports", href: "/admin/attendance/reports" },
  { group: "Pages", title: "Attendance Policies", href: "/admin/attendance/policies" },
  { group: "Pages", title: "Upload Marks", href: "/admin/marks/upload" },
  { group: "Pages", title: "Grade Management", href: "/admin/marks/grades" },
  { group: "Pages", title: "Transcripts", href: "/admin/marks/transcript" },
  { group: "Pages", title: "Report Cards", href: "/admin/marks/report-cards" },
  { group: "Pages", title: "Financial Overview", href: "/admin/financial" },
  { group: "Pages", title: "Fees & Structure", href: "/admin/financial/fees" },
  { group: "Pages", title: "Invoices", href: "/admin/financial/invoices" },
  { group: "Pages", title: "Payments", href: "/admin/financial/payments" },
  { group: "Pages", title: "Waivers", href: "/admin/financial/waivers" },
  { group: "Pages", title: "Fines", href: "/admin/financial/fines" },
  { group: "Pages", title: "Financial Reports", href: "/admin/financial/reports" },
  { group: "Pages", title: "Library", href: "/admin/library" },
  { group: "Pages", title: "Inventory", href: "/admin/inventory" },
  { group: "Pages", title: "Hostel & Transport", href: "/admin/hostel-transport" },
  { group: "Pages", title: "Announcements", href: "/admin/announcements" },
  { group: "Pages", title: "Reports", href: "/admin/reports" },
  { group: "Pages", title: "Audit Logs", href: "/admin/audit-logs" },
  { group: "Pages", title: "System Settings", href: "/admin/settings" },
];

const ICONS: Record<string, any> = { Pages: Layout, Courses: BookOpen, Lectures: FileText, Students: User, Users: User };

export default function GlobalSearch({ scope, placeholder, className = "" }: { scope: Scope; placeholder: string; className?: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [remote, setRemote] = useState<Result[]>([]);
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const [studentData, setStudentData] = useState<{ courses: Result[]; lectures: Result[] } | null>(null);

  // Student: load the student's courses and lecture files once, then filter locally
  useEffect(() => {
    if (scope !== "student" || !open || studentData) return;
    fetch("/api/student/lectures")
      .then((r) => r.json())
      .then((j) => {
        if (!j.courses) return;
        setStudentData({
          courses: j.courses.map((c: any) => ({ group: "Courses", title: `${c.code} ${c.title}`, href: `/student/courses/${c.id}` })),
          lectures: (j.lectures || []).map((l: any) => ({ group: "Lectures", title: l.title, hint: l.fileName, href: `/student/courses/${l.courseId}` })),
        });
      })
      .catch(() => {});
  }, [scope, open, studentData]);

  // Admin: debounced remote lookup of students and users
  useEffect(() => {
    if (scope !== "admin") return;
    const term = q.trim();
    if (term.length < 2) {
      setRemote([]);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const [s, u] = await Promise.all([
          fetch(`/api/admin/students?search=${encodeURIComponent(term)}`).then((r) => (r.ok ? r.json() : [])),
          fetch(`/api/admin/users?search=${encodeURIComponent(term)}`).then((r) => (r.ok ? r.json() : [])),
        ]);
        const studentsRes: Result[] = (Array.isArray(s) ? s : []).slice(0, 5).map((x: any) => ({ group: "Students", title: x.name, hint: x.studentId, href: `/admin/students?search=${encodeURIComponent(x.studentId)}` }));
        const usersRes: Result[] = (Array.isArray(u) ? u : []).slice(0, 5).map((x: any) => ({ group: "Users", title: x.name, hint: `${x.role} · ${x.email}`, href: `/admin/users?search=${encodeURIComponent(x.email)}` }));
        setRemote([...studentsRes, ...usersRes]);
      } catch {}
    }, 250);
    return () => clearTimeout(t);
  }, [q, scope]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    const pages = scope === "student" ? STUDENT_PAGES : ADMIN_PAGES;
    const local = scope === "student" ? [...pages, ...(studentData?.courses || []), ...(studentData?.lectures || [])] : pages;
    const hit = local.filter((r) => `${r.title} ${r.hint || ""}`.toLowerCase().includes(term)).slice(0, 8);
    return [...hit, ...remote].slice(0, 12);
  }, [q, scope, remote, studentData]);

  useEffect(() => setActive(0), [q]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const go = (r: Result) => {
    setOpen(false);
    setQ("");
    router.push(r.href);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  let lastGroup = "";
  return (
    <div ref={boxRef} className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
      <input
        type="text"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKey}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
      />
      {open && q.trim() && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 max-h-96 overflow-y-auto py-2">
          {results.length === 0 && <p className="px-4 py-6 text-center text-sm text-gray-400">No results for "{q}"</p>}
          {results.map((r, i) => {
            const header = r.group !== lastGroup ? r.group : "";
            lastGroup = r.group;
            const Icon = ICONS[r.group] || Layout;
            return (
              <React.Fragment key={`${r.group}-${r.href}-${i}`}>
                {header && <p className="px-4 pt-2 pb-1 text-[10px] font-black uppercase tracking-widest text-gray-400">{header}</p>}
                <button
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(r)}
                  className={`w-full text-left px-4 py-2 flex items-center gap-3 text-sm ${i === active ? "bg-primary/5" : ""}`}
                >
                  <Icon size={16} className="text-gray-400 shrink-0" />
                  <span className="font-bold text-gray-800 truncate">{r.title}</span>
                  {r.hint && <span className="text-xs text-gray-400 truncate">{r.hint}</span>}
                </button>
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}
