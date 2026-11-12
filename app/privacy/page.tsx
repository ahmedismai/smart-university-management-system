export const metadata = { title: "Privacy Policy | NextGen University of Bangladesh" };

const sections = [
  {
    title: "Information we collect",
    body: "We collect the information you give us when you apply, register or use the portals: name, student or employee ID, email, phone number, academic records, attendance, fee records and the files you upload.",
  },
  {
    title: "How we use it",
    body: "Your information is used to run academic and administrative services: enrolment, teaching, attendance, results, fees, library and communication. We do not sell personal data.",
  },
  {
    title: "Who can see it",
    body: "Teachers see the students of their own sections. Students only see their own records and the course material of their section. Administrators can access records needed to operate the university.",
  },
  {
    title: "Your files and messages",
    body: "Documents you upload to your profile are visible only to you. Lecture files are visible to the students of the course's section. Messages are visible to the sender and the recipient.",
  },
  {
    title: "Retention and your rights",
    body: "Records are kept for as long as the academic and legal requirements of the university demand. You can ask the Registrar's office to correct or delete personal data through the contact form.",
  },
  {
    title: "Cookies",
    body: "We use a small session cookie to keep you signed in. Preferences such as theme and saved items are stored in your browser.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-black text-[#0F2E5D]">Privacy Policy</h1>
      <p className="text-gray-500 mt-3">How NextGen University of Bangladesh handles your personal information.</p>
      <div className="mt-10 space-y-8">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-xl font-bold text-gray-900">{s.title}</h2>
            <p className="text-gray-600 mt-2 leading-relaxed">{s.body}</p>
          </section>
        ))}
      </div>
      <p className="text-sm text-gray-400 mt-12">Questions? Write to registrar@nextgen.university.</p>
    </main>
  );
}
