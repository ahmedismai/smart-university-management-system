import { KNOWLEDGE } from "./knowledge";
import type { StudentFacts } from "./studentContext";

/**
 * Offline answers (no AI key needed): personal answers from the student's real data,
 * general answers from the knowledge base by keyword match.
 */
const isArabic = (t: string) => /[؀-ۿ]/.test(t);
const has = (q: string, words: string[]) => words.some((w) => q.includes(w));

const GREETING = ["hello", "hi ", "hey", "good morning", "good evening", "سلام", "اهلا", "أهلا", "مرحبا", "ازيك", "إزيك", "صباح", "مساء"];

const PERSONAL = {
  attendance: ["attendance", "absent", "present", "حضور", "غياب", "حضوري", "غيابي"],
  fees: ["due", "owe", "my fee", "my fees", "unpaid", "pending fee", "عليا", "عليّ", "مستحق", "مصاريفي", "رسومي", "متأخر"],
  schedule: ["schedule", "routine", "timetable", "today", "tomorrow", "next class", "جدول", "جدولي", "النهاردة", "بكرة", "المحاضرة الجاية"],
  courses: ["my course", "my courses", "enrolled", "subjects", "كورساتي", "موادي", "المواد", "الكورسات"],
  books: ["my book", "borrowed", "due date", "return", "كتبي", "استعرت", "ميعاد الرجوع"],
  news: ["announcement", "notice", "news", "اعلان", "إعلان", "اعلانات", "إعلانات", "اخبار", "أخبار"],
  who: ["who am i", "my name", "my id", "انا مين", "اسمي", "رقمي"],
};

export function offlineAnswer(question: string, facts: StudentFacts | null): string {
  const q = ` ${question.toLowerCase()} `;
  const ar = isArabic(question);
  const T = (en: string, arabic: string) => (ar ? arabic : en);

  const needLogin = () =>
    T(
      "This is about your personal records, so please sign in to the student portal first (/login/student) and ask me again.",
      "ده بيخص بياناتك الشخصية، فسجّل دخولك لبوابة الطالب الأول (/login/student) وبعدها اسألني تاني."
    );

  if (has(q, GREETING) && question.length < 40) {
    return facts
      ? T(`Hello ${facts.name}! Ask me about your attendance, fees, schedule, courses, library or anything about the university.`, `أهلاً ${facts.name}! اسألني عن حضورك أو مصاريفك أو جدولك أو موادك أو أي حاجة في الجامعة.`)
      : T("Hello! I can answer questions about admission, library, halls, transport, calendar and more. Sign in as a student to ask about your own records.", "أهلاً! أقدر أجاوبك عن القبول والمكتبة والسكن والمواصلات والتقويم وغيرها. سجّل دخولك كطالب لو عايز تسأل عن بياناتك.");
  }

  if (has(q, PERSONAL.attendance)) {
    if (!facts) return needLogin();
    const a = facts.attendance;
    if (!a.total) return T("There are no attendance records for you yet.", "لسه مفيش سجلات حضور ليك.");
    return T(
      `Your attendance is ${a.percent}%: ${a.present} present, ${a.late} late, ${a.absent} absent and ${a.excused} excused out of ${a.total} recorded days.${(a.percent ?? 100) < 75 ? " It is below 75%, so try not to miss more classes." : ""}`,
      `نسبة حضورك ${a.percent}%: حضرت ${a.present} يوم، متأخر ${a.late}، غياب ${a.absent}، معذور ${a.excused} من ${a.total} يوم مسجّل.${(a.percent ?? 100) < 75 ? " النسبة أقل من 75% فحاول متغيبش تاني." : ""}`
    );
  }

  if (has(q, PERSONAL.fees)) {
    if (!facts) return needLogin();
    const f = facts.feesDue;
    const fi = facts.fines;
    if (!f.items.length && !fi.items.length) return T("You have no pending fees or fines.", "مفيش عليك مصاريف ولا غرامات مستحقة.");
    const total = f.total + fi.total;
    const list = [
      ...f.items.map((i) => `${i.name}: ${i.amount} ${T("EGP", "جنيه")} (${T("due", "الاستحقاق")} ${i.due})`),
      ...fi.items.map((i) => `${T("Fine", "غرامة")} - ${i.type}: ${i.amount} ${T("EGP", "جنيه")}`),
    ].join("\n");
    return T(`You owe ${total} EGP (Egyptian pounds) in total:\n${list}\nYou can pay from Fees & Payment.`, `عليك ${total} جنيه مصري إجمالي:\n${list}\nتقدر تدفع من صفحة Fees & Payment.`);
  }

  if (has(q, PERSONAL.schedule)) {
    if (!facts) return needLogin();
    if (!facts.schedule.length) return T("No classes are scheduled for your section yet.", "لسه مفيش محاضرات في جدول سكشنك.");
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const wantsToday = has(q, ["today", "النهاردة"]);
    const wantsTomorrow = has(q, ["tomorrow", "بكرة"]);
    const target = wantsToday ? days[new Date().getDay()] : wantsTomorrow ? days[(new Date().getDay() + 1) % 7] : null;
    const rows = facts.schedule.filter((s) => !target || s.day === target);
    if (!rows.length) return T(`You have no classes on ${target}.`, `مفيش عندك محاضرات يوم ${target}.`);
    return (target ? T(`Your classes on ${target}:\n`, `محاضراتك يوم ${target}:\n`) : T("Your weekly schedule:\n", "جدولك الأسبوعي:\n")) +
      rows.map((s) => `${s.day} ${s.time} - ${s.course} (${s.type}, ${s.room})`).join("\n");
  }

  if (has(q, PERSONAL.courses)) {
    if (!facts) return needLogin();
    return facts.courses.length ? T(`Your courses:\n${facts.courses.join("\n")}`, `موادك:\n${facts.courses.join("\n")}`) : T("No courses are assigned to your section yet.", "لسه مفيش مواد متسجلة لسكشنك.");
  }

  if (has(q, PERSONAL.books)) {
    if (!facts) return needLogin();
    return facts.books.length
      ? T("Books you borrowed:\n", "الكتب اللي مستعيرها:\n") + facts.books.map((b) => `${b.title} - ${T("due", "الرجوع")} ${b.due} (${b.status})`).join("\n")
      : T("You have no borrowed books.", "مفيش كتب مستعيرها حاليًا.");
  }

  if (has(q, PERSONAL.news) && facts) {
    return facts.announcements.length
      ? T("Latest announcements:\n", "آخر الإعلانات:\n") + facts.announcements.map((a) => `${a.date} - ${a.title}`).join("\n")
      : T("There are no announcements right now.", "مفيش إعلانات دلوقتي.");
  }

  if (has(q, PERSONAL.who) && facts) {
    return T(`You are ${facts.name}, student ID ${facts.studentId}${facts.program ? `, ${facts.program}` : ""}${facts.section ? `, ${facts.section}` : ""}.`, `انت ${facts.name}، رقمك ${facts.studentId}${facts.program ? `، ${facts.program}` : ""}${facts.section ? `، ${facts.section}` : ""}.`);
  }

  // general knowledge base
  let best: { score: number; text: string } | null = null;
  for (const k of KNOWLEDGE) {
    const score = k.keywords.reduce((n, w) => n + (q.includes(w.toLowerCase()) ? 1 : 0), 0);
    if (score > 0 && (!best || score > best.score)) best = { score, text: k.answer };
  }
  if (best) return best.text;

  return T(
    "I can help with: your attendance, fees, schedule, courses, borrowed books and announcements (after signing in), and general questions about admission, scholarships, library, halls, transport, health insurance, the academic calendar, contact details and how to use the portal. Try asking one of those.",
    "أقدر أساعدك في: حضورك ومصاريفك وجدولك وموادك وكتبك والإعلانات (بعد تسجيل الدخول)، وأسئلة عامة عن القبول والمنح والمكتبة والسكن والمواصلات والتأمين الصحي والتقويم الأكاديمي وبيانات التواصل وإزاي تستخدم البوابة. جرّب تسأل في واحد منهم."
  );
}
