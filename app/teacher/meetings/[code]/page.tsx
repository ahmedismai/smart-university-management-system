"use client";

import { useParams } from "next/navigation";
import MeetingRoom from "@/components/meeting/MeetingRoom";

export default function TeacherMeetingRoomPage() {
  const { code } = useParams<{ code: string }>();
  return <MeetingRoom code={code} apiBase="/api/teacher/meetings" backHref="/teacher/meetings" />;
}
