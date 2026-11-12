const path = require('path');
const {
  Paragraph,
  TextRun,
  AlignmentType,
  PageBreak
} = require('docx');
const {
  createH1,
  createH2,
  createH3,
  createP,
  createBullet,
  createCaption,
  createStyledTable,
  createImageParagraph,
  FONT_BODY,
  COLOR_PRIMARY,
  COLOR_SECONDARY,
  COLOR_TERTIARY,
  COLOR_DARK
} = require('./book_helpers');

function getChapter4Content() {
  const content = [];

  // Chapter 4 Header
  content.push(createH1('CHAPTER 4: SYSTEM IMPLEMENTATION & USER INTERFACES'));

  // 4.1
  content.push(createH2('4.1 Overview of the Implemented System'));
  content.push(
    createP(
      'This chapter demonstrates the realized, fully implemented Smart University Management System (SUMS). Developed over an intensive software engineering cycle, the platform translates the architectural specifications, UML designs, and database models formulated in Chapter 3 into a living, responsive, production-ready web application. The platform provides intuitive, high-contrast, accessible interfaces for all university stakeholders, complete with sub-second page transitions, dynamic data visualizations, and real-time WebSocket connectivity.'
    )
  );

  // 4.2
  content.push(createH2('4.2 Authentication & Edge Role-Based Access Control (RBAC)'));
  content.push(
    createP(
      'Authentication in SUMS is orchestrated through a multi-portal security architecture implemented at the Next.js edge middleware layer. Rather than maintaining a single generic login screen, the system provides specialized, role-tailored authentication gateways for Administrators, Faculty Members (Teachers), and Students.'
    )
  );
  content.push(
    createP(
      'When credentials are submitted via POST /api/auth/login, the system verifies the user’s email, retrieves their cryptographic hash from MongoDB, and evaluates the password using Bcrypt. Upon successful verification, an encrypted HttpOnly session cookie is dispatched: admin_session for administrators, teacher_session for faculty members, or student_session for students. Edge middleware intercepts subsequent route transitions, inspecting cookie integrity in sub-millisecond timeframes and redirecting unauthorized requests before page rendering begins. Furthermore, fine-grained module permissions are dynamically resolved from the RolePermission collection, allowing administrators to modify permissions on the fly.'
    )
  );

  // 4.3
  content.push(createH2('4.3 Administrator Governance Control Center'));
  content.push(
    createP(
      'The Administrator Control Center is the central command hub of the university. It equips institutional executives, registrars, and deans with a comprehensive, 360-degree real-time overview of all university operations. From this portal, administrators manage student admissions, faculty appointments, class curriculum structures, financial fee heads, and system audit logs.'
    )
  );
  content.push(
    createP(
      'The dashboard incorporates interactive summary cards displaying total enrolled students, active faculty members, current semester fee collection totals, and average campus attendance compliance. Quick-action drawers enable administrators to issue campus-wide announcements, schedule university meetings, and inspect recent user login audits.'
    )
  );

  const adminImgPath = path.join(__dirname, '../public/news/news_role_dashboards_hub_1776708512717.png');
  content.push(createImageParagraph(adminImgPath, 520, 290));
  content.push(createCaption('Figure 4.1: Administrator Governance Control Center & Role Hub Interface'));

  // 4.4
  content.push(createH2('4.4 Academic Scheduling & Routine Builder'));
  content.push(
    createP(
      'The Academic Routine Builder automates one of the most challenging administrative tasks in higher education: constructing conflict-free weekly timetables. As illustrated in Figure 4.2, the interface enables administrators to assign courses, sections, instructors, physical lecture halls, and time slots across all working days of the week.'
    )
  );
  content.push(
    createP(
      'The underlying algorithm automatically validates three critical constraints in real time: (1) Classroom Overlap: verifying that no two lectures are assigned to the same physical room simultaneously, (2) Instructor Collision: ensuring a faculty member is not scheduled for concurrent lectures across different departments, and (3) Capacity Enforcement: confirming that section enrollment does not exceed classroom seating capacity. Once committed, timetables are immediately synchronized with student and teacher dashboards.'
    )
  );

  const routineImgPath = path.join(__dirname, '../public/news/news_academic_routine_1776708473756.png');
  content.push(createImageParagraph(routineImgPath, 520, 290));
  content.push(createCaption('Figure 4.2: Academic Routine & Timetable Builder Interface'));

  // 4.5
  content.push(createH2('4.5 Policy-Driven Attendance Roll-Call & Compliance Engine'));
  content.push(
    createP(
      'The Attendance Management module transforms traditional paper roll-calls into a swift, digital, policy-governed process. Instructors select their assigned class and section, displaying an interactive roll-call grid where student statuses (Present, Absent, Late) can be toggled with single clicks or set via "Mark All Present" convenience actions.'
    )
  );
  content.push(
    createP(
      'Crucially, the module is tightly integrated with the institutional AttendancePolicy engine. As attendance records are committed to MongoDB, the system recalculates each student’s cumulative attendance percentage. If a student’s absenteeism crosses the regulatory threshold (e.g., 25% absenteeism), the system automatically flags the student’s profile and dispatches automated warning alerts to both the student and the academic registrar, ensuring objective policy compliance.'
    )
  );

  const attImgPath = path.join(__dirname, '../public/news/news_attendance_system_1776708398136.png');
  content.push(createImageParagraph(attImgPath, 520, 290));
  content.push(createCaption('Figure 4.3: Policy-Driven Attendance Roll-Call & Compliance Dashboard'));

  // 4.6
  content.push(createH2('4.6 Financial Invoicing, Fee Heads & Waiver Management'));
  content.push(
    createP(
      'The Financial Management Subsystem establishes institutional transparency and accounting accuracy across all campus fiscal operations. Administrators configure custom FeeHead categories (such as Tuition, Laboratory Maintenance, Library Dues, and Student Activity Fees) and generate automated invoices for student cohorts.'
    )
  );
  content.push(
    createP(
      'As demonstrated in Figure 4.4, the platform supports customized fee waivers (e.g., academic merit discounts, athletic scholarships, financial hardship relief) applied as flat or percentage deductions. Payment transactions are recorded with unique reference IDs, automated digital receipts are generated for download, and overdue fees automatically incur daily late fines in accordance with university financial policies.'
    )
  );

  const finImgPath = path.join(__dirname, '../public/news/news_finance_portal_1776708418195.png');
  content.push(createImageParagraph(finImgPath, 520, 290));
  content.push(createCaption('Figure 4.4: Financial Ledger, Invoicing, and Fee Waiver Management Interface'));

  // 4.7
  content.push(createH2('4.7 Digital Library Circulation System'));
  content.push(
    createP(
      'The Library Management Module provides an end-to-end digital borrowing lifecycle for university students and academic scholars. Books are cataloged by ISBN, title, author, edition, and shelf classification, with real-time tracking of physical copy availability.'
    )
  );
  content.push(
    createP(
      'As illustrated in Figure 4.5, students can search the library catalog online and check out available books. The system enforces a strict 14-day borrowing lifecycle. Students can request one-click renewals from their personal dashboard before the due date, while unreturned volumes automatically accumulate overdue fines that sync directly to the student’s central financial ledger.'
    )
  );

  const libImgPath = path.join(__dirname, '../public/news/news_library_mgmt_system_1776708454384.png');
  content.push(createImageParagraph(libImgPath, 520, 290));
  content.push(createCaption('Figure 4.5: Digital Library Catalog & Book Circulation System Interface'));

  // 4.8
  content.push(createH2('4.8 Student Self-Service Portal & Real-Time Performance Analytics'));
  content.push(
    createP(
      'The Student Portal serves as the primary digital companion for enrolled learners throughout their academic journey. The portal presents a consolidated overview of personalized lecture schedules, upcoming examination dates, attendance compliance meters, and unsettled fee invoices.'
    )
  );
  content.push(
    createP(
      'Within the Results & Performance Hub (Figure 4.6), students inspect published semester marks, letter grades, and GPA breakdowns. The system provides dynamic visual analytics charting academic performance across semesters and allows students to export verified, printable unofficial academic transcripts with a single click.'
    )
  );

  const resImgPath = path.join(__dirname, '../public/students/results-hero.png');
  content.push(createImageParagraph(resImgPath, 520, 290));
  content.push(createCaption('Figure 4.6: Student Academic Portal & Examination Performance Hub'));

  // 4.9
  content.push(createH2('4.9 Sub-Second Real-Time Campus Messaging & Chat Channels'));
  content.push(
    createP(
      'To foster vibrant academic collaboration and eliminate communication barriers, SUMS integrates an independent Socket.io WebSocket daemon operating on dedicated port 3001. The WebSocket engine establishes persistent TCP connections with authenticated client sessions, supporting two primary communication paradigms:'
    )
  );
  content.push(
    createBullet(
      'Enables students to initiate private academic inquiries with their course professors, facilitating timely guidance outside formal lecture hours.',
      '1. Direct One-to-One Academic Messaging:'
    )
  );
  content.push(
    createBullet(
      'Automatically creates dedicated real-time chat rooms for each registered course section, allowing instructors to broadcast lecture materials, announce impromptu schedule adjustments, and moderate peer academic discussions.',
      '2. Section-Wide Course Discussion Rooms:'
    )
  );
  content.push(
    createP(
      'All dispatched messages are validated, sanitized to prevent script injection (XSS), and asynchronously persisted to the Message collection in MongoDB, guaranteeing complete conversation history across all client reconnects.'
    )
  );

  // 4.10
  content.push(createH2('4.10 Complete Technology Stack Breakdown & Rationale'));
  content.push(
    createP(
      'The SUMS platform is constructed upon a cohesive, battle-tested modern web engineering stack. Table 4.1 summarizes each technological tier, the specific library version deployed, and the architectural rationale justifying its selection.'
    )
  );

  // Table 4.1
  const t41Headers = ['Architectural Layer', 'Technology & Version', 'Core Purpose & Architectural Rationale'];
  const t41Rows = [
    ['Frontend Framework', 'Next.js 16 (App Router)', 'Hybrid edge rendering, Server Components (RSC), optimized build performance'],
    ['UI Component Library', 'React 19.2', 'Declarative state management, concurrent transitions, high DOM reconciliation speed'],
    ['Styling & Design System', 'Tailwind CSS 4.0', 'Utility-first styling, accessible high-contrast themes, zero CSS runtime overhead'],
    ['Motion & Animations', 'Framer Motion 12.3', 'Fluid micro-interactions, animated modal transitions, polished dashboard aesthetics'],
    ['Icons & Visual Assets', 'Lucide React', 'Modern, tree-shakeable SVG iconography maintaining lightweight client bundles'],
    ['Database Tier', 'MongoDB 8.x & Mongoose', 'Document-oriented NoSQL storage, 40 strictly typed schemas, automated indexing'],
    ['Real-Time WebSockets', 'Socket.io 4.8', 'Persistent bi-directional WebSocket daemon, room subscriptions, sub-50ms dispatches'],
    ['Edge Route Security', 'Next.js Middleware', 'Edge token interception, HttpOnly session cookie verification, RBAC enforcement'],
    ['Cryptographic Security', 'Bcrypt.js 3.0', 'Adaptive password hashing (salt=10), tamper-resistant session encryption'],
    ['Client State & Cache', 'SWR 2.4 & React Hot Toast', 'Optimistic UI mutations, stale-while-revalidate data caching, feedback toasts'],
  ];
  content.push(createStyledTable(t41Headers, t41Rows, [2000, 2400, 4400]));
  content.push(createCaption('Table 4.1: SUMS Enterprise Technology Stack Summary & Architectural Rationale'));


  // 4.11
  content.push(createH2('4.11 Teacher Portal, Lectures & Per-Course Marks'));
  content.push(
    createP(
      'The Teacher portal (/teacher) lets lecturers manage only what they teach: the weekly routine, the courses and students of their sections, attendance, marks, announcements, messaging and live meetings. The Lectures page uploads PDF, DOC or DOCX files (up to 4 MB) to a course the teacher is assigned to; students see those files on the course page, in Lectures and in Downloads, and the download endpoint verifies that the requester is the owning teacher or a student of a section that attends the course. Marks are saved per student, course and assessment (re-saving updates the same record), and the Marks & Results page, the dashboard and the profile all compute CGPA with the same credit-weighted function.'
    )
  );

  // 4.12
  content.push(createH2('4.12 Requests & Inquiries, Administrative CRUD and Global Search'));
  content.push(
    createP(
      'A single Inquiry collection stores every contact, application, registration, subscription, leave, deactivation and password-reset request raised from the public site or the portals. Administrators review them in Requests & Inquiries, change the status, add internal notes, reset a password or deactivate a student directly from the request, and receive new requests in the header notification bell. Students, staff, parents, users, hostels, fee heads and inventory items have view, add, edit and delete dialogs backed by admin-only API routes; the header search finds portal pages, courses and lecture files for students, and pages, students and users for administrators.'
    )
  );

  // 4.13
  content.push(createH2('4.13 Payment Verification, Notifications and Inventory Audit'));
  content.push(
    createP(
      'Card payments are confirmed immediately, while Vodafone Cash, Fawry and bank-transfer payments enter a verification queue: the student sees them as Under Review, the finance office approves or rejects them from the Payments page, and the student receives a personal notification either way. Overdue invoices can be reminded in one click, with at most one reminder per student per day. The inventory module records stock audits (expected versus counted quantity, differences, optional correction) and keeps an activity feed; asset value is computed from unit prices in Egyptian pounds. Hostel allocation validates capacity and moves a student between hostels.'
    )
  );

  // 4.14
  content.push(createH2('4.14 SUMS Assistant (Chatbot)'));
  content.push(
    createP(
      'The floating assistant is available on the public site and the student and teacher portals. A server route builds a system prompt from a curated knowledge base (admission, scholarships, library hours, halls, transport, insurance, calendar, contact, portal how-tos) and, for a signed-in student, that student\'s own attendance, dues, schedule, courses, books and announcements read directly from the database. Replies are produced by Google Gemini (configured by environment variables) and fall back to deterministic rule-based answers when the service is unavailable, so the chat never fails. Visitors asking personal questions are asked to sign in.'
    )
  );

  return content;
}

module.exports = {
  getChapter4Content,
};
