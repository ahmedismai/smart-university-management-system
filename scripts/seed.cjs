/* Seed script: node --env-file=.env.local scripts/seed.cjs
 * Inserts only into EMPTY collections; never deletes existing data. */
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { ObjectId } = mongoose.Types;
const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI missing (run with --env-file=.env.local)");

const ADMIN_PASSWORD = "Admin@123";
const STUDENT_PASSWORD = "Student@123";

const day = 86400000;
const now = new Date();
const daysAgo = (n) => new Date(now.getTime() - n * day);
const daysAhead = (n) => new Date(now.getTime() + n * day);
const iso = (d) => d.toISOString().slice(0, 10);
const pick = (arr, i) => arr[i % arr.length];

async function main() {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 20000 });
  const db = mongoose.connection.db;
  const put = async (name, docs) => {
    const existing = await db.collection(name).countDocuments();
    if (existing > 0) {
      console.log(`${name.padEnd(18)} SKIPPED (already has ${existing} docs - nothing deleted)`);
      return;
    }
    if (docs.length) {
      const stamped = docs.map((d) => ({ createdAt: d.createdAt || now, updatedAt: now, ...d }));
      await db.collection(name).insertMany(stamped);
    }
    console.log(`${name.padEnd(18)} ${docs.length}`);
  };

  // ---------- Teachers ----------
  const teacherSeed = [
    ["Dr. Sarah Johnson", "CSE"], ["Dr. Rahman Hossain", "CSE"], ["Prof. Nasrin Akter", "CSE"],
    ["Dr. Karim Uddin", "EEE"], ["Dr. Farhana Islam", "EEE"], ["Prof. Mahmud Hasan", "EEE"],
    ["Dr. Tania Sultana", "BBA"], ["Prof. Imran Chowdhury", "BBA"], ["Dr. Salma Begum", "BBA"],
  ];
  const teachers = teacherSeed.map(([name, department], i) => ({
    _id: new ObjectId(), name, department, status: "Active",
    email: `${name.toLowerCase().replace(/^(dr|prof)\.\s*/, "").replace(/[^a-z]+/g, ".")}@sums.edu`,
    teacherId: `T-${String(i + 1).padStart(3, "0")}`,
  }));
  await put("teachers", teachers);

  // ---------- Classes (programs) & Sections ----------
  const classes = [
    { _id: new ObjectId(), name: "Computer Science & Engineering", code: "CSE", teacherId: teachers[0]._id },
    { _id: new ObjectId(), name: "Electrical & Electronic Engineering", code: "EEE", teacherId: teachers[3]._id },
    { _id: new ObjectId(), name: "Business Administration", code: "BBA", teacherId: teachers[6]._id },
  ];
  await put("classes", classes);

  const sections = [];
  classes.forEach((c, ci) => {
    ["A", "B"].forEach((s, si) => {
      sections.push({
        _id: new ObjectId(), name: `Section ${s}`, sectionId: `${c.code}-${s}`, classId: c._id,
        teacherId: teachers[ci * 3 + si]._id, room: `Room ${ci + 1}0${si + 1}`, capacity: 50, status: "Active",
      });
    });
  });
  await put("sections", sections);

  // ---------- Courses ----------
  const courseSeed = {
    CSE: [["CSE-101", "Data Structures", 3, "Core"], ["CSE-201", "Database Management", 3, "Core"], ["CSE-301", "Software Engineering", 3, "Core"], ["CSE-102", "Discrete Mathematics", 3, "General"], ["CSE-103", "Digital Logic Design", 3, "Core"]],
    EEE: [["EEE-101", "Electrical Circuits", 3, "Core"], ["EEE-201", "Signals & Systems", 3, "Core"], ["EEE-301", "Electromagnetic Fields", 3, "Core"], ["EEE-302", "Power Systems", 3, "Elective"], ["EEE-202", "Microprocessors", 3, "Core"]],
    BBA: [["BBA-101", "Principles of Management", 3, "Core"], ["BBA-201", "Financial Accounting", 3, "Core"], ["BBA-301", "Marketing Management", 3, "Core"], ["BBA-102", "Business Statistics", 3, "General"], ["BBA-202", "Organizational Behavior", 3, "Elective"]],
  };
  const courses = [];
  classes.forEach((c, ci) => {
    courseSeed[c.code].forEach(([courseCode, title, credits, type], i) => {
      courses.push({
        _id: new ObjectId(), courseCode, title, department: c.code, credits, type, status: "Active",
        description: `${title} - ${c.name}`, teacherId: teachers[ci * 3 + (i % 3)]._id, classCode: c.code,
      });
    });
  });
  await put("courses", courses);

  // ---------- Routines ----------
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
  const slots = [["09:00", "10:30"], ["11:00", "12:30"], ["14:00", "15:30"]];
  const routines = [];
  classes.forEach((c, ci) => {
    const cc = courses.filter((x) => x.classCode === c.code);
    sections.filter((s) => s.classId.equals(c._id)).forEach((sec, si) => {
      cc.forEach((course, i) => {
        const slot = slots[(i + si) % slots.length];
        routines.push({
          _id: new ObjectId(), day: days[(i + si) % days.length], startTime: slot[0], endTime: slot[1],
          courseId: course._id, sectionId: sec._id, classId: c._id, teacherId: course.teacherId,
          room: sec.room, type: i % 4 === 3 ? "Lab" : "Lecture",
        });
      });
    });
  });
  await put("routines", routines);

  // ---------- Students ----------
  const names = [
    "Ahmed Ismail", "Mohamed Ali", "Fatima Rahman", "Rahim Uddin", "Ayesha Siddika", "Tanvir Hasan",
    "Nusrat Jahan", "Sakib Khan", "Mariam Akter", "Omar Faruk", "Sadia Islam", "Jamal Hossain",
    "Lamia Chowdhury", "Hasan Mahmud", "Rima Sultana", "Zayed Karim", "Nabila Haque", "Imtiaz Ahmed",
    "Farzana Yeasmin", "Rafi Alam", "Sumaiya Noor", "Arif Billah", "Tasnim Ara", "Mehedi Hasan",
    "Jannat Ferdous", "Shihab Ahmed", "Maliha Tabassum", "Fahim Reza", "Anika Tahsin", "Yusuf Kabir",
  ];
  const students = names.map((name, i) => {
    const cls = classes[i % 3];
    const secs = sections.filter((s) => s.classId.equals(cls._id));
    return {
      _id: new ObjectId(), name,
      email: `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@student.sums.edu`,
      studentId: `${cls.code}2024${String(Math.floor(i / 3) + 1).padStart(3, "0")}`,
      classId: cls._id, sectionId: secs[Math.floor(i / 3) % 2]._id,
      status: "Active", phone: `+8801700${String(100000 + i * 137).slice(0, 6)}`,
      address: "Dhaka, Bangladesh", about: "", linkedin: "", github: "", twitter: "", website: "", avatar: "",
    };
  });
  await put("students", students);

  // ---------- Users (admin + students + teachers) ----------
  const adminHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const studentHash = await bcrypt.hash(STUDENT_PASSWORD, 10);
  const users = [
    { name: "System Admin", email: "admin@sums.edu", password: adminHash, role: "Admin", department: "Administration", status: "Active" },
    ...students.map((s) => ({ name: s.name, email: s.email, password: studentHash, role: "Student", department: classes.find((c) => c._id.equals(s.classId)).code, status: "Active" })),
    ...teachers.map((t) => ({ name: t.name, email: t.email, password: studentHash, role: "Teacher", department: t.department, status: "Active" })),
  ];
  await put("users", users);

  // ---------- Staff & Parents ----------
  const staffSeed = [["Rubina Parvin", "Registrar", "Administration"], ["Kamal Hossain", "Accountant", "Finance"], ["Shirin Akter", "Librarian", "Library"], ["Abdul Malek", "Lab Assistant", "CSE"], ["Nazmul Haque", "IT Officer", "IT"], ["Rokeya Khatun", "Office Assistant", "Administration"]];
  await put("staffs", staffSeed.map(([name, designation, department], i) => ({
    name, designation, department, email: `${name.toLowerCase().replace(/\s+/g, ".")}@sums.edu`,
    staffId: `ST-${String(i + 1).padStart(3, "0")}`, phone: `+8801800${100000 + i * 211}`, status: "Active",
  })));
  await put("parents", students.slice(0, 12).map((s, i) => ({
    name: `${s.name.split(" ").slice(-1)[0]} (Guardian)`, email: `parent${i + 1}@sums.edu`, parentId: `P-${String(i + 1).padStart(3, "0")}`,
    phone: `+8801900${100000 + i * 173}`, studentId: s._id, status: i % 6 === 5 ? "Pending" : "Active", lastLogin: daysAgo(i),
  })));

  // ---------- Grade scale ----------
  await put("gradescales", [
    ["A+", 80, 100, 4.0, "Outstanding"], ["A", 75, 79.99, 3.75, "Excellent"], ["A-", 70, 74.99, 3.5, "Very Good"],
    ["B+", 65, 69.99, 3.25, "Good"], ["B", 60, 64.99, 3.0, "Satisfactory"], ["B-", 55, 59.99, 2.75, "Above Average"],
    ["C+", 50, 54.99, 2.5, "Average"], ["C", 45, 49.99, 2.25, "Below Average"], ["D", 40, 44.99, 2.0, "Pass"], ["F", 0, 39.99, 0, "Fail"],
  ].map(([grade, min, max, point, remarks]) => ({ grade, min, max, point, remarks, isActive: true })));

  // ---------- Marks ----------
  const gradeOf = (p) => (p >= 80 ? "A+" : p >= 75 ? "A" : p >= 70 ? "A-" : p >= 65 ? "B+" : p >= 60 ? "B" : p >= 55 ? "B-" : p >= 50 ? "C+" : p >= 45 ? "C" : p >= 40 ? "D" : "F");
  const marks = [];
  students.forEach((s, i) => {
    // one set of assessments for every course taught to the student's section
    const courseIds = [...new Map(routines.filter((r) => String(r.sectionId) === String(s.sectionId)).map((r) => [String(r.courseId), r.courseId])).values()];
    courseIds.forEach((courseId, ci) => {
      [["Quiz", 20], ["Assignment", 20], ["Midterm", 30], ["Final", 50]].forEach(([examType, totalMarks], k) => {
        const obtainedMarks = Math.round(totalMarks * (0.55 + ((i * 7 + k * 5 + ci * 3) % 40) / 100));
        marks.push({ studentId: s._id, classId: s.classId, courseId, examType, obtainedMarks, totalMarks, grade: gradeOf((obtainedMarks / totalMarks) * 100), remarks: "" });
      });
    });
  });
  await put("marks", marks);

  // ---------- Exams ----------
  const halls = ["Hall A", "Hall B", "Main Auditorium", "Lab 3"];
  const exams = courses.map((c, i) => ({
    _id: new ObjectId(), examId: `EX-2026-${String(i + 1).padStart(3, "0")}`, courseId: c._id,
    date: iso(daysAhead(7 + i * 2)), time: i % 2 ? "02:00 PM" : "10:00 AM", hall: pick(halls, i),
    studentsCount: 10, status: i < 10 ? "Scheduled" : i < 13 ? "Draft" : "Completed", description: `${c.title} final examination`,
    name: `${c.title} Final`, type: "Final",
  }));
  await put("exams", exams);

  // ---------- Results (course level + per-student CGPA) ----------
  const results = courses.map((c, i) => ({
    resultId: `RS-2026-${String(i + 1).padStart(3, "0")}`, courseId: c._id, semester: "Spring 2026",
    avgGpa: +(3 + ((i * 13) % 9) / 10).toFixed(2), passRate: `${88 + (i % 11)}%`, status: i % 5 === 4 ? "Pending" : "Published",
  }));
  students.forEach((s, i) => {
    const course = courses.find((c) => c.classCode === classes.find((x) => x._id.equals(s.classId)).code);
    [["Fall 2025", 3.1], ["Spring 2026", 3.3]].forEach(([semester, base], k) => {
      const cgpa = +Math.min(4, base + ((i * 3 + k * 2) % 7) / 10).toFixed(2);
      results.push({ resultId: `RS-${s.studentId}-${k + 1}`, courseId: course._id, studentId: s._id, semester, avgGpa: cgpa, cgpa, passRate: "100%", status: "Published", createdAt: daysAgo(180 - k * 90) });
    });
  });
  await put("results", results);

  // ---------- Attendance (last ~30 working days) ----------
  const attendance = [];
  students.forEach((s, i) => {
    for (let d = 1; d <= 30; d++) {
      const date = daysAgo(d);
      if (date.getDay() === 5 || date.getDay() === 6) continue;
      const r = (i * 31 + d * 17) % 20;
      const status = r < 15 ? "Present" : r < 17 ? "Late" : r < 19 ? "Absent" : "Excused";
      attendance.push({ studentId: s._id, classId: s.classId, date: new Date(iso(date)), status, remark: "" });
    }
  });
  await put("attendances", attendance);
  await put("attendancepolicies", [{ minAttendance: 75, lateBuffer: 15, penaltyType: "Deduct Marks (Automatic)", biometricSync: true, automation: { autoSMS: true, weeklyReports: false, thresholdAlerts: true } }]);
  await put("holidays", [
    ["Eid-ul-Fitr", "Religious", 30, 34], ["Independence Day", "National", 120, 120], ["Pohela Boishakh", "Cultural", 160, 160],
    ["Victory Day", "National", -50, -50], ["Eid-ul-Adha", "Religious", 220, 224],
  ].map(([name, type, s, e]) => ({ name, type, startDate: daysAhead(s), endDate: daysAhead(e), status: s < 0 ? "Passed" : "Upcoming" })));

  // ---------- Finance ----------
  const feeHeads = [
    { _id: new ObjectId(), name: "Tuition Fee", dept: "All", amount: 25000, frequency: "Semester", status: "Active" },
    { _id: new ObjectId(), name: "Lab Fee", dept: "CSE", amount: 5000, frequency: "Semester", status: "Active" },
    { _id: new ObjectId(), name: "Library Fee", dept: "All", amount: 1500, frequency: "Annual", status: "Active" },
    { _id: new ObjectId(), name: "Admission Fee", dept: "All", amount: 15000, frequency: "One-time", status: "Active" },
  ];
  await put("feeheads", feeHeads);
  const methods = ["Vodafone Cash", "Bank Transfer", "Card", "Cash"];
  const fees = [];
  students.forEach((s, i) => {
    fees.push({ studentId: s._id, feeHeadId: feeHeads[0]._id, amount: 25000, status: "Paid", paymentMethod: pick(methods, i), transactionId: `TXN${100000 + i}`, dueDate: daysAgo(60), paidDate: daysAgo(65 - (i % 10)) });
    const pending = i % 4 !== 0;
    fees.push({ studentId: s._id, feeHeadId: feeHeads[2 + (i % 2)]._id, amount: i % 2 ? 15000 : 1500, status: pending ? "Pending" : "Paid", paymentMethod: pending ? undefined : pick(methods, i + 1), transactionId: pending ? undefined : `TXN${200000 + i}`, dueDate: daysAhead(5 + (i % 20)), paidDate: pending ? undefined : daysAgo(2) });
  });
  await put("fees", fees.map((f) => JSON.parse(JSON.stringify(f), (k, v) => (/Date$/.test(k) && v ? new Date(v) : v))));
  const fineTypes = ["Library", "Late Fee", "Attendance", "Conduct"];
  await put("fines", students.slice(0, 10).map((s, i) => ({
    fineId: `FN-${String(i + 1).padStart(4, "0")}`, studentId: s._id, type: pick(fineTypes, i), amount: 200 + i * 50,
    date: daysAgo(i * 3), status: ["Unpaid", "Paid", "Processing"][i % 3], description: `${pick(fineTypes, i)} fine`,
  })));
  await put("waivers", students.slice(0, 6).map((s, i) => ({
    waiverId: `WV-${String(i + 1).padStart(4, "0")}`, studentId: s._id, type: ["Merit-based", "Need-based", "Sibling", "Martyrs Families"][i % 4],
    value: ["50%", "25%", "100%", "10%"][i % 4], amount: [12500, 6250, 25000, 2500][i % 4], status: ["Active", "Pending", "Active"][i % 3],
  })));

  // ---------- Library ----------
  const bookSeed = [
    ["Introduction to Algorithms", "Thomas H. Cormen", "Computer Science"], ["Clean Code", "Robert C. Martin", "Computer Science"],
    ["Database System Concepts", "Abraham Silberschatz", "Computer Science"], ["Operating System Concepts", "Abraham Silberschatz", "Computer Science"],
    ["Computer Networks", "Andrew S. Tanenbaum", "Computer Science"], ["Fundamentals of Electric Circuits", "Charles K. Alexander", "Engineering"],
    ["Signals and Systems", "Alan V. Oppenheim", "Engineering"], ["Power System Analysis", "John J. Grainger", "Engineering"],
    ["Principles of Marketing", "Philip Kotler", "Business"], ["Financial Accounting", "Jerry J. Weygandt", "Business"],
    ["Management", "Stephen P. Robbins", "Business"], ["Organizational Behavior", "Stephen P. Robbins", "Business"],
    ["Calculus", "James Stewart", "Mathematics"], ["Discrete Mathematics", "Kenneth H. Rosen", "Mathematics"],
    ["Digital Design", "M. Morris Mano", "Engineering"], ["Software Engineering", "Ian Sommerville", "Computer Science"],
  ];
  const books = bookSeed.map(([title, author, category], i) => ({
    _id: new ObjectId(), title, author, category, isbn: `978-0-00-${String(1000 + i)}-${i % 10}`, copies: 5, availableCopies: 5, location: `Shelf ${String.fromCharCode(65 + (i % 6))}-${(i % 4) + 1}`,
  }));
  const issues = [];
  students.slice(0, 14).forEach((s, i) => {
    const book = books[i % books.length];
    const returned = i % 3 === 0;
    const overdue = !returned && i % 3 === 1;
    const issueDate = daysAgo(overdue ? 25 : 8 + i);
    issues.push({ book: book._id, memberId: s.studentId, memberType: "Student", issueDate, dueDate: new Date(issueDate.getTime() + 14 * day), returnDate: returned ? daysAgo(2) : undefined, status: returned ? "Returned" : overdue ? "Overdue" : "Active" });
    if (!returned) book.availableCopies -= 1;
  });
  await put("books", books);
  await put("bookissues", issues);

  // ---------- Misc admin data ----------
  await put("announcements", [
    ["Spring 2026 Final Exam Schedule Published", "The final examination schedule is now available. Please check the exam portal.", "Academic", "High", "All"],
    ["Library Extended Hours", "The central library will remain open until 10 PM during exam weeks.", "Administrative", "Medium", "Students"],
    ["Faculty Meeting", "All faculty members are requested to attend the monthly meeting on Sunday.", "Administrative", "Medium", "Teachers"],
    ["Annual Sports Day", "Annual Sports Day registration is open until the end of the month.", "Event", "Low", "All"],
    ["Fee Payment Deadline", "Last date for semester fee payment is approaching. Late fees will apply.", "Urgent", "High", "Students"],
    ["Staff Training Workshop", "A training workshop on the new ERP system will be held next week.", "Administrative", "Low", "Staff"],
  ].map(([title, content, category, priority, targetAudience], i) => ({ title, content, category, priority, targetAudience, status: "Published", createdAt: daysAgo(i * 2) })));
  await put("alerts", [
    ["Semester fee payment is due soon", "Warning"], ["New message from your professor", "Info"], ["Midterm results have been published", "Info"],
    ["Library book return is overdue", "Warning"], ["Server maintenance scheduled for Friday night", "Info"],
  ].map(([message, type], i) => ({ message, type, isRead: false, createdAt: daysAgo(i) })));
  await put("hostels", [
    ["Al-Azhar Hall", "Boys", 300, 262], ["Huda Shaarawi Hall", "Girls", 250, 250], ["International House", "Mixed", 120, 74], ["Saad Zaghloul Hall", "Boys", 280, 0],
  ].map(([name, type, capacity, occupied]) => ({ name, type, capacity, occupied, status: occupied === capacity ? "Full" : occupied === 0 ? "Maintenance" : "Available" })));
  await put("transportroutes", [
    ["Campus - Nasr City", "Bus CAI-2401", "07:30 AM", 42, "On Time"], ["Campus - Maadi", "Bus CAI-2402", "07:15 AM", 38, "Delayed"],
    ["Campus - Heliopolis", "Bus CAI-2403", "08:00 AM", 35, "On Time"], ["Campus - 6th of October", "Bus CAI-2404", "06:45 AM", 29, "Cancelled"],
  ].map(([route, vehicle, time, studentsCount, status]) => ({ route, vehicle, time, students: studentsCount, status })));
  await put("inventories", [
    ["Desktop Computer", "IT Equipment", 120, "pcs", "Computer Lab 1", "In Stock"], ["Projector", "Electronics", 25, "pcs", "Store Room", "In Stock"],
    ["Whiteboard Markers", "Stationery", 0, "box", "Admin Store", "Out of Stock"], ["Oscilloscope", "Lab Equipment", 8, "pcs", "EEE Lab", "Under Maintenance"],
    ["Office Chairs", "Furniture", 60, "pcs", "Admin Block", "In Stock"], ["A4 Paper", "Stationery", 200, "ream", "Admin Store", "In Stock"],
  ].map(([itemName, category, quantity, unit, location, status]) => ({ itemName, category, quantity, unit, location, status, unitPrice: ({ "Desktop Computer": 18000, Projector: 12000, "Whiteboard Markers": 90, Oscilloscope: 25000, "Office Chairs": 1800, "A4 Paper": 180 })[itemName] || 0 })));
  await put("reports", [
    ["Attendance Report", "Daily, weekly and monthly attendance analysis.", "BarChart3"], ["Academic Performance", "GPA distribution and subject-wise results.", "LineChart"],
    ["Financial Summary", "Revenue collection and outstanding dues.", "PieChart"], ["Inventory Usage", "Stock levels and asset allocation tracking.", "BarChart3"],
  ].map(([name, desc, icon]) => ({ name, desc, icon })));
  await put("activities", [
    ["System Admin", "Logged in", "Admin dashboard access"], ["System Admin", "Published announcement", "Spring 2026 Final Exam Schedule"],
    ["Kamal Hossain", "Recorded payment", "Tuition fee payment received"], ["Shirin Akter", "Issued book", "Clean Code issued to a student"],
    ["System Admin", "Created exam", "Software Engineering Final"],
  ].map(([user, action, details], i) => ({ user, action, details, status: "Success", timestamp: daysAgo(i) })));
  await put("reportcardbatches", [{ batchId: "RCB-2026-001", classId: classes[0]._id, sectionId: sections[0]._id, studentCount: 10, status: "Ready", template: "Detailed", createdBy: "System Admin" }]);

  // ---------- Messages (student <-> teacher) ----------
  const s0 = students[0];
  await put("messages", [
    [teachers[0], s0, "Please submit your assignment by Thursday.", 3], [s0, teachers[0], "Sure, I will submit it on time. Thank you, sir.", 2],
    [teachers[0], s0, "Great. Also review chapter 5 before the midterm.", 1],
  ].map(([from, to, text, ago]) => ({ senderId: from.teacherId || from.studentId, senderName: from.name, receiverId: to.teacherId || to.studentId, text, createdAt: daysAgo(ago) })));

  console.log("\nDone. Logins:");
  console.log(`  Admin   : admin@sums.edu / ${ADMIN_PASSWORD}   (role: Admin)`);
  console.log(`  Student : ${students[0].studentId} (or ${students[0].email}) / ${STUDENT_PASSWORD}`);
  await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
