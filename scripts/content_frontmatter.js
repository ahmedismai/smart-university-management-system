const {
  Paragraph,
  TextRun,
  AlignmentType,
  PageBreak
} = require('docx');
const {
  createTitle,
  createSubtitle,
  createH1,
  createP,
  createCaption,
  createStyledTable,
  FONT_BODY,
  COLOR_PRIMARY,
  COLOR_SECONDARY,
  COLOR_DARK
} = require('./book_helpers');

function getTitlePageSection() {
  return {
    properties: {
      page: {
        margin: { top: 1440, bottom: 1440, left: 1800, right: 1440 }
      }
    },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 180, after: 80 },
        children: [
          new TextRun({
            text: 'THEBES HIGHER INSTITUTE FOR COMPUTER & ADMINISTRATIVE SCIENCES',
            font: FONT_BODY,
            size: 26,
            bold: true,
            color: COLOR_PRIMARY,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 60, after: 240 },
        children: [
          new TextRun({
            text: 'DEPARTMENT OF COMPUTER SCIENCE\nACADEMIC YEAR 2026 / 2027',
            font: FONT_BODY,
            size: 22,
            bold: true,
            color: '475569',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 500, after: 120 },
        children: [
          new TextRun({
            text: 'Smart University Management System (SUMS)',
            font: FONT_BODY,
            size: 46, // 23pt
            bold: true,
            color: COLOR_PRIMARY,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 60, after: 500 },
        children: [
          new TextRun({
            text: 'A Cloud-Native, Real-Time Campus Enterprise Management & Governance Platform',
            font: FONT_BODY,
            size: 26,
            italics: true,
            color: COLOR_SECONDARY,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 240, after: 120 },
        children: [
          new TextRun({
            text: 'A Graduation Project Submitted in Partial Fulfillment of the Requirements for the Degree of Bachelor of Science in Computer Science',
            font: FONT_BODY,
            size: 22,
            italics: true,
            color: '64748B',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 400, after: 140 },
        children: [
          new TextRun({
            text: 'Prepared By:',
            font: FONT_BODY,
            size: 26,
            bold: true,
            color: COLOR_PRIMARY,
          }),
        ],
      }),
      // Students List Table / Formatting
      createStyledTable(
        ['Student Full Name', 'Seat / Academic ID'],
        [
          ['Abdallah Mohamed Abdelkhalek', '202320102'],
          ['Mosab El Sayed Abdelghafar', '202320005'],
          ['Mohamed Magdy Abdelady', '202320378'],
          ['Seif El Din Ayman Abdallah', '202320096'],
          ['Mohamed Mahmoud Ramadan', '202320073'],
          ['Reham Talaat', '202320137'],
        ],
        [4800, 3600]
      ),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 450, after: 100 },
        children: [
          new TextRun({
            text: 'Supervised By:',
            font: FONT_BODY,
            size: 26,
            bold: true,
            color: COLOR_PRIMARY,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 60, after: 360 },
        children: [
          new TextRun({
            text: 'Dr. Milad',
            font: FONT_BODY,
            size: 28,
            bold: true,
            color: COLOR_DARK,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 180, after: 60 },
        children: [
          new TextRun({
            text: 'Cairo, Egypt — June 2026',
            font: FONT_BODY,
            size: 22,
            bold: true,
            color: '475569',
          }),
        ],
      }),
    ],
  };
}

function getAbstractSection() {
  return [
    createH1('ABSTRACT'),
    createP(
      'Higher education institutions worldwide are confronting acute operational challenges arising from fragmented software ecosystems, paper-dependent administrative workflows, and disjointed communication channels. Traditional university setups rely on legacy, decoupled systems where student admissions, course scheduling, attendance roll-calls, examinations, financial fee ledgers, and campus library borrowing operate in segregated silos. This fragmentation introduces substantial latency into institutional governance, increases clerical overhead, compromises data consistency, and severely diminishes the overall student and faculty academic experience.'
    ),
    createP(
      'To systematically solve these institutional bottlenecks, this graduation project presents the design, architectural formulation, and production implementation of the Smart University Management System (SUMS). SUMS is an enterprise-grade, cloud-native higher education Enterprise Resource Planning (ERP) platform developed from the ground up to unify all academic, administrative, financial, and extracurricular operations into a single cohesive, high-performance ecosystem.'
    ),
    createP(
      'Architecturally, the platform is engineered upon a modern, decoupled full-stack stack leveraging Next.js 16 (App Router) and React 19 for high-speed edge rendering, Tailwind CSS 4.0 for accessible, responsive interface design, and MongoDB 8.x orchestrated through Mongoose Object Data Modeling (ODM) with forty strictly typed relational and transactional schemas. To eliminate the asynchronous communication barrier inherent in traditional academic portals, SUMS incorporates a dedicated, standalone Node.js Socket.io WebSocket server running on an independent event bus. This architecture delivers sub-second, bi-directional real-time communication for direct student-faculty messaging, course discussion channels, automated grade release notifications, and critical institutional alerts.'
    ),
    createP(
      'The platform enforces rigorous Role-Based Access Control (RBAC) governed by edge middleware, providing custom-tailored dashboards and secure portals for Administrators, Faculty Members, Students, Staff, and Parents. Key subsystems comprehensively implemented and verified include: (1) dynamic academic curriculum and collision-free routine scheduling, (2) policy-driven attendance tracking with automatic absenteeism alerts, (3) batch examination marking, GPA/CGPA computation, and dynamic transcript compilation, (4) transparent tuition invoicing, waiver adjustments, and overdue fine management, (5) digital library cataloging and borrowing lifecycle controls, and (6) campus logistics governance including hostel allocations and transport fleet tracking.'
    ),
    createP(
      'The complete software engineering lifecycle is rigorously documented herein, including comprehensive Software Requirements Specifications (SRS), formal Unified Modeling Language (UML) diagrams—Use Case, Activity, Sequence, and Class diagrams—database normalization schemas, extensive verification and User Acceptance Testing (UAT) matrices, and strategic roadmaps for future cloud scaling and artificial intelligence integration.'
    ),
    new Paragraph({ children: [new PageBreak()] }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 360, after: 180 },
      children: [
        new TextRun({
          text: 'المستخلص التنفيذي باللغة العربية (Arabic Abstract)',
          font: FONT_BODY,
          size: 32,
          bold: true,
          color: COLOR_PRIMARY,
        }),
      ],
    }),
    createP(
      'تواجه مؤسسات التعليم العالي والجامعات في العصر الحالي تحديات تشغيلية وإدارية بالغة التعقيد، تنجم في المقام الأول عن تشتت الأنظمة البرمجية المستقلة، والاعتماد على السجلات الورقية التقليدية، وانعدام قنوات التواصل اللحظي الموحدة بين أعضاء هيئة التدريس والطلاب وإدارة الجامعة. يقدم هذا المشروع حلاً هندسياً شاملاً من خلال تصميم وتطوير "نظام إدارة الجامعة الذكية" (Smart University Management System - SUMS)، وهو نظام سحابي متكامل لتخطيط موارد المؤسسات التعليمية (Higher Education ERP) تم بناؤه لرقمنة وتوحيد كافة العمليات الأكاديمية والمالية والإدارية والخدمية في منصة رقمية موحدة وعالية الأداء.',
      { alignment: AlignmentType.RIGHT }
    ),
    createP(
      'يعتمد النظام معمارية برمجية حديثة قائمة على إطار العمل Next.js 16 (App Router) مع مكتبة React 19 لدعم المعالجة والتحميل الفائق عبر الخادم (Server-Side Rendering)، وتصميم واجهات عصرية ومتجاوبة بالكامل باستخدام Tailwind CSS 4.0، بالإضافة إلى قاعدة بيانات موزعة من نوع MongoDB مُدارة عبر 33 مخططاً برمجياً دقيقاً (Mongoose Schemas). ولتجاوز بطء التحديثات في المواقع التقليدية، تم دمج خادم WebSocket مستقل يعمل بتقنية Socket.io لتمكين المراسلة والتنبيهات المباشرة بين الطلاب والأساتذة في أجزاء من الثانية دون الحاجة إلى إعادة تحميل الصفحات.',
      { alignment: AlignmentType.RIGHT }
    ),
    createP(
      'يوفر النظام بوابات متخصصة ومحمية عند الحافة البرمجية (Edge Security) لكل من: الإدارة العليا، أعضاء هيئة التدريس، الطلاب، والموظفين. وتشمل أهم الوحدات المنجزة: الجداول الدراسية التلقائية ومنع تعارض القاعات، الرصد الإلكتروني للحضور والغياب مع تطبيق السياسات الجامعية، رصد درجات الامتحانات واستخراج السجلات الأكاديمية التراكمية (GPA/CGPA) لحظياً، إدارة المصروفات الدراسية وحساب الإعفاءات والغرامات، إدارة الاستعارة بالمكتبة الرقمية، وحجز المدن الجامعية وخطوط المواصلات.',
      { alignment: AlignmentType.RIGHT }
    ),
    createP(
      'تم توثيق كافة مراحل دورة حياة هندسة البرمجيات في هذا الكتاب، بما يشمل دراسة المتطلبات (SRS)، ومخططات لغة النمذجة الموحدة (UML Diagrams)، واختبارات الجودة الشاملة (UAT)، ليكون المشروع نموذجاً تطبيقياً رائداً للجامعة الذكية الرقمية.',
      { alignment: AlignmentType.RIGHT }
    ),
  ];
}

function getAcknowledgementsSection() {
  return [
    createH1('ACKNOWLEDGEMENTS'),
    createP(
      'First and foremost, all praise and gratitude are due to Almighty God for granting us the perseverance, strength, intellectual capacity, and good health required to bring this graduation project to a successful and fruitful fruition.'
    ),
    createP(
      'We would like to express our deepest gratitude, sincere respect, and utmost appreciation to our esteemed supervisor, Dr. Milad. Her profound academic expertise, invaluable intellectual guidance, meticulous constructive feedback, and continuous encouragement throughout every milestone of this research and software engineering endeavor were indispensable in shaping the direction and high quality of this work.'
    ),
    createP(
      'We also extend our sincere appreciation to the Department of Computer Science and the administration of Thebes Higher Institute for Computer & Administrative Sciences for providing a stimulating academic environment, cutting-edge computing laboratories, and the foundational software engineering curricula that empowered us to execute an enterprise-grade cloud software platform.'
    ),
    createP(
      'Our heartfelt thanks go to the faculty members and teaching assistants whose rigorous instruction in database design, algorithms, distributed systems, software architecture, and web engineering provided the technical bedrock upon which SUMS was conceptualized and developed.'
    ),
    createP(
      'Finally, words cannot adequately convey our profound gratitude to our beloved parents and families. Their unconditional love, unwavering moral support, endless sacrifices, and patient prayers have been our greatest source of inspiration and fortitude throughout our academic journey. We dedicate the success of this graduation project to them with all our love and devotion.'
    ),
  ];
}

function getDeclarationSection() {
  return [
    createH1('DECLARATION'),
    createP(
      'We, the undersigned students of the Department of Computer Science at Thebes Higher Institute for Computer & Administrative Sciences, hereby solemnly declare that this Graduation Project report titled "Smart University Management System (SUMS): A Cloud-Native, Real-Time Campus Enterprise Management & Governance Platform" is an original piece of software engineering research and development conducted entirely by our project team under the academic supervision of Dr. Milad.'
    ),
    createP(
      'We affirm that we have strictly adhered to the principles of academic integrity, intellectual honesty, and professional engineering ethics throughout the conceptualization, system analysis, architectural design, database modeling, software implementation, and documentation of this project. All external sources of technical literature, academic papers, open-source libraries, and architectural frameworks referenced herein have been explicitly acknowledged and cited in accordance with formal scholarly citation standards.'
    ),
    createP(
      'We further confirm that neither this graduation report nor the underlying software codebase has been submitted, in whole or in part, for the award of any other academic degree, diploma, or certificate at this or any other educational institution.'
    ),
    createP(
      'Project Team Signatures:\n\n' +
      '1. Abdallah Mohamed Abdelkhalek     _____________________\n\n' +
      '2. Mosab El Sayed Abdelghafar       _____________________\n\n' +
      '3. Mohamed Magdy Abdelady           _____________________\n\n' +
      '4. Seif El Din Ayman Abdallah       _____________________\n\n' +
      '5. Mohamed Mahmoud Ramadan          _____________________\n\n' +
      '6. Reham Talaat                     _____________________\n\n' +
      'Date of Submission: June 2026'
    ),
  ];
}

function getAbbreviationsSection() {
  const headers = ['Acronym', 'Full Meaning & Context'];
  const rows = [
    ['API', 'Application Programming Interface'],
    ['Bcrypt', 'Adaptive Cryptographic Key Derivation Password Hashing Function'],
    ['CRUD', 'Create, Read, Update, Delete Database Operations'],
    ['CSS', 'Cascading Style Sheets'],
    ['DOM', 'Document Object Model'],
    ['ERP', 'Enterprise Resource Planning'],
    ['GPA / CGPA', 'Grade Point Average / Cumulative Grade Point Average'],
    ['HTML5', 'HyperText Markup Language Revision 5'],
    ['HTTP / HTTPS', 'Hypertext Transfer Protocol / Hypertext Transfer Protocol Secure'],
    ['JSON', 'JavaScript Object Notation'],
    ['JWT', 'JSON Web Token (Tamper-Resistant Security Assertion Standard)'],
    ['MVC', 'Model-View-Controller Architectural Pattern'],
    ['NoSQL', 'Not Only SQL (Document-Oriented Database Paradigm)'],
    ['ODM', 'Object Data Modeling (Mongoose Schema Layer)'],
    ['RBAC', 'Role-Based Access Control'],
    ['REST', 'Representational State Transfer'],
    ['RSC', 'React Server Components'],
    ['SIS', 'Student Information System'],
    ['SPA', 'Single Page Application'],
    ['SSR', 'Server-Side Rendering'],
    ['SUMS', 'Smart University Management System'],
    ['TLS / SSL', 'Transport Layer Security / Secure Sockets Layer'],
    ['UAT', 'User Acceptance Testing'],
    ['UI / UX', 'User Interface / User Experience Design'],
    ['UML', 'Unified Modeling Language'],
    ['URI / URL', 'Uniform Resource Identifier / Uniform Resource Locator'],
    ['WCAG', 'Web Content Accessibility Guidelines (W3C Standard)'],
    ['WSS', 'WebSocket Secure Protocol'],
  ];

  return [
    createH1('ABBREVIATIONS'),
    createP('The following table defines the standard technical acronyms, engineering terms, and abbreviations utilized throughout this graduation project documentation:'),
    createStyledTable(headers, rows, [2400, 6000]),
  ];
}

function getTableOfContentsSection() {
  const headers = ['Chapter / Section Title', 'Page'];
  const rows = [
    ['Title Page', '—'],
    ['ABSTRACT', 'i'],
    ['ACKNOWLEDGEMENTS', 'ii'],
    ['DECLARATION', 'iii'],
    ['ABBREVIATIONS', 'iv'],
    ['TABLE OF CONTENTS', 'v'],
    ['LIST OF TABLES', 'vi'],
    ['LIST OF FIGURES', 'vii'],
    ['CHAPTER 1: GENERAL INTRODUCTION', '1'],
    ['   1.1 The Evolving Landscape of Higher Education Administration', '2'],
    ['   1.2 The Imperative for Smart University Management Systems', '4'],
    ['   1.3 Problem Definition: Operational Inefficiencies in Contemporary Campuses', '6'],
    ['   1.4 Proposed Solution: The Smart University Management System (SUMS)', '8'],
    ['   1.5 Aim and Objectives: Comprehensive Engineering Roadmap', '10'],
    ['   1.6 Challenges and Constraints', '12'],
    ['   1.7 Project Timeline and Phase Milestones', '14'],
    ['   1.8 Documentation Overview', '15'],
    ['CHAPTER 2: LITERATURE REVIEW', '16'],
    ['   2.1 Introduction to Campus Enterprise Resource Planning (ERP)', '17'],
    ['   2.2 The Evolutionary Trajectory of Higher Education Systems', '18'],
    ['   2.3 Smart Campus & Enterprise Information Architecture', '20'],
    ['   2.4 Key Technologies for Modern Campus Management', '22'],
    ['   2.5 Strategic Benefits and Technical Challenges of Campus ERPs', '25'],
    ['   2.6 Comparative Analysis of University Management Platforms', '28'],
    ['CHAPTER 3: SYSTEM ANALYSIS AND DESIGN', '32'],
    ['   3.1 Software Requirements Specification (SRS)', '33'],
    ['   3.2 System Modeling & UML Diagrams', '38'],
    ['       3.2.1 Use Case Diagram (System Interactions & Actor Scopes)', '39'],
    ['       3.2.2 Activity Diagram (Operational Workflows & Decision Gateways)', '42'],
    ['       3.2.3 Sequence Diagram (End-to-End User Session Lifecycle)', '45'],
    ['       3.2.4 Class Diagram (Object-Oriented Domain Entities & Topology)', '48'],
    ['   3.3 Data Architecture & Database Modeling (40 Collections Catalog)', '51'],
    ['   3.4 Implementation Strategy & Architectural Decoupling', '56'],
    ['   3.5 Testing Strategy & Quality Assurance Matrix', '58'],
    ['   3.6 System Maintenance & Deployment Lifecycle', '62'],
    ['CHAPTER 4: SYSTEM IMPLEMENTATION & USER INTERFACES', '64'],
    ['   4.1 Overview of the Implemented System', '65'],
    ['   4.2 Authentication & Edge Role-Based Access Control (RBAC)', '66'],
    ['   4.3 Administrator Governance Control Center', '68'],
    ['   4.4 Academic Scheduling & Routine Builder', '71'],
    ['   4.5 Policy-Driven Attendance Roll-Call & Compliance Engine', '73'],
    ['   4.6 Financial Invoicing, Fee Heads & Waiver Management', '75'],
    ['   4.7 Digital Library Circulation System', '77'],
    ['   4.8 Student Self-Service Portal & Real-Time Performance Analytics', '79'],
    ['   4.9 Sub-Second Real-Time Campus Messaging & Chat Channels', '81'],
    ['   4.10 Complete Technology Stack Breakdown & Rationale', '83'],
    ['   4.11 Teacher Portal, Lectures & Per-Course Marks', '85'],
    ['   4.12 Requests & Inquiries, Administrative CRUD and Global Search', '86'],
    ['   4.13 Payment Verification, Notifications and Inventory Audit', '87'],
    ['   4.14 SUMS Assistant (Chatbot)', '88'],
    ['CHAPTER 5: CONCLUSION AND FUTURE WORK', '86'],
    ['   5.1 Summary of Chapters & Engineering Achievements', '87'],
    ['   5.2 Conclusion: Realizing the Autonomous Smart Campus', '89'],
    ['   5.3 Future Work & Strategic Roadmap', '90'],
    ['REFERENCES', '93'],
  ];

  return [
    createH1('TABLE OF CONTENTS'),
    createStyledTable(headers, rows, [6800, 1600]),
  ];
}

function getListOfTablesSection() {
  const headers = ['Table Number', 'Caption / Title', 'Page'];
  const rows = [
    ['Table 1.1', 'Project Development Timeline, Phases, and Milestone Allocations', '14'],
    ['Table 2.1', 'Comparative Paradigm: Legacy Campus Management vs. Modern SUMS', '29'],
    ['Table 2.2', 'Benchmarking Evaluation: SUMS vs. Major Higher Education ERPs', '31'],
    ['Table 3.1', 'System Requirements Specification (SRS) Detailed Module Matrix', '36'],
    ['Table 3.2', 'Comprehensive Software Verification & User Acceptance Testing (UAT)', '60'],
    ['Table 4.1', 'SUMS Enterprise Technology Stack Summary & Architectural Rationale', '84'],
  ];

  return [
    createH1('LIST OF TABLES'),
    createStyledTable(headers, rows, [1800, 5200, 1400]),
  ];
}

function getListOfFiguresSection() {
  const headers = ['Figure Number', 'Caption / Title', 'Page'];
  const rows = [
    ['Figure 3.1', 'Use Case Diagram — System Interactions & Actor Scopes', '41'],
    ['Figure 3.2', 'Activity Diagram — Operational Workflows & Decision Gateways', '44'],
    ['Figure 3.3', 'Sequence Diagram — End-to-End User Session Lifecycle', '47'],
    ['Figure 3.4', 'Class Diagram — Object-Oriented Domain Entities & Topology', '50'],
    ['Figure 4.1', 'Administrator Governance Control Center & Role Hub Interface', '70'],
    ['Figure 4.2', 'Academic Routine & Timetable Builder Interface', '72'],
    ['Figure 4.3', 'Policy-Driven Attendance Roll-Call & Compliance Dashboard', '74'],
    ['Figure 4.4', 'Financial Ledger, Invoicing, and Fee Waiver Management Interface', '76'],
    ['Figure 4.5', 'Digital Library Catalog & Book Circulation System Interface', '78'],
    ['Figure 4.6', 'Student Academic Portal & Examination Performance Hub', '80'],
  ];

  return [
    createH1('LIST OF FIGURES'),
    createStyledTable(headers, rows, [1800, 5200, 1400]),
  ];
}

module.exports = {
  getTitlePageSection,
  getAbstractSection,
  getAcknowledgementsSection,
  getDeclarationSection,
  getAbbreviationsSection,
  getTableOfContentsSection,
  getListOfTablesSection,
  getListOfFiguresSection
};
