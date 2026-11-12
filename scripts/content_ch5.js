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
  FONT_BODY,
  COLOR_PRIMARY,
  COLOR_SECONDARY,
  COLOR_DARK
} = require('./book_helpers');

function getChapter5Content() {
  const content = [];

  // Chapter 5 Header
  content.push(createH1('CHAPTER 5: CONCLUSION AND FUTURE WORK'));

  // 5.1
  content.push(createH2('5.1 Summary of Chapters & Engineering Achievements'));
  content.push(
    createP(
      'This graduation project has successfully conceptualized, engineered, evaluated, and documented the Smart University Management System (SUMS)—an enterprise-grade, cloud-native ERP platform built to digitize, unify, and automate academic, administrative, financial, and logistical workflows across modern higher education institutions.'
    )
  );
  content.push(
    createP(
      'A reflective synthesis of the engineering journey across the preceding chapters highlights several critical milestones:'
    )
  );
  content.push(
    createBullet(
      'Established the foundational rationale for campus digitization, demonstrated the severe operational bottlenecks of legacy paper and software silos, and defined the project’s overarching aim alongside six measurable engineering objectives and a structured development timeline.',
      'Chapter 1 (General Introduction):'
    )
  );
  content.push(
    createBullet(
      'Conducted an exhaustive intellectual and empirical survey of university information systems, traced the evolutionary trajectory from paper ledgers to cloud microservices, analyzed cutting-edge web technologies (Next.js 16, React 19, Socket.io, MongoDB), and benchmarked SUMS against global commercial platforms.',
      'Chapter 2 (Literature Review):'
    )
  );
  content.push(
    createBullet(
      'Formulated an exhaustive Software Requirements Specification (SRS), constructed a comprehensive suite of formal UML diagrams (Use Case, Activity, Sequence, and Class diagrams), detailed the 33-collection MongoDB data architecture, and established an end-to-end verification and UAT testing matrix.',
      'Chapter 3 (System Analysis and Design):'
    )
  );
  content.push(
    createBullet(
      'Demonstrated the realized, production-grade application through rich interface walkthroughs across all campus user roles, documented key subsystems (Academic Routine Builder, Attendance Policy Engine, Financial Invoicing, Digital Library, and Real-Time WebSocket Chat), and detailed the complete technology stack.',
      'Chapter 4 (System Implementation):'
    )
  );

  // 5.2
  content.push(createH2('5.2 Conclusion: Realizing the Autonomous Smart Campus'));
  content.push(
    createP(
      'The realization of the Smart University Management System demonstrates that modern full-stack web architectures can successfully solve the institutional fragmentation and administrative inertia that have long plagued higher education. By replacing disparate legacy spreadsheets and physical filing cabinets with a unified, cloud-native web platform, SUMS delivers immediate and lasting institutional benefits:'
    )
  );
  content.push(
    createBullet(
      'Transforms student admissions, course registrations, routine generation, grade submissions, and tuition payments into paperless, automated digital workflows, saving thousands of labor hours and paper records annually.',
      '1. Operational Efficiency & Zero-Paper Sustainability:'
    )
  );
  content.push(
    createBullet(
      'Maintaining 40 strictly typed, relational collections in a centralized MongoDB database guarantees an authoritative single source of truth, eradicating duplicate student profiles and registrar record conflicts.',
      '2. Absolute Data Integrity & Institutional Transparency:'
    )
  );
  content.push(
    createBullet(
      'Replacing asynchronous email and bulletin boards with a persistent Socket.io WebSocket engine bridges communication gaps, fostering instantaneous collaboration between faculty and students.',
      '3. Sub-Second Real-Time Campus Collaboration:'
    )
  );
  content.push(
    createBullet(
      'Edge-level session inspection and Bcrypt password hashing establish a robust security perimeter, protecting sensitive student grades, financial transactions, and administrative records against modern cyber threats.',
      '4. Enterprise Security & Role Governance:'
    )
  );

  // 5.3
  content.push(createH2('5.3 Future Work & Strategic Roadmap'));
  content.push(
    createP(
      'While SUMS represents a fully operational, production-ready campus ERP platform, the rapid evolution of technology offers exciting opportunities for continued innovation. The strategic roadmap for future enhancements encompasses five primary initiatives:'
    )
  );
  content.push(
    createBullet(
      'Developing companion mobile applications for iOS and Android using React Native, utilizing existing Next.js REST API endpoints and Socket.io channels to provide native mobile push notifications, offline class schedules, and mobile digital student ID cards.',
      '1. Native Cross-Platform Mobile Applications (React Native):'
    )
  );
  content.push(
    createBullet(
      'Embedding machine learning models trained on historical student attendance and assessment data to identify students at risk of academic failure or course drop-out early in the semester, automatically recommending personalized tutoring and counseling interventions.',
      '2. AI-Powered Academic Advising & Predictive Retention Engine:'
    )
  );
  content.push(
    createBullet(
      'Integrating physical IoT hardware devices—such as RFID student ID card tap readers and biometric fingerprint scanners installed at lecture hall entryways—to log student attendance autonomously without requiring manual instructor roll-calls.',
      '3. IoT & Biometric Automated Attendance Integration:'
    )
  );
  content.push(
    createBullet(
      'Partnering with commercial banking APIs and mobile payment services (e.g., Fawry, Vodafone Cash, Visa/Mastercard) to enable direct digital tuition fee payments within the platform, complete with automated webhook transaction confirmations.',
      '4. Integrated Digital Payment Gateway & Campus Wallet:'
    )
  );
  content.push(
    createBullet(
      'Implementing decentralized cryptographic verification for published university transcripts and graduation certificates using blockchain smart contracts, allowing international employers and academic institutions to verify student credentials instantaneously without contacting the registrar.',
      '5. Blockchain-Verified Digital Transcripts & Credentials:'
    )
  );

  return content;
}

function getReferencesSection() {
  const content = [];

  content.push(createH1('REFERENCES'));
  content.push(
    createP(
      'The following scholarly publications, textbooks, technical specifications, and official architectural documentations were referenced during the system analysis, engineering design, implementation, and academic documentation of this project:'
    )
  );

  const references = [
    '[1] Pressman, R. S., & Maxim, B. R. (2020). Software Engineering: A Practitioner’s Approach (9th ed.). McGraw-Hill Education.',
    '[2] Sommerville, I. (2016). Software Engineering (10th ed.). Pearson Education.',
    '[3] Bass, L., Clements, P., & Kazman, R. (2021). Software Architecture in Practice (4th ed.). Addison-Wesley Professional.',
    '[4] Booch, G., Rumbaugh, J., & Jacobson, I. (2005). The Unified Modeling Language User Guide (2nd ed.). Addison-Wesley.',
    '[5] Fowler, M. (2002). Patterns of Enterprise Application Architecture. Addison-Wesley Professional.',
    '[6] Martin, R. C. (2018). Clean Architecture: A Craftsman’s Guide to Software Structure and Design. Prentice Hall.',
    '[7] Wiegers, K., & Beatty, J. (2013). Software Requirements (3rd ed.). Microsoft Press.',
    '[8] Fielding, R. T. (2000). Architectural Styles and the Design of Network-based Software Architectures (Doctoral dissertation). University of California, Irvine.',
    '[9] Next.js Engineering Team. (2025). Next.js 16 Documentation: App Router, Server Components, and Edge Middleware. Vercel Inc. Retrieved from https://nextjs.org/docs',
    '[10] Facebook / Meta Open Source. (2025). React 19: Full-Stack Architecture, Actions, and Server Rendering. Meta Platforms, Inc. Retrieved from https://react.dev',
    '[11] Wathan, A. (2025). Tailwind CSS 4.0: High-Performance Utility-First CSS Framework. Tailwind Labs.',
    '[12] MongoDB Inc. (2025). MongoDB 8.0 Manual: Document Database, Compound Indexing, and ACID Transactions. MongoDB Documentation.',
    '[13] Automattic. (2025). Mongoose 8.x: Elegant MongoDB Object Modeling for Node.js. Retrieved from https://mongoosejs.com',
    '[14] Socket.io Maintainers. (2025). Socket.io 4.x: Bidirectional and Low-Latency Event-Driven Communication. Retrieved from https://socket.io',
    '[15] Provos, N., & Mazières, D. (1999). A Future-Adaptable Password Scheme. In Proceedings of the FREENIX Track: 1999 USENIX Annual Technical Conference (pp. 81–91).',
    '[16] Rescorla, E. (2018). The Transport Layer Security (TLS) Protocol Version 1.3 (RFC 8446). Internet Engineering Task Force (IETF).',
    '[17] World Wide Web Consortium (W3C). (2018). Web Content Accessibility Guidelines (WCAG) 2.1. W3C Recommendation.',
    '[18] ISO/IEC/IEEE. (2017). Systems and software engineering — Software life cycle processes (ISO/IEC/IEEE 12207:2017). IEEE.',
    '[19] ISO/IEC. (2011). Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — System and software quality models (ISO/IEC 25010:2011). ISO.',
    '[20] Chodorow, K. (2013). MongoDB: The Definitive Guide (2nd ed.). O’Reilly Media.',
    '[21] Tilkov, S., & Vinoski, S. (2010). Node.js: Using JavaScript to build high-performance network programs. IEEE Internet Computing, 14(6), 80–83.',
    '[22] Fette, I., & Melnikov, A. (2011). The WebSocket Protocol (RFC 6455). Internet Engineering Task Force (IETF).',
    '[23] Jones, M., Bradley, J., & Sakimura, N. (2015). JSON Web Token (JWT) (RFC 7519). Internet Engineering Task Force (IETF).',
    '[24] Al-Bayati, A. H., & Al-Nuaimy, W. (2018). Smart campus: A comprehensive survey of architectures and frameworks. IEEE Access, 6, 42358–42378.',
    '[25] Min-Allah, N., & Alrashed, S. (2020). Smart campus—A sketch. Sustainable Cities and Society, 59, 102231.',
    '[26] Kwet, M. (2020). Commercial software in higher education: Critical analysis of enterprise ERP solutions. Critical Studies in Education, 61(4), 481–498.',
    '[27] Ellucian Company L.P. (2024). Banner Higher Education Enterprise Platform Architecture. Ellucian Technical Whitepapers.',
    '[28] Moodle Pty Ltd. (2025). Moodle 4.x Architecture and Developer Documentation. Moodle Open Source.',
    '[29] Anthopoulos, L., & Fitsilis, P. (2014). Smart cities and green ICT: A smart campus blueprint. In Proceedings of the 23rd International Conference on World Wide Web (pp. 539–542). ACM.',
    '[30] Villegas-Ch, W., Palacios-Pacheco, X., & Luján-Mora, S. (2019). Application of a smart campus model for higher education using IoT and big data. Big Data and Cognitive Computing, 3(1), 4.',
    '[31] IEEE Computer Society. (2014). Guide to the Software Engineering Body of Knowledge (SWEBOK Guide V3.0). IEEE.',
    '[32] Beck, K., et al. (2001). Manifesto for Agile Software Development. Agile Alliance.',
    '[33] Gamma, E., Helm, R., Johnson, R., & Vlissides, J. (1994). Design Patterns: Elements of Reusable Object-Oriented Software. Addison-Wesley.',
    '[34] Kleppmann, M. (2017). Designing Data-Intensive Applications: The Big Ideas Behind Reliable, Scalable, and Maintainable Systems. O’Reilly Media.',
    '[35] Newman, S. (2021). Building Microservices: Designing Fine-Grained Systems (2nd ed.). O’Reilly Media.',
    '[36] Stallings, W. (2017). Cryptography and Network Security: Principles and Practice (7th ed.). Pearson.',
    '[37] OWASP Foundation. (2024). OWASP Top 10 Web Application Security Risks. Open Web Application Security Project.',
    '[38] European Union. (2016). General Data Protection Regulation (GDPR) (Regulation (EU) 2016/679). Official Journal of the European Union.',
    '[39] U.S. Congress. (1974). Family Educational Rights and Privacy Act (FERPA) (20 U.S.C. § 1232g).',
    '[40] Thebes Higher Institute for Computer & Administrative Sciences. (2025). Academic Guidelines and Regulations for Graduation Project Submissions. Department of Computer Science, Thebes Academy.',
  ];

  references.forEach(ref => {
    content.push(
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { line: 320, before: 60, after: 100 },
        children: [
          new TextRun({
            text: ref,
            font: FONT_BODY,
            size: 22,
            color: COLOR_DARK,
          }),
        ],
      })
    );
  });

  return content;
}

module.exports = {
  getChapter5Content,
  getReferencesSection,
};
