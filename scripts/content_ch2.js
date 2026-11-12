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
  COLOR_TERTIARY,
  COLOR_DARK
} = require('./book_helpers');

function getChapter2Content() {
  const content = [];

  // Chapter 2 Header
  content.push(createH1('CHAPTER 2: LITERATURE REVIEW'));

  // 2.1
  content.push(createH2('2.1 Introduction to Campus Enterprise Resource Planning (ERP)'));
  content.push(
    createP(
      'Higher education institutions operate as highly complex socio-technical ecosystems encompassing a wide spectrum of interconnected academic, financial, logistical, and social activities. To effectively govern such organizations, universities rely on comprehensive Enterprise Resource Planning (ERP) software and Student Information Systems (SIS). An academic ERP serves as the digital backbone of a university, coordinating student admissions, enrollment lifecycles, faculty course assignments, examination records, tuition billing, library transactions, and campus auxiliary services.'
    )
  );
  content.push(
    createP(
      'In recent years, the rapid acceleration of cloud computing, modern web application frameworks, and real-time networking protocols has fundamentally reshaped academic software architecture. Traditional ERP installations—historically dominated by monolithic, on-premises vendor suites—are increasingly viewed as cumbersome, expensive to maintain, and insufficiently responsive to the expectations of modern academic communities. This literature review critically examines the historical evolution of campus information systems, surveys the cutting-edge technological paradigms underpinning modern web platforms, and conducts an empirical comparative evaluation of leading educational platforms to contextualize the architectural innovations introduced by SUMS.'
    )
  );

  // 2.2
  content.push(createH2('2.2 The Evolutionary Trajectory of Higher Education Systems'));
  content.push(
    createP(
      'The digitization of university administration can be conceptualized across four distinct evolutionary epochs:'
    )
  );
  content.push(
    createBullet(
      'Prior to the widespread availability of microcomputers, institutional records were entirely physical. Student files, course catalogs, grade ledgers, and tuition receipts existed as paper documents stored in file cabinets. Inter-departmental coordination was mediated exclusively through manual clerical labor, physical routing slips, and postal mail, resulting in substantial delays and frequent data loss.',
      'Epoch 1: The Paper-Based & Centralized Ledger Era (Pre-1980s):'
    )
  );
  content.push(
    createBullet(
      'Universities began deploying centralized mainframe computers (e.g., IBM System/370) to automate basic registrar record-keeping and student census reporting. Access was strictly restricted to trained data processing technicians via terminal punch cards and green-screen monitors. Students and academic faculty had zero direct interaction with these systems.',
      'Epoch 2: The Mainframe & Early Computing Epoch (1980s – Mid-1990s):'
    )
  );
  content.push(
    createBullet(
      'With the advent of relational database management systems (RDBMS) like Oracle and Microsoft SQL Server, universities adopted client-server ERP suites (such as early versions of Banner and PeopleSoft). Dedicated desktop software had to be installed on university workstations across academic departments. While these systems significantly improved administrative data storage, they were notoriously rigid, required heavy licensing and on-premises server infrastructure, and offered minimal web accessibility.',
      'Epoch 3: Client-Server & Monolithic On-Premises ERPs (Late 1990s – 2010s):'
    )
  );
  content.push(
    createBullet(
      'Contemporary higher education software is defined by cloud-native, responsive web platforms built on modern full-stack frameworks (such as Next.js and React), document-oriented distributed databases (such as MongoDB), and event-driven WebSocket protocols. These systems deliver ubiquitous accessibility across mobile and desktop devices, provide role-based self-service portals, and eliminate the infrastructure overhead associated with legacy monolithic servers.',
      'Epoch 4: Cloud-Native, Real-Time Smart Campuses (2020s – Present):'
    )
  );

  // 2.3
  content.push(createH2('2.3 Smart Campus & Enterprise Information Architecture'));
  content.push(
    createP(
      'A "Smart Campus" is not merely an educational institution that utilizes computers; rather, it is an institution whose physical, digital, and human assets are deeply integrated into an intelligent, data-driven software fabric. Modern campus architectures demand seamless interoperability between several core pillars:'
    )
  );
  content.push(
    createBullet(
      'A singular, authoritative data repository that maintains consistent student, faculty, and administrative profiles across all institutional modules, preventing the emergence of conflicting shadow databases.',
      'Unified Identity & Ledger Layer:'
    )
  );
  content.push(
    createBullet(
      'Autonomous scheduling algorithms capable of ingesting course curriculum requirements, instructor availability constraints, and physical classroom seating capacities to generate conflict-free lecture schedules.',
      'Algorithmic Academic Scheduling:'
    )
  );
  content.push(
    createBullet(
      'Replacing asynchronous periodic data synchronization with persistent bi-directional WebSocket connections, enabling instant push notifications, real-time classroom discussions, and live roll-call updates.',
      'Event-Driven Real-Time Communication:'
    )
  );
  content.push(
    createBullet(
      'A dynamic security perimeter that validates user roles and module permissions at the network edge, ensuring strict operational boundaries between institutional executives, academic professors, students, and support staff.',
      'Role-Governed Access Control (RBAC):'
    )
  );

  // 2.4
  content.push(createH2('2.4 Key Technologies for Modern Campus Management'));
  content.push(
    createP(
      'Building an enterprise-scale smart university platform requires selecting technologies that balance raw computational performance, rapid developer velocity, uncompromising security, and high concurrent scalability. The SUMS platform is engineered upon the following modern technological foundations:'
    )
  );

  content.push(createH3('2.4.1 Next.js 16 App Router & React Server Components (RSC)'));
  content.push(
    createP(
      'Next.js 16 represents the state-of-the-art in modern full-stack web engineering. Its App Router leverages React Server Components (RSC), enabling complex pages—such as institutional directories, course catalogs, and administrative summaries—to be rendered entirely on the server. This architectural paradigm eliminates heavy client-side JavaScript bundles, resulting in instantaneous page rendering, optimal search indexing, and reduced memory consumption on low-end client devices.'
    )
  );

  content.push(createH3('2.4.2 React 19 Frontend Architecture'));
  content.push(
    createP(
      'React 19 introduces groundbreaking improvements in declarative user interface design, including automated state reconciliation, transition actions, and built-in hooks that streamline asynchronous data mutations. In SUMS, React 19 powers dynamic, interactive client components such as timetable drag-and-drop builders, mark batch uploading spreadsheets, and live attendance roll-call counters.'
    )
  );

  content.push(createH3('2.4.3 Real-Time WebSocket Protocols (Socket.io) vs. Traditional HTTP Polling'));
  content.push(
    createP(
      'Traditional web applications rely on periodic HTTP polling (e.g., querying the server every 5 seconds) to detect new messages or updates. This approach introduces massive network latency, generates millions of redundant HTTP requests, and degrades database performance. In contrast, Socket.io establishes a persistent, low-overhead WebSocket tunnel over TCP. Once connected, the server can push events to connected clients in sub-millisecond timeframes, enabling real-time campus messaging, live notifications, and instant attendance updates.'
    )
  );

  content.push(createH3('2.4.4 Document-Oriented NoSQL Storage (MongoDB & Mongoose)'));
  content.push(
    createP(
      'While legacy ERPs relied heavily on rigid relational databases requiring complex migrations and high-overhead joins, MongoDB offers a highly flexible, document-oriented NoSQL model. Mongoose provides an elegant Object Data Modeling (ODM) layer that enforces strict schema validation, type safety, default values, and pre-save lifecycle hooks. In SUMS, MongoDB enables complex nested document structures (such as lecture routine slots and fee waiver rules) while supporting high-performance indexed queries across thirty-three distinct collections.'
    )
  );

  content.push(createH3('2.4.5 Edge Middleware & Cryptographic Security (Bcrypt)'));
  content.push(
    createP(
      'Security in modern cloud platforms must be enforced at the periphery before requests ever reach database handlers. Next.js edge middleware intercepts incoming HTTP requests, inspecting cryptographically signed HTTP-only session cookies (`admin_session`, `teacher_session`, `student_session`). User passwords are protected using the adaptive Bcrypt key derivation function with an industry-standard salt factor of 10, rendering stored credentials impervious to dictionary and rainbow-table attacks.'
    )
  );

  // 2.5
  content.push(createH2('2.5 Strategic Benefits and Technical Challenges of Campus ERPs'));

  content.push(createH3('2.5.1 Key Strategic Benefits'));
  content.push(
    createP(
      'The comprehensive deployment of an integrated cloud campus platform yields substantial institutional benefits across multiple operational dimensions:'
    )
  );
  content.push(
    createBullet(
      'Eliminates paper-based enrollment, physical fee receipts, and manual attendance roll-sheets, saving tens of thousands of paper sheets per academic year and aligning the university with modern environmental sustainability standards.',
      'Paperless & Sustainable Campus Governance:'
    )
  );
  content.push(
    createBullet(
      'Faculty members and administrative officers are liberated from repetitive clerical tasks (e.g., calculating semester GPAs by hand, manual schedule conflict checking), allowing them to refocus on high-value academic instruction and student mentoring.',
      'Massive Operational Time Savings:'
    )
  );
  content.push(
    createBullet(
      'Provides institutional executives (Deans, Vice-Chancellors, Department Chairs) with real-time analytics on student enrollment trends, faculty teaching loads, attendance compliance, and fee collection efficiency.',
      'Executive Transparency & Data-Driven Decision Making:'
    )
  );
  content.push(
    createBullet(
      'Empowers students with round-the-clock access to course materials, grade releases, financial invoices, and library renewals directly from their personal mobile devices.',
      'Enhanced Student Engagement & Satisfaction:'
    )
  );

  content.push(createH3('2.5.2 Significant Architectural & Operational Challenges'));
  content.push(
    createP(
      'Despite the profound advantages of modern campus ERPs, system architects must address significant technical and organizational hurdles:'
    )
  );
  content.push(
    createBullet(
      'Migrating decades of historical student records, course catalogs, and financial transaction histories from heterogeneous Excel spreadsheets and legacy databases requires rigorous extract-transform-load (ETL) pipelines to guarantee zero data loss.',
      'Legacy Data Migration & Cleansing:'
    )
  );
  content.push(
    createBullet(
      'University systems experience massive traffic spikes during specific academic events, such as the initial minutes of course registration or final exam grade release days. The system architecture must scale horizontally to handle thousands of concurrent queries without crashing.',
      'Extreme Load Spikes & Concurrent Registration Surges:'
    )
  );
  content.push(
    createBullet(
      'Transitioning administrative staff from manual paper routines to digital software interfaces frequently encounters organizational inertia and resistance to change, necessitating intuitive, user-friendly UI design and comprehensive user onboarding.',
      'Human Factors & Organizational Change Management:'
    )
  );

  // 2.6
  content.push(createH2('2.6 Comparative Analysis of University Management Platforms'));
  content.push(
    createP(
      'To demonstrate the clear innovation, architectural superiority, and institutional value of SUMS, this section presents two detailed comparative evaluations. Table 2.1 contrasts the architectural and operational characteristics of traditional campus management setups against the modern cloud-native SUMS architecture. Table 2.2 benchmarks SUMS directly against leading global higher education software solutions (Ellucian Banner, Moodle LMS, Blackboard Learn, and Odoo University).'
    )
  );

  // Table 2.1
  const t21Headers = ['Operational Dimension', 'Legacy Campus Systems', 'Cloud-Native SUMS Architecture'];
  const t21Rows = [
    ['System Architecture', 'Decoupled, on-premises monolithic desktop software & paper ledgers', 'Unified cloud-native full-stack web application (Next.js 16 + React 19)'],
    ['Data Storage & Integrity', 'Fragmented Excel sheets, localized Access/SQL databases with sync delays', 'Single authoritative MongoDB database with 40 strictly typed schemas'],
    ['User Experience', 'Outdated desktop interfaces requiring local departmental installation', 'Modern, mobile-responsive, accessible web UI built with Tailwind CSS 4'],
    ['Communication Model', 'Asynchronous email, physical bulletin boards, and paper notice slips', 'Sub-second real-time WebSocket messaging (Socket.io) and instant alerts'],
    ['Attendance Tracking', 'Manual paper roll-calls entered into computers weeks later', 'Live digital roll-call with automated policy enforcement and alert triggers'],
    ['Examination & Transcripts', 'Manual grade book entry, high clerical error risk, delayed printing', 'Batch mark uploads, automated GPA/CGPA computation & instant transcripts'],
    ['Financial Governance', 'Physical bank deposit slips, manual paper receipt reconciliation', 'Automated tuition invoicing, waiver discounts & overdue fine tracking'],
    ['Infrastructure Cost', 'High capital expenditure on local servers, cooling, and maintenance', 'Low-overhead cloud deployment with edge rendering and minimal server costs'],
  ];
  content.push(createStyledTable(t21Headers, t21Rows, [2400, 3400, 3400]));
  content.push(createCaption('Table 2.1: Comparative Paradigm: Legacy Campus Management vs. Modern SUMS'));

  content.push(createP(' '));

  // Table 2.2
  const t22Headers = ['Evaluation Criteria', 'Ellucian Banner', 'Moodle LMS', 'Blackboard Learn', 'SUMS Platform'];
  const t22Rows = [
    ['Primary System Scope', 'Comprehensive Enterprise ERP', 'Learning Management (LMS)', 'Learning Management (LMS)', 'Complete Campus ERP & SIS'],
    ['Licensing & Affordability', 'Prohibitively Expensive Enterprise', 'Open-Source, High Host Cost', 'Expensive Proprietary Cloud', 'Lightweight, Zero-Cost Open Core'],
    ['Real-Time WebSockets', 'Limited / Asynchronous', 'Requires External Plugins', 'Limited Real-Time Chat', 'Native Built-In Socket.io Engine'],
    ['Attendance Policy Engine', 'Complex Batch Processing', 'Basic Roll-Call Plugin', 'Basic Attendance Tool', 'Dynamic Policy Rules & Alert Engine'],
    ['Financial & Waiver Module', 'Extensive, High Complexity', 'None (LMS Only)', 'None (LMS Only)', 'Integrated Invoicing & Waivers'],
    ['Modern UI / UX (Next.js)', 'Legacy Web Forms / Portal', 'Traditional PHP/Moodle UI', 'Proprietary Ultra UI', 'Next.js 16 + Tailwind CSS 4 UI'],
    ['Deployment Flexibility', 'Complex On-Prem / Cloud', 'LAMP / PHP Server Stack', 'Closed Proprietary Cloud', 'Universal Cloud / Docker / Node.js'],
  ];
  content.push(createStyledTable(t22Headers, t22Rows, [2000, 1850, 1850, 1850, 1850]));
  content.push(createCaption('Table 2.2: Benchmarking Evaluation: SUMS vs. Major Higher Education ERPs'));

  content.push(
    createP(
      'As evidenced by the comparative benchmarking in Table 2.2, existing commercial solutions suffer from either extreme cost and architectural complexity (e.g., Ellucian Banner) or a narrow focus limited purely to course content management while lacking financial, routine scheduling, and campus logistics capabilities (e.g., Moodle and Blackboard). SUMS effectively bridges this critical institutional gap by providing an enterprise-grade, full-spectrum university management system that combines ERP administrative governance, academic course management, and real-time campus collaboration in a single high-performance web platform.'
    )
  );

  return content;
}

module.exports = {
  getChapter2Content,
};
