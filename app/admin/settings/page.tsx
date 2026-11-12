"use client";

import React from "react";
import Link from "next/link";
import useSWR from "swr";
import { Settings as SettingsIcon, Shield, Bell, Mail, Database, Globe, Smartphone } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Settings() {
  const { data } = useSWR("/api/admin/settings", fetcher, { refreshInterval: 30000 });
  const db = data?.database;
  const sections = [
    { title: "System Configuration", desc: "Attendance policy, academic calendar and holidays.", icon: SettingsIcon, href: "/admin/attendance/policies" },
    { title: "User Roles & Permissions", desc: "Manage access levels for students, teachers and staff.", icon: Shield, href: "/admin/roles" },
    { title: "Email & Notifications", desc: "Configure SMTP and system-wide alert templates.", icon: Mail, href: "/admin/announcements" },
    { title: "Admission Applications", desc: "Review and decide on submitted admission applications.", icon: Database, href: "/admin/applications" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">System Settings</h1>
        <p className="text-slate-500">Global configuration and administrative control panel.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          {sections.map((section, i) => (
            <Link href={section.href} key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4 hover:border-primary/20 transition-all cursor-pointer group">
              <div className="bg-slate-50 p-3 rounded-xl text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                <section.icon size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 mb-1">{section.title}</h3>
                <p className="text-sm text-slate-500">{section.desc}</p>
              </div>
              <span className="px-4 py-2 text-primary font-bold text-sm group-hover:underline">Open</span>
            </Link>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Database Size</span>
                <span className="text-sm font-bold">{db ? `${db.sizeMB} MB` : "..."}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Collections / Documents</span>
                <span className="text-sm font-bold">{db ? `${db.collections} / ${db.documents}` : "..."}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">DB Latency</span>
                <span className="text-sm font-bold text-emerald-600">{db ? `${db.latencyMs} ms` : "..."}</span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
            <h3 className="font-bold text-emerald-800 mb-2">{data?.success ? "System Healthy" : data ? "Check Required" : "Checking..."}</h3>
            <p className="text-xs text-emerald-600 mb-4">
              {data?.success
                ? `Database "${db.name}" is reachable. ${data.pendingApplications} pending application(s), ${data.unreadAlerts} unread alert(s).`
                : data?.error || "Contacting the database..."}
            </p>
            <Link href="/admin/audit-logs" className="block text-center w-full py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer">
              View System Logs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
