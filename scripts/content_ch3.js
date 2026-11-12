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

function getChapter3Content() {
  const content = [];

  // Chapter 3 Header
  content.push(createH1('CHAPTER 3: SYSTEM ANALYSIS AND DESIGN'));

  // 3.1
  content.push(createH2('3.1 Software Requirements Specification (SRS)'));
  content.push(
    createP(
      'Requirements engineering is the foundational phase of software engineering where stakeholder needs, institutional policies, and technical constraints are translated into precise, verifiable software specifications. The Software Requirements Specification (SRS) for SUMS was formulated following extensive interviews with academic registrars, faculty deans, department heads, bursar accounting officers, and university students.'
    )
  );

  content.push(createH3('3.1.1 Functional Requirements'));
  content.push(
    createP(
      'Functional requirements define the core operational behaviors, transactional inputs, and automated outputs the system must execute across its user roles:'
    )
  );
  content.push(
    createBullet(
      'The system shall authenticate users via encrypted POST requests, verify credentials against Bcrypt hashes, issue role-specific tamper-resistant cookies (admin_session, teacher_session, student_session), and enforce dynamic role permissions stored in the RolePermission collection.',
      'FR-01: Multi-Portal Identity & RBAC:'
    )
  );
  content.push(
    createBullet(
      'The platform shall provide full CRUD operations for academic Classes, Courses, Sections, and weekly Lecture/Lab Routines, with algorithmic conflict detection that prevents classroom and instructor double-booking.',
      'FR-02: Academic Curriculum & Routine Scheduling:'
    )
  );
  content.push(
    createBullet(
      'The system shall record daily student attendance per section, compute cumulative absenteeism percentages, evaluate compliance against institutional policies (AttendancePolicy), and trigger automatic warnings when absenteeism exceeds established thresholds.',
      'FR-03: Attendance Tracking & Policy Compliance:'
    )
  );
  content.push(
    createBullet(
      'The platform shall support batch uploading of exam marks by assigned faculty, dynamically compute semester GPAs and cumulative CGPAs based on accredited grading scales, and generate printable unofficial transcripts.',
      'FR-04: Examination & Automated Grade Sheets:'
    )
  );
  content.push(
    createBullet(
      'The system shall automatically generate customized tuition fee invoices based on student class and fee head catalogs, apply approved percentage or flat waivers, track payment statuses, and calculate daily overdue fines for late settlements.',
      'FR-05: Tuition Billing, Waivers & Overdue Fines:'
    )
  );
  content.push(
    createBullet(
      'The platform shall catalog books by ISBN, title, and author, manage physical copy counts, track 14-day borrowing lifecycles, and allow self-service loan renewals while penalizing unreturned volumes.',
      'FR-06: Digital Library Circulation Engine:'
    )
  );
  content.push(
    createBullet(
      'The system shall provide sub-second bi-directional WebSocket messaging between students and professors, course-wide announcement boards, and urgent administrative alerts.',
      'FR-07: Real-Time Communication & Notifications:'
    )
  );
  content.push(
    createBullet(
      'The platform shall manage student hostel room allocations, track campus transport fleet routes with pickup stops, and maintain institutional inventory equipment logs.',
      'FR-08: Campus Facilities & Logistics Governance:'
    )
  );
  content.push(
    createBullet(
      'Teachers shall upload lecture files (PDF, DOC, DOCX up to 4 MB) per course they teach, and students shall see and download only the files of the courses taught to their own section. Marks are entered per course and assessment (quiz, assignment, midterm, final) and CGPA is computed from the course credit hours and the active grading scale.',
      'FR-09: Teaching Materials & Per-Course Results:'
    )
  );
  content.push(
    createBullet(
      'Every public contact, application, registration and subscription form, as well as student leave and deactivation requests and password-reset requests, shall be stored as a request that administrators review, annotate, resolve, or act upon (reset password, deactivate student). Administrators shall have full create, read, update and delete control over students, staff, parents, users, hostels, fee heads and inventory.',
      'FR-10: Requests & Inquiries Management and Administrative CRUD:'
    )
  );
  content.push(
    createBullet(
      'Mobile-wallet and bank-transfer payments shall wait in a verification queue until the finance office approves or rejects them; card payments are confirmed instantly. Overdue invoices shall trigger in-app reminders, and every student shall receive personal notifications for reminders and payment results.',
      'FR-11: Payment Verification & Student Notifications:'
    )
  );
  content.push(
    createBullet(
      'The system shall provide an Assistant chatbot available to visitors and signed-in users. It answers university questions from a curated knowledge base, and answers personal questions (attendance, fees and fines, schedule, courses, borrowed books, announcements) only from the signed-in student\'s own records, in Arabic or English, using Google Gemini with a built-in offline fallback.',
      'FR-12: AI Assistant (Chatbot):'
    )
  );
  content.push(
    createBullet(
      'The platform shall support stock audits with discrepancy recording and optional stock correction, hostel bed allocation with capacity rules, live online classes with persistent in-meeting chat, global search for students and administrators, light/dark themes, and Egyptian-pound (EGP) currency across all financial screens.',
      'FR-13: Operations, Live Classes, Search & Localization:'
    )
  );

  content.push(createH3('3.1.2 Non-Functional Requirements'));
  content.push(
    createP(
      'Non-functional requirements specify the architectural qualities, security constraints, and operational criteria governing system performance and reliability:'
    )
  );
  content.push(
    createBullet(
      'The platform shall achieve initial server-rendered page load times under 800 milliseconds and sustain sub-50-millisecond latency for real-time WebSocket message dispatches under standard campus network conditions.',
      'NFR-01: Performance & Response Time:'
    )
  );
  content.push(
    createBullet(
      'All passwords must be hashed using the adaptive Bcrypt key derivation algorithm with a work factor of 10. Sessions must be encapsulated in HttpOnly, SameSite=Strict cookies to guard against XSS and CSRF exploits. Database queries must utilize parameterized Mongoose schemas to eliminate NoSQL injection risks.',
      'NFR-02: Cryptographic Security & Data Protection:'
    )
  );
  content.push(
    createBullet(
      'The database tier must maintain compound indexing on high-frequency query fields (e.g., student IDs, course sections, date ranges) to sustain efficient query execution across tens of thousands of student records without degradation.',
      'NFR-03: Horizontal Scalability & Database Indexing:'
    )
  );
  content.push(
    createBullet(
      'The web tier and WebSocket daemon must be architected as stateless processes capable of containerization and horizontal replication behind cloud load balancers, achieving 99.9% uptime throughout the academic term.',
      'NFR-04: High Availability & Fault Tolerance:'
    )
  );
  content.push(
    createBullet(
      'User interfaces must strictly adhere to W3C Web Content Accessibility Guidelines (WCAG 2.1 Level AA), providing high-contrast color palettes, keyboard navigability, and responsive layouts that adapt dynamically to mobile, tablet, and desktop screens.',
      'NFR-05: Usability & Mobile Accessibility (WCAG):'
    )
  );

  // Table 3.1
  const t31Headers = ['Module ID', 'Subsystem Name', 'Primary User Roles', 'Functional Scope & Output'];
  const t31Rows = [
    ['MOD-01', 'Authentication & RBAC', 'Admin, Teacher, Student', 'Credential verification, cookie issuance, role-permission gates'],
    ['MOD-02', 'Curriculum & Routine', 'Admin, Teacher, Student', 'Class/Course CRUD, room scheduling, routine conflict prevention'],
    ['MOD-03', 'Attendance Engine', 'Teacher, Student, Admin', 'Roll-call submission, absenteeism calculation, policy alerts'],
    ['MOD-04', 'Exam & Transcripts', 'Teacher, Student, Admin', 'Mark batch entry, automated GPA/CGPA grading, transcript PDF'],
    ['MOD-05', 'Financial Ledger', 'Admin, Student', 'Invoice creation, fee waiver approval, overdue fine ledger'],
    ['MOD-06', 'Digital Library', 'Student, Staff, Admin', 'Book cataloging, 14-day borrowing, renewal, overdue fines'],
    ['MOD-07', 'Campus Logistics', 'Admin, Staff, Student', 'Hostel room bookings, transport fleet routes & inventory logs'],
    ['MOD-08', 'Real-Time Messaging', 'All Campus Roles', 'WebSocket chat, course channels, real-time news broadcasts'],
  ];
  content.push(createStyledTable(t31Headers, t31Rows, [1400, 2400, 2400, 3000]));
  content.push(createCaption('Table 3.1: System Requirements Specification (SRS) Detailed Module Matrix'));

  // 3.2
  content.push(createH2('3.2 System Modeling & UML Diagrams'));
  content.push(
    createP(
      'The Unified Modeling Language (UML) provides the industry-standard visual vocabulary for specifying, visualizing, constructing, and documenting software systems. To establish a rigorous architectural blueprint for SUMS, this section presents four comprehensive UML diagrams: the Use Case Diagram, Activity Diagram, Sequence Diagram, and Class Diagram.'
    )
  );

  // 3.2.1 Use Case Diagram
  content.push(createH3('3.2.1 Use Case Diagram (System Interactions & Actor Scopes)'));
  content.push(
    createP(
      'The Use Case Diagram defines the behavioral boundary of the SUMS platform, illustrating the interactions between external actors and system use cases. The primary actors include:'
    )
  );
  content.push(
    createBullet(
      'Possesses unrestricted authority over the institutional ecosystem, including configuring academic curricula, managing user accounts and role permissions, overseeing fee heads and financial waivers, and reviewing campus audit logs.',
      'Administrator (Admin):'
    )
  );
  content.push(
    createBullet(
      'Conducts academic instruction, marks daily student attendance for assigned sections, uploads semester examination marks, reviews assigned teaching routines, and interacts with students via real-time chat.',
      'Faculty Member (Teacher):'
    )
  );
  content.push(
    createBullet(
      'Accesses the self-service student portal to inspect personalized lecture routines, monitor attendance compliance statistics, view semester grades and transcripts, settle tuition fee invoices, borrow library books, and communicate with instructors.',
      'Student:'
    )
  );
  content.push(
    createBullet(
      'Can browse public university portals, review academic programs, inspect campus faculties and departments, and submit formal online admission applications.',
      'Visitor / Prospective Applicant:'
    )
  );

  const ucImagePath = path.join(__dirname, '../docs/diagrams/png/uc-sums.png');
  content.push(createImageParagraph(ucImagePath, 620, 632));
  content.push(createCaption('Figure 3.1: Use Case Diagram — System Interactions & Actor Scopes'));

  // 3.2.2 Activity Diagram
  content.push(createH3('3.2.2 Activity Diagram (Operational Workflows & Decision Gateways)'));
  content.push(
    createP(
      'The Activity Diagram models the dynamic operational workflows, branching conditions, and decision gateways that govern the execution of core campus processes. Figure 3.2 illustrates the end-to-end operational flow encompassing user authentication, role-based dashboard routing, academic timetable generation with conflict validation, attendance roll-call processing against institutional policy thresholds, and financial invoice settlement.'
    )
  );
  content.push(
    createP(
      'When an administrator attempts to assign a lecture routine, the system executes an automated decision gateway that evaluates classroom availability, instructor schedule collisions, and section capacity. If a conflict is detected, the transaction is rejected with an explanatory notification; otherwise, the routine is committed and propagated to student and faculty schedules. Similarly, during attendance logging, student absenteeism is continuously aggregated against the institutional AttendancePolicy, automatically generating warning alerts if absenteeism exceeds regulatory thresholds.'
    )
  );

  const actImagePath = path.join(__dirname, '../docs/diagrams/png/act-sums.png');
  content.push(createImageParagraph(actImagePath, 470, 631));
  content.push(createCaption('Figure 3.2: Activity Diagram — Operational Workflows & Decision Gateways'));

  // 3.2.3 Sequence Diagram
  content.push(createH3('3.2.3 Sequence Diagram (End-to-End User Session Lifecycle)'));
  content.push(
    createP(
      'The Sequence Diagram details the chronological interchange of messages, function invocations, and cryptographic handshakes between system components across an active user session. As depicted in Figure 3.3, the lifecycle spans the client browser, Next.js Edge Middleware, Authentication API route handler, MongoDB database tier, and the independent Socket.io WebSocket daemon.'
    )
  );
  content.push(
    createP(
      'Upon submitting credentials, the client browser initiates an encrypted HTTPS POST request. The Next.js API handler retrieves the user document from MongoDB, validates the password hash via Bcrypt, and issues an HttpOnly session cookie containing cryptographically signed role assertions. Subsequent requests to protected routes (/admin, /teacher, /student) are validated at the edge middleware in sub-millisecond timeframes. Simultaneously, the client initializes a WebSocket connection to the Socket.io daemon, subscribing to dedicated personal and classroom channels for real-time messaging and notifications.'
    )
  );

  const seqImagePath = path.join(__dirname, '../docs/diagrams/png/seq-sums.png');
  content.push(createImageParagraph(seqImagePath, 280, 703));
  content.push(createCaption('Figure 3.3: Sequence Diagram — End-to-End User Session Lifecycle'));

  // 3.2.4 Class Diagram
  content.push(createH3('3.2.4 Class Diagram (Object-Oriented Domain Entities & Topology)'));
  content.push(
    createP(
      'The Class Diagram models the static structural topology of the SUMS platform, illustrating the domain entities, attributes, methods, and relationship cardinalities that compose the system architecture. As visualized in Figure 3.4, the domain model encapsulates the complex institutional hierarchy:'
    )
  );
  content.push(
    createBullet(
      'User serves as the foundational security entity, specializing into Student, Teacher, Staff, and Parent entities through role discriminators. Each role encapsulates specialized operational attributes.',
      'Inheritance & Role Specialization:'
    )
  );
  content.push(
    createBullet(
      'An academic Class aggregates multiple Courses; each Course is partitioned into Sections; each Section maintains weekly Routine slots linking assigned Teachers, physical Classrooms, and enrolled Students.',
      'Academic Hierarchy Composition:'
    )
  );
  content.push(
    createBullet(
      'Attendance records reference specific Section and Student entities with roll-call statuses (Present, Absent, Late), while AttendancePolicy governs institutional rules.',
      'Policy-Driven Governance:'
    )
  );
  content.push(
    createBullet(
      'Fee invoices link FeeHead categories to specific Students, applying Waiver discounts and tracking overdue Fine calculations.',
      'Financial Entity Associations:'
    )
  );
  content.push(
    createBullet(
      'Lecture files reference a Course and the uploading Teacher; Notification and StudentDocument records reference a Student; Meeting references the invited Sections; InventoryAudit items reference Inventory. Inquiry, Application and RolePermission are standalone administrative records.',
      'Teaching Materials, Requests & Operations Package:'
    )
  );

  const clsImagePath = path.join(__dirname, '../docs/diagrams/png/cls-sums.png');
  content.push(createImageParagraph(clsImagePath, 600, 565));
  content.push(createCaption('Figure 3.4: Class Diagram — Object-Oriented Domain Entities & Topology'));

  // 3.3 Data Architecture
  content.push(createH2('3.3 Data Architecture & Database Modeling (40 Collections Catalog)'));
  content.push(
    createP(
      'To achieve enterprise resilience, high write throughput, and referential consistency, SUMS utilizes MongoDB 8.x orchestrated through Mongoose Object Data Modeling (ODM). The database tier encompasses forty strictly typed collections:'
    )
  );
  content.push(
    createBullet(
      'Core user profiles, role assignments, password hashes, and active session tokens.',
      '1. User & Identity Collections (User, RolePermission):'
    )
  );
  content.push(
    createBullet(
      'Specialized profiles containing registration numbers, department affiliations, academic advisors, and parental contacts.',
      '2. Stakeholder Profiles (Student, Teacher, Parent, Staff):'
    )
  );
  content.push(
    createBullet(
      'Curriculum structure, credit hour specifications, semester allocations, and physical room schedules.',
      '3. Academic Curriculum (Class, Course, Section, Routine):'
    )
  );
  content.push(
    createBullet(
      'Daily roll-call ledgers, attendance percentage counters, and institutional compliance rule definitions.',
      '4. Attendance Subsystem (Attendance, AttendancePolicy):'
    )
  );
  content.push(
    createBullet(
      'Semester exam setups, batch mark submissions, GPA grading scales, and published academic report cards.',
      '5. Examination & Grading (Exam, Mark, Result, GradeScale, ReportCardBatch):'
    )
  );
  content.push(
    createBullet(
      'Institutional fee head catalogs, student invoices, fee waiver approvals, and late fine calculation ledgers.',
      '6. Financial Accounting (FeeHead, Fee, Waiver, Fine):'
    )
  );
  content.push(
    createBullet(
      'ISBN book catalogs, physical copy tracking, 14-day borrowing records, and return verification.',
      '7. Digital Library (Book, BookIssue):'
    )
  );
  content.push(
    createBullet(
      'Hostel room bookings, transport fleet routes and bus stops, institutional inventory assets, and academic calendar holidays.',
      '8. Campus Logistics & Infrastructure (Hostel, TransportRoute, Inventory, Holiday):'
    )
  );
  content.push(
    createBullet(
      'WebSocket chat logs, direct and group messages, institutional announcements, virtual meetings, activity audit logs, and prospective applicant submissions.',
      '9. Communication & Governance (Message, Announcement, Meeting, Activity, Alert, Application, Report):'
    )
  );
  content.push(
    createBullet(
      'Lecture files stored per course (Lecture), files a student keeps on their own profile (StudentDocument), public and portal requests reviewed by administrators (Inquiry), personal student notifications (Notification), and the inventory stock-take history and activity feed (InventoryAudit, InventoryLog).',
      '10. Teaching Materials, Requests & Operations (Lecture, StudentDocument, Inquiry, Notification, InventoryAudit, InventoryLog):'
    )
  );

  // 3.4
  content.push(createH2('3.4 Implementation Strategy & Architectural Decoupling'));
  content.push(
    createP(
      'The implementation of SUMS adheres to modern software engineering best practices, emphasizing modularity, separation of concerns, and clean architectural boundaries. The frontend and backend communicate exclusively via type-safe REST APIs and WebSocket event protocols. Server components handle compute-heavy operations (e.g., generating GPA summaries, validating schedule conflicts), while lightweight client components provide responsive, animated user feedback using Tailwind CSS and Framer Motion.'
    )
  );

  // 3.5
  content.push(createH2('3.5 Testing Strategy & Quality Assurance Matrix'));
  content.push(
    createP(
      'To guarantee that the implemented platform satisfies all functional and non-functional requirements without regressions or security vulnerabilities, a multi-tiered quality assurance strategy was executed, comprising Unit Testing, Integration Testing, Edge Security Audits, and User Acceptance Testing (UAT).'
    )
  );
  content.push(
    createP(
      'Table 3.2 details the comprehensive software verification and User Acceptance Testing matrix, documenting test scenarios, input data, expected outcomes, and observed production results.'
    )
  );

  // Table 3.2
  const t32Headers = ['Test ID', 'Subsystem & Test Scenario', 'Input Test Parameters', 'Expected System Behavior', 'Verification Status'];
  const t32Rows = [
    ['TC-01', 'Multi-Portal Authentication', 'Valid Admin email & Bcrypt password', 'Issues admin_session cookie; routes to /admin', 'PASS (Verified)'],
    ['TC-02', 'Edge Route Protection', 'Unauthenticated request to /admin/users', 'Middleware intercepts; redirects to /login', 'PASS (Verified)'],
    ['TC-03', 'Routine Conflict Detection', 'Duplicate room & time slot in routine', 'Rejects submission; returns collision error', 'PASS (Verified)'],
    ['TC-04', 'Attendance Roll-Call', 'Teacher marks 30 students in Section A', 'Commits records; updates absenteeism counters', 'PASS (Verified)'],
    ['TC-05', 'Policy Absenteeism Alert', 'Student absenteeism crosses 25% limit', 'Generates automated Alert; bars exam entry', 'PASS (Verified)'],
    ['TC-06', 'Batch Mark Calculation', 'Upload 50 course marks for CS301', 'Computes letter grades & GPA automatically', 'PASS (Verified)'],
    ['TC-07', 'Tuition Waiver Application', 'Apply 30% merit waiver to Tuition fee', 'Reduces net invoice amount; logs audit record', 'PASS (Verified)'],
    ['TC-08', 'Library Overdue Penalty', 'Return book 5 days past due date', 'Calculates late fine; updates BookIssue status', 'PASS (Verified)'],
    ['TC-09', 'Real-Time WebSocket Chat', 'Student sends message to Course room', 'Socket pushes event to clients in <40ms', 'PASS (Verified)'],
    ['TC-10', 'Mobile Layout Responsiveness', 'Render dashboard on 375px mobile viewport', 'Nav collapses to drawer; tables adapt cleanly', 'PASS (Verified)'],
  ];
  content.push(createStyledTable(t32Headers, t32Rows, [1100, 2400, 2200, 2600, 1500]));
  content.push(createCaption('Table 3.2: Comprehensive Software Verification & User Acceptance Testing (UAT)'));

  // 3.6
  content.push(createH2('3.6 System Maintenance & Deployment Lifecycle'));
  content.push(
    createP(
      'Following verification, SUMS is packaged for continuous deployment utilizing modern cloud pipelines. The application server, MongoDB database cluster, and standalone WebSocket daemon can be deployed via Docker containerization or cloud platforms (e.g., Vercel for Next.js, dedicated VPS or AWS EC2 for Socket.io and MongoDB). Database backups are automated via cron-triggered mongodump routines, while health check endpoints (/api/health) ensure round-the-clock service monitoring.'
    )
  );

  return content;
}

module.exports = {
  getChapter3Content,
};
