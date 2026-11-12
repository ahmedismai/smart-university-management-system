"use client";

import { useParams } from "next/navigation";
import MeetingRoom from "@/components/meeting/MeetingRoom";

export default function StudentMeetingRoomPage() {
  const { code } = useParams<{ code: string }>();
  return <MeetingRoom code={code} apiBase="/api/student/meetings" backHref="/student/meetings" />;
}
