"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type TeacherData = {
  teacher: { name: string; teacherId: string; email: string; department: string };
  stats: { courses: number; sections: number; students: number; classesPerWeek: number };
  schedule: { day: string; startTime: string; endTime: string; room: string; type: string; course: string; section: string }[];
  courses: { code: string; title: string; credits: number; type: string }[];
  sections: {
    id: string;
    name: string;
    room: string;
    program: string;
    students: { studentId: string; name: string; email: string }[];
  }[];
  announcements: { title: string; content: string; createdAt: string }[];
};

type Ctx = { data: TeacherData | null; error: string; refresh: () => void };
const TeacherDataContext = createContext<Ctx>({ data: null, error: "", refresh: () => {} });

export const TeacherDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<TeacherData | null>(null);
  const [error, setError] = useState("");

  const refresh = React.useCallback(() => {
    fetch("/api/teacher/dashboard")
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load");
        setData(json);
      })
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return <TeacherDataContext.Provider value={{ data, error, refresh }}>{children}</TeacherDataContext.Provider>;
};

export const useTeacherData = () => useContext(TeacherDataContext);

/** Renders loading / error states; calls children once data is ready. */
export const WithTeacherData = ({ children }: { children: (data: TeacherData) => React.ReactNode }) => {
  const { data, error } = useTeacherData();
  if (error) return <div className="text-red-600 font-bold">{error}</div>;
  if (!data) return <div className="text-primary/60 font-bold">Loading...</div>;
  return <>{children(data)}</>;
};
