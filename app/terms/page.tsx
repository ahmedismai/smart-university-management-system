export const metadata = { title: "Terms of Use | NextGen University of Bangladesh" };

const sections = [
  {
    title: "Acceptance",
    body: "By using this website and its student, teacher and administration portals you agree to these terms and to the university's regulations.",
  },
  {
    title: "Accounts",
    body: "Your account is personal. Keep your password secret and report any suspected misuse. Sharing credentials may lead to suspension of access.",
  },
  {
    title: "Acceptable use",
    body: "Do not attempt to access other people's data, disrupt the service, upload harmful or unlawful files, or use the portals for anything other than university purposes.",
  },
  {
    title: "Content",
    body: "Lecture material shared by teachers is for the enrolled students and may not be redistributed. You are responsible for the files and messages you submit.",
  },
  {
    title: "Availability",
    body: "We aim to keep the services available but do not guarantee uninterrupted access. Maintenance windows are announced on the notice board.",
  },
  {
    title: "Changes",
    body: "These terms may be updated. Continued use of the services after a change means you accept the updated terms.",
  },
];

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-black text-[#0F2E5D]">Terms of Use</h1>
      <p className="text-gray-500 mt-3">The rules for using the university website and portals.</p>
      <div className="mt-10 space-y-8">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-xl font-bold text-gray-900">{s.title}</h2>
            <p className="text-gray-600 mt-2 leading-relaxed">{s.body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
