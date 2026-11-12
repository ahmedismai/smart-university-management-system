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
  FONT_BODY,
  COLOR_PRIMARY,
  COLOR_SECONDARY,
  COLOR_DARK
} = require('./book_helpers');

function getChapter1Content() {
  const content = [];

  // Chapter 1 Header
  content.push(createH1('CHAPTER 1: GENERAL INTRODUCTION'));

  // 1.1
  content.push(createH2('1.1 The Evolving Landscape of Higher Education Administration'));
  content.push(
    createP(
      'The twenty-first century has witnessed a profound paradigm shift in higher education management. Historically, colleges and universities functioned as decentralized administrative clusters where individual departments—such as academic admissions, student affairs, academic faculties, libraries, student housing, and the bursar’s office—operated autonomous, paper-bound accounting and filing systems. In such environments, information exchange was fundamentally sluggish, dependent on physical paper memos, manual registrar verification stamps, and localized spreadsheet files.'
    )
  );
  content.push(
    createP(
      'As university student populations expanded rapidly from hundreds into tens of thousands of active scholars, the operational inadequacy of legacy administrative architectures became unmistakably glaring. Modern educational institutions are no longer judged solely on the intellectual caliber of their faculty, but equally on their operational efficiency, digital transparency, data integrity, and round-the-clock service availability. Today’s digital-native students, faculty scholars, and institutional executives expect instant, ubiquitous access to grades, real-time timetable adjustments, immediate fee invoicing, seamless library transactions, and live academic communication from any device.'
    )
  );
  content.push(
    createP(
      'Consequently, leading universities across the globe are accelerating their digital transformation initiatives by migrating away from fragmented off-the-shelf software tools toward centralized, cloud-native Enterprise Resource Planning (ERP) platforms. The evolution from manual paper ledgers to integrated smart campuses represents a critical institutional milestone that eliminates operational friction, minimizes human error, and establishes an authoritative, single source of truth across the university.'
    )
  );

  // 1.2
  content.push(createH2('1.2 The Imperative for Smart University Management Systems'));
  content.push(
    createP(
      'The operational necessity of deploying a comprehensive, unified Smart University Management System (SUMS) stems from multiple compelling institutional imperatives:'
    )
  );
  content.push(
    createBullet(
      'Traditional campus administration relies on disjointed systems for admissions, fees, grading, and timetables. A unified platform consolidates all relational records into a single indexed database, eliminating conflicting student profiles and inconsistent registrar records.',
      '1. Data Centralization & Institutional Truth:'
    )
  );
  content.push(
    createBullet(
      'Manual paperwork, paper-based routine distribution, and physical cash collection at bank counters impose massive overhead on university staff. Digital automation reduces processing times from days or weeks to mere seconds.',
      '2. Eradication of Bureaucratic Overhead:'
    )
  );
  content.push(
    createBullet(
      'Paper receipts and physical ledgers are notoriously susceptible to clerical inaccuracies, delayed accounting audits, and lost revenue. An automated billing engine guarantees immutable transaction audit trails, transparent waiver allocation, and automated overdue penalty calculation.',
      '3. Financial Integrity & Real-Time Governance:'
    )
  );
  content.push(
    createBullet(
      'Traditional email broadcasts and bulletin board flyers fail to reach modern students in time. A smart campus requires bi-directional, sub-second WebSocket communication for urgent administrative notifications, lecture cancellations, and direct faculty guidance.',
      '4. Sub-Second Real-Time Campus Collaboration:'
    )
  );
  content.push(
    createBullet(
      'Students require on-demand self-service access to attendance statistics, upcoming exams, unofficial transcripts, fee slips, and library borrowing status without standing in long administrative queues.',
      '5. High-Availability Student Self-Service:'
    )
  );

  // 1.3
  content.push(createH2('1.3 Problem Definition: Operational Inefficiencies in Contemporary Campuses'));
  content.push(
    createP(
      'Despite widespread awareness of digital tools, a critical empirical evaluation of prevailing administrative setups across many higher education institutions, particularly within developing nations and regional institutes, reveals severe operational bottlenecks:'
    )
  );
  content.push(
    createP(
      'Problem 1: Fragmented and Incompatible Software Silos. Most universities employ separate, disconnected applications for different functions: an off-the-shelf accounting tool for the bursar, a standalone forum for student discussions, a local desktop database for the library, and paper logbooks for attendance. None of these systems communicate with each other, forcing staff to repeatedly re-enter student information across multiple applications, leading to severe discrepancies and high administrative strain.'
    )
  );
  content.push(
    createP(
      'Problem 2: Paper-Dependent Attendance Roll-Calls and Lack of Policy Enforcement. In traditional lecture halls, attendance is recorded manually on paper roll-sheets. These sheets are prone to physical loss, unauthorized peer sign-ins, and delayed data entry. Institutional attendance policies (e.g., barring students with attendance below 75% from taking final examinations) cannot be enforced objectively in real time, as faculty only discover chronic absenteeism weeks after the semester ends.'
    )
  );
  content.push(
    createP(
      'Problem 3: Inefficient Examination Processing and Delayed Transcripts. Faculty members often compute student grades in disparate Excel spreadsheets before submitting them to an examinations committee. This introduces severe latency into final grade dissemination, increases the likelihood of grade calculation errors, and causes severe administrative backlogs during transcript printing and graduation clearance.'
    )
  );
  content.push(
    createP(
      'Problem 4: Opaque Tuition Billing and Inflexible Financial Tracking. The absence of automated tuition invoicing creates friction between students and the bursar’s office. Students lack transparency regarding mandatory fees, installment deadlines, late penalties, and approved waiver discounts. Manual fee reconciliation requires physical receipt checks, leading to accounting errors and delayed reconciliations.'
    )
  );
  content.push(
    createP(
      'Problem 5: Absence of Real-Time Communication Channels. Faculty-student communication is predominantly confined to physical office hours or crowded public email channels. Crucial updates regarding laboratory schedules, makeup lectures, and course materials are frequently missed, degrading academic collaboration and community engagement.'
    )
  );

  // 1.4
  content.push(createH2('1.4 Proposed Solution: The Smart University Management System (SUMS)'));
  content.push(
    createP(
      'To systematically resolve every bottleneck identified above, this project introduces the Smart University Management System (SUMS). SUMS is an all-inclusive, cloud-native web platform engineered to digitize, unify, and automate every facet of the higher education lifecycle. The system provides role-tailored dashboards and distinct access controls for Administrators, Faculty Members, Students, Staff, and Parents, all governed by edge middleware security.'
    )
  );
  content.push(
    createP(
      'Key architectural highlights and subsystems of the proposed SUMS platform include:'
    )
  );
  content.push(
    createBullet(
      'Next.js 16 App Router combined with React Server Components (RSC) to deliver lightning-fast initial page loads, optimal search visibility, and zero unnecessary client JavaScript overhead.',
      'High-Performance Web Architecture:'
    )
  );
  content.push(
    createBullet(
      'A dedicated standalone Node.js WebSocket engine that powers instant, bi-directional direct messaging, course-wide discussions, and automated system alerts without requiring page polling or manual refreshing.',
      'Real-Time WebSocket Engine:'
    )
  );
  content.push(
    createBullet(
      'An enterprise MongoDB document database with thirty-three strictly typed Mongoose schemas, providing high horizontal scalability, flexible document modeling, and indexed referential integrity across all academic entities.',
      'Robust NoSQL Data Tier:'
    )
  );
  content.push(
    createBullet(
      'Automated conflict detection algorithms that prevent classroom double-bookings, instructor schedule overlaps, and section capacity overflows during weekly lecture timetable construction.',
      'Collision-Free Routine Builder:'
    )
  );
  content.push(
    createBullet(
      'Dynamic GPA/CGPA computation, automated semester mark batch uploads, and real-time unofficial transcript generation adhering to accredited higher education grading scales.',
      'Automated Examination & Transcript Hub:'
    )
  );
  content.push(
    createBullet(
      'End-to-end fee structure cataloging, automated student invoice generation, partial fee waiver discounting, and real-time fine calculation for overdue payments.',
      'Transparent Financial Ledger:'
    )
  );
  content.push(
    createBullet(
      'ISBN cataloging, copy barcode tracking, 14-day loan lifecycle enforcement, automated fine calculation for late book returns, and instant self-service book renewal.',
      'Integrated Digital Library System:'
    )
  );

  // 1.5
  content.push(createH2('1.5 Aim and Objectives: Comprehensive Engineering Roadmap'));
  content.push(
    createP(
      'The overarching aim of this graduation project is to conceptualize, design, develop, test, and document a production-ready, cloud-native Smart University Management System that streamlines academic, administrative, and financial workflows into a unified, secure web ecosystem.'
    )
  );
  content.push(
    createP(
      'To accomplish this primary aim, the engineering process was divided into six specific, measurable, and achievable objectives:'
    )
  );
  content.push(
    createBullet(
      'Conduct an in-depth analysis of legacy university administrative processes and contemporary higher education ERPs to formulate an exhaustive Software Requirements Specification (SRS) covering all institutional stakeholder roles.',
      'Objective 1 (Requirements Elicitation & Analysis):'
    )
  );
  content.push(
    createBullet(
      'Construct a comprehensive suite of formal Unified Modeling Language (UML) diagrams—including Use Case, Activity, Sequence, and Class diagrams—alongside a normalized, indexed MongoDB data model comprising 33 entity collections.',
      'Objective 2 (Architectural Modeling & Design):'
    )
  );
  content.push(
    createBullet(
      'Build a modern, responsive, and accessible user interface using Next.js 16, React 19, and Tailwind CSS 4.0, featuring dedicated, edge-protected portals for Administrators, Faculty, and Students.',
      'Objective 3 (Frontend Engineering & Responsive UI):'
    )
  );
  content.push(
    createBullet(
      'Develop robust Next.js REST API route handlers coupled with an independent Socket.io WebSocket service to achieve sub-second real-time messaging, attendance roll-calls, and live institutional announcements.',
      'Objective 4 (Backend API & Real-Time Engine):'
    )
  );
  content.push(
    createBullet(
      'Implement mission-critical campus business modules, including collision-free routine generation, policy-driven attendance tracking, automated grade calculation, tuition invoicing with waiver rules, and digital library borrowing.',
      'Objective 5 (Subsystem Implementation & Business Logic):'
    )
  );
  content.push(
    createBullet(
      'Subject the completed platform to rigorous verification, integration, security (RBAC edge penetration and password hashing), and User Acceptance Testing (UAT) to guarantee enterprise dependability, safety, and scalability.',
      'Objective 6 (Quality Assurance & Validation):'
    )
  );

  // 1.6
  content.push(createH2('1.6 Challenges and Constraints: Navigating System Complexities'));
  content.push(
    createP(
      'Developing an enterprise campus management system of this magnitude involved navigating several formidable engineering challenges and environmental constraints:'
    )
  );
  content.push(
    createBullet(
      'A university campus features intricate relationships where classes contain courses, courses have sections, sections have routines and enrolled students, and routines assign specific teachers and physical rooms. Preventing race conditions and maintaining referential integrity in a NoSQL database without foreign key constraints required strict Mongoose middleware hooks and validation logic.',
      '1. High Relational Complexity in a Document Store:'
    )
  );
  content.push(
    createBullet(
      'Managing multiple distinct user roles (Administrators with full privileges, Teachers who can only modify marks/attendance for their assigned classes, and Students who must only view their own records) demanded strict edge-level session verification and robust middleware access gates to prevent unauthorized privilege escalation.',
      '2. Multi-Portal Session Isolation & Security:'
    )
  );
  content.push(
    createBullet(
      'Running a real-time WebSocket server alongside Next.js Server Components required decoupling the HTTP request-response cycle from the stateful WebSocket event bus, ensuring reliable event delivery, connection re-establishment, and message persistence in MongoDB without memory leaks.',
      '3. Real-Time Concurrency & WebSocket Management:'
    )
  );
  content.push(
    createBullet(
      'Higher education portals must remain accessible across diverse hardware, ranging from high-resolution administrator desktop monitors down to budget mobile smartphones utilized by students on cellular networks. Ensuring full WCAG 2.1 compliance and responsive UI layouts required careful design systems.',
      '4. Device Heterogeneity & Accessibility (WCAG):'
    )
  );

  // 1.7
  content.push(createH2('1.7 Project Timeline and Phase Milestones'));
  content.push(
    createP(
      'The development of SUMS was conducted over an intensive nine-month engineering lifecycle spanning from October 2025 to June 2026. The project followed an Agile-Iterative methodology organized into six distinct phases. Table 1.1 delineates the project development timeline, phase activities, and key deliverables.'
    )
  );

  // Table 1.1
  const timelineHeaders = ['Phase', 'Lifecycle Stage & Key Activities', 'Duration', 'Key Deliverables'];
  const timelineRows = [
    ['Phase 1', 'Requirements Elicitation, Stakeholder Interviews & Feasibility Study', 'Oct – Nov 2025', 'Approved SRS Document & Functional Scope Matrix'],
    ['Phase 2', 'System Analysis, UML Architecture Modeling & MongoDB Schema Design', 'Nov – Dec 2025', 'Complete UML Diagrams Suite & 40 Mongoose Schemas'],
    ['Phase 3', 'Core Architecture Setup, Edge Authentication & Multi-Portal UI Layout', 'Jan – Feb 2026', 'Next.js 16 Base Scaffold, Edge Middleware & Auth'],
    ['Phase 4', 'Academic, Attendance, Exam & Financial Subsystem Implementation', 'Feb – Apr 2026', 'Routine Builder, Exam Marks Hub & Tuition Ledger'],
    ['Phase 5', 'Real-Time Socket.io Server, Library Module & Notifications Engine', 'Apr – May 2026', 'Live Messaging Bus, Library Loan System & News'],
    ['Phase 6', 'Comprehensive Testing (Unit, Integration, UAT), Optimization & Thesis', 'May – Jun 2026', 'Quality Assurance Report & Graduation Project Book'],
  ];
  content.push(createStyledTable(timelineHeaders, timelineRows, [1400, 3800, 1400, 2600]));
  content.push(createCaption('Table 1.1: Project Development Timeline, Phases, and Milestone Allocations'));

  // 1.8
  content.push(createH2('1.8 Documentation Overview: A Structured Approach to Project Narrative'));
  content.push(
    createP(
      'This graduation project book is systematically organized into five comprehensive academic chapters that chronicle the complete journey from initial concept to production software deployment:'
    )
  );
  content.push(
    createP(
      'Chapter 1 (General Introduction) establishes the foundational motivation for the project, analyzes the evolving landscape of higher education management, defines the problem space and the proposed SUMS solution, and articulates measurable engineering objectives alongside project constraints and timeline.'
    )
  );
  content.push(
    createP(
      'Chapter 2 (Literature Review) presents an exhaustive, critically analytical exploration of existing campus management architectures, traces the evolutionary trajectory of university ERPs, examines modern web technologies (Next.js, React, WebSockets, NoSQL), and provides a comprehensive comparative analysis benchmarking SUMS against existing systems.'
    )
  );
  content.push(
    createP(
      'Chapter 3 (System Analysis and Design) details the complete requirements engineering process, provides the full suite of formal UML diagrams (Use Case, Activity, Sequence, and Class diagrams), analyzes the 33-collection MongoDB database schema, and defines implementation, testing, and maintenance strategies.'
    )
  );
  content.push(
    createP(
      'Chapter 4 (System Implementation) showcases the fully deployed SUMS platform through detailed user interface walkthroughs, explanations of key functional subsystems (Governance, Scheduling, Attendance, Finance, Library, Messaging), and an in-depth breakdown of the underlying technology stack.'
    )
  );
  content.push(
    createP(
      'Chapter 5 (Conclusion and Future Work) summarizes the core technical contributions and achievements of the project, reflects on institutional impact, and outlines strategic future enhancements including mobile applications, artificial intelligence advising, and IoT smart campus integration.'
    )
  );

  return content;
}

module.exports = {
  getChapter1Content,
};
