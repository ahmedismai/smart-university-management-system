import { StudentDashboardLayout } from "@/components/dashboard/StudentDashboardLayout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StudentDashboardLayout>{children}</StudentDashboardLayout>;
}
