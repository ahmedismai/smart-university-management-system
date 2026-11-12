/**
 * Facts about the university taken from the public pages of this site.
 * Used both as the knowledge given to Claude and by the offline keyword fallback.
 */
export type KnowledgeEntry = {
  id: string;
  /** lower-case words / phrases (English + Arabic) that trigger the entry in the offline fallback */
  keywords: string[];
  title: string;
  answer: string;
};

export const KNOWLEDGE: KnowledgeEntry[] = [
  {
    id: "admission",
    keywords: ["admission", "apply", "application", "admit", "تقديم", "قبول", "التقديم", "القبول", "ادخل الجامعة"],
    title: "Undergraduate admission",
    answer:
      "Undergraduate admission is open for 2026. Fall intake starts Aug 15, 2026 and the application deadline is Nov 30, 2026. Requirements: minimum GPA 3.5 (or equivalent) in high-school graduation with proficiency in the core subjects of the chosen major, plus official transcripts, a Statement of Purpose, letters of recommendation and proof of high-school completion. Steps: check requirements, submit the online application at /admission/apply, then review and a possible interview. The centralized undergraduate admission test for the Fall session is on Jul 5, 2026.",
  },
  {
    id: "scholarship",
    keywords: ["scholarship", "financial aid", "waiver", "منحة", "منح", "مساعدات مالية", "اعفاء"],
    title: "Scholarships",
    answer:
      "The university offers Academic Excellence, Research Fellowships, International Talent and Social Impact scholarships. The process has an Early Decision cycle, a Main Scholarship window, review and interviews, and a final award notification. A scholarship estimator and the aid guide are on /admission/scholarships. Fee waivers are also handled by the administration.",
  },
  {
    id: "library",
    keywords: ["library", "book", "borrow", "مكتبة", "كتب", "كتاب", "استعارة"],
    title: "Library",
    answer:
      "The Central Library holds over 800,000 volumes across 6 floors, with Science & Tech, Executive Business and Jurisprudence libraries and 24/7 digital access. Opening hours: Sunday-Wednesday 08:00 AM-10:00 PM, Thursday 08:00 AM-08:00 PM, Saturday 10:00 AM-05:00 PM (during exams some wings stay open 24/7). Students borrow and renew books from the Library page of the student portal (maximum 5 active loans).",
  },
  {
    id: "hall",
    keywords: ["hall", "hostel", "dorm", "residence", "accommodation", "housing", "سكن", "المدينة الجامعية", "اقامة", "إقامة"],
    title: "Halls of residence",
    answer:
      "There are 10 halls (male and female) with high-speed Wi-Fi, 24/7 security, dining services, laundry, common rooms and a 24/7 medical center. First-year students and those living furthest from campus get priority. Apply from /students/halls. Residential support: housing@nextgen.edu.bd, +880 1234-567890, Admin Building, First Floor, Room 204, 09:00 AM-05:00 PM.",
  },
  {
    id: "transport",
    keywords: ["transport", "bus", "shuttle", "pass", "مواصلات", "باص", "اتوبيس", "أتوبيس"],
    title: "Transport",
    answer:
      "NextGen Transit runs Campus Express (North-South campus), City Link (to City Central terminal), Residential Loop and a Night Shuttle for library and lab students. All full-time students are eligible for a universal transport pass: apply online or visit the transport office in the Main Admin Wing. Lost pass: +880 1622 333 444 (Zone B, Entry 3).",
  },
  {
    id: "health",
    keywords: ["health", "insurance", "medical", "hospital", "doctor", "تأمين", "تامين", "صحي", "مستشفى", "طبيب"],
    title: "Health insurance",
    answer:
      "Students get health coverage: in-patient (IPD), out-patient (OPD), essential medicines and an annual dental & vision allowance, with a cashless process at partner hospitals. Emergency hotline +880 1622 000 999, insurance support +880 1622 111 222, Campus North Wing ground floor, Sun-Thu 8:00 AM-8:00 PM.",
  },
  {
    id: "calendar",
    keywords: ["calendar", "exam", "midterm", "final", "semester", "holiday", "orientation", "امتحان", "امتحانات", "ميعاد", "موعد", "اجازة", "إجازة", "تقويم"],
    title: "Academic calendar (2026)",
    answer:
      "Key dates: Jan 15 orientation; Jan 18 classes begin; Mar 10-20 mid-term examinations; May 15-30 final examinations; Aug 1 Fall orientation; Aug 3 Fall classes start. Public holidays include Jan 25 (Revolution & Police Day), Apr 25 (Sinai Liberation Day), May 1 (Labour Day) and Oct 6 (Armed Forces Day). Dates may change with government notifications or syndicate decisions, so check notices. Full calendar: /academics/academic-calendar.",
  },
  {
    id: "contact",
    keywords: ["contact", "phone", "email", "address", "location", "where", "registrar", "تواصل", "اتصال", "رقم", "عنوان", "ايميل", "إيميل", "فين"],
    title: "Contact",
    answer:
      "NextGen University of Bangladesh is at Gulshan-2 Academic Block, Dhaka 1212, Bangladesh. Registrar's office: registrar@nextgen.university. You can also send a message through any Contact form on the site, or use /feedback.",
  },
  {
    id: "login",
    keywords: ["login", "log in", "sign in", "password", "forgot", "reset", "تسجيل الدخول", "دخول", "كلمة السر", "كلمة المرور", "الباسورد", "باسورد", "نسيت"],
    title: "Login and password",
    answer:
      "Students sign in at /login/student with their student ID (e.g. CSE2024001) and password; teachers and admins sign in at /login/employee. If you forgot your password, send a request at /forgot-password and the administration will reset it. After signing in, students can change the password in Settings > Security.",
  },
  {
    id: "portal",
    keywords: ["portal", "dashboard", "features", "what can", "how do i", "البوابة", "ازاي", "إزاي", "كيف", "اعمل ايه"],
    title: "Student portal",
    answer:
      "The student portal has: Dashboard, My Profile (with documents and a printable ID card), Attendance (with leave requests), Marks & Results, Fees & Payment, Courses (each course shows lectures and its schedule), Lectures, Class Routine, Library, Announcements, Messaging with teachers, Online Classes (live meetings), Downloads and Settings.",
  },
  {
    id: "leave",
    keywords: ["leave", "absence", "excuse", "اجازة", "إجازة", "غياب", "اعتذار"],
    title: "Leave request",
    answer:
      "Students request leave from the Attendance page: press Apply for Leave, choose the dates and write the reason. The request goes to the administration, which reviews it.",
  },
  {
    id: "fees",
    keywords: ["fee", "fees", "tuition", "payment", "pay", "invoice", "مصاريف", "رسوم", "دفع", "سداد", "فلوس"],
    title: "Fees and payment",
    answer:
      "Fees are paid from Fees & Payment in the student portal (mobile wallet or card), which shows upcoming dues, deadlines and the payment history with transaction IDs. Waivers and fines are managed by the finance office.",
  },
  {
    id: "lectures",
    keywords: ["lecture", "material", "slides", "pdf", "download", "محاضرة", "محاضرات", "ملف", "ملفات", "تحميل", "مذكرة"],
    title: "Lectures and course files",
    answer:
      "Teachers upload lecture files (PDF, DOC, DOCX up to 4 MB) per course. Students find them under Lectures, Downloads, or inside each course page in Courses, and can download them. You only see the courses of your own section.",
  },
  {
    id: "online-class",
    keywords: ["online class", "meeting", "live", "video", "zoom", "اونلاين", "أونلاين", "بث", "لايف", "ميتنج"],
    title: "Online classes",
    answer:
      "Live classes run from Online Classes in the student portal: teachers start a meeting for their sections and students join it with video and chat. If you are on a different network from the teacher, a TURN server may be required.",
  },
  {
    id: "clubs",
    keywords: ["club", "activity", "union", "events", "نادي", "انشطة", "أنشطة", "فعاليات"],
    title: "Clubs and events",
    answer:
      "Student life includes clubs (see /students/clubs), the student union (/quick-links/student-union) and campus events (/quick-links/events). Club registration is online.",
  },
];

export const SUGGESTIONS_EN = ["What is my attendance?", "Do I have any fees due?", "How do I apply for admission?", "Library opening hours"];
export const SUGGESTIONS_AR = ["حضوري عامل ازاي؟", "عليّ مصاريف؟", "ازاي أقدّم في الجامعة؟", "مواعيد المكتبة"];
