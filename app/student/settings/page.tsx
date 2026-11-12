"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { actions } from "@/lib/siteActions";
import { getTheme, setTheme, type ThemeChoice } from "@/lib/theme";
import { Settings, User, Bell, Lock, Shield, Laptop, Moon, Globe, Trash2, Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("General");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");
  const [updating, setUpdating] = useState(false);

  type Prefs = { theme: ThemeChoice; language: string; timezone: string; email: boolean; push: boolean; sms: boolean; showProfile: boolean; allowMessages: boolean };
  const DEFAULTS: Prefs = { theme: "system", language: "English (United States)", timezone: "UTC+6 (Dhaka, Bangladesh)", email: true, push: true, sms: false, showProfile: true, allowMessages: true };
  const [saved, setSaved] = useState<Prefs>(DEFAULTS);
  const [draft, setDraft] = useState<Prefs>(DEFAULTS);
  const dirty = JSON.stringify(saved) !== JSON.stringify(draft);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("student_prefs") || "{}");
      const p = { ...DEFAULTS, ...stored, theme: getTheme() };
      setSaved(p);
      setDraft(p);
    } catch {}
    const tab = new URLSearchParams(window.location.search).get("tab");
    if (tab) setActiveTab(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setPref = <K extends keyof Prefs>(k: K, v: Prefs[K]) => setDraft((d) => ({ ...d, [k]: v }));

  const savePrefs = () => {
    try {
      const { theme, ...rest } = draft;
      localStorage.setItem("student_prefs", JSON.stringify(rest));
      setTheme(theme);
    } catch {}
    setSaved(draft);
    toast.success("Settings saved");
  };

  const cancelPrefs = () => {
    setDraft(saved);
    toast("Changes discarded");
  };

  const tabs = [
    { name: "General", icon: Settings },
    { name: "Profile", icon: User },
    { name: "Notifications", icon: Bell },
    { name: "Security", icon: Lock },
    { name: "Privacy", icon: Shield },
  ];

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateError("");
    setUpdateSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setUpdateError("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setUpdateError("New passwords do not match.");
      return;
    }

    setUpdating(true);

    try {
      const res = await fetch("/api/student/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update password");
      }

      setUpdateSuccess("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setUpdateError(err.message || "An error occurred");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account preferences and application settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={cn(
                "w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all",
                activeTab === tab.name
                  ? "bg-primary text-white shadow-xl shadow-primary/20"
                  : "text-gray-500 hover:bg-gray-50 hover:text-primary"
              )}
            >
              <tab.icon size={18} />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-8">{activeTab} Settings</h2>

            <div className="space-y-8">
              {activeTab === "General" && (
                <>
                  <SettingSection title="Appearance" description="Choose how SUMS looks on your device.">
                    <div className="grid grid-cols-3 gap-4">
                      <ThemeOption icon={Laptop} label="System" active={draft.theme === "system"} onClick={() => setPref("theme", "system")} />
                      <ThemeOption icon={Moon} label="Dark" active={draft.theme === "dark"} onClick={() => setPref("theme", "dark")} />
                      <ThemeOption icon={Globe} label="Light" active={draft.theme === "light"} onClick={() => setPref("theme", "light")} />
                    </div>
                  </SettingSection>

                  <SettingSection title="Language" description="Select your preferred language for the interface.">
                    <select value={draft.language} onChange={(e) => setPref("language", e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none">
                      <option>English (United States)</option>
                      <option>Bengali (Bangladesh)</option>
                      <option>French (France)</option>
                    </select>
                  </SettingSection>

                  <SettingSection title="Timezone" description="All your schedules will be adjusted to this timezone.">
                    <select
                      value={draft.timezone}
                      onChange={(e) => setPref("timezone", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:outline-none"
                    >
                      {["UTC+6 (Dhaka, Bangladesh)", "UTC+3 (Riyadh, Cairo)", "UTC+0 (London)", "UTC+5:30 (India)", "UTC-5 (New York)"].map((z) => (
                        <option key={z}>{z}</option>
                      ))}
                    </select>
                  </SettingSection>
                </>
              )}

              {activeTab === "Security" && (
                <>
                  <SettingSection title="Change Password" description="Update your password regularly to keep your account secure.">
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                      {updateError && (
                        <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-xs font-bold flex items-center gap-2">
                          <AlertCircle size={16} />
                          {updateError}
                        </div>
                      )}
                      {updateSuccess && (
                        <div className="p-4 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl text-xs font-bold flex items-center gap-2">
                          <CheckCircle2 size={16} />
                          {updateSuccess}
                        </div>
                      )}
                      <input
                        type="password"
                        placeholder="Current Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none"
                      />
                      <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none"
                      />
                      <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={updating}
                        className="px-8 py-3 bg-primary text-white font-black rounded-xl shadow-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                      >
                        {updating && <Loader2 size={16} className="animate-spin" />}
                        Update Password
                      </button>
                    </form>
                  </SettingSection>

                  
                </>
              )}

              {activeTab === "Notifications" && (
                <div className="space-y-6">
                  <NotificationItem title="Email Notifications" description="Receive updates via your university email." active={draft.email} onToggle={() => setPref("email", !draft.email)} />
                  <NotificationItem title="Push Notifications" description="Receive alerts on your browser or mobile." active={draft.push} onToggle={() => setPref("push", !draft.push)} />
                  <NotificationItem title="SMS Alerts" description="Get urgent notices via text message." active={draft.sms} onToggle={() => setPref("sms", !draft.sms)} />
                </div>
              )}

              {activeTab === "Profile" && (
                <SettingSection title="Personal information" description="Your name, contact details, links and photo are managed on your profile page.">
                  <Link href="/student/profile" className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white font-black rounded-xl shadow-lg hover:opacity-90 transition-opacity">
                    <User size={18} /> Edit my profile
                  </Link>
                </SettingSection>
              )}

              {activeTab === "Privacy" && (
                <div className="space-y-6">
                  <NotificationItem title="Show my profile to teachers" description="Teachers of your courses can open your basic profile." active={draft.showProfile} onToggle={() => setPref("showProfile", !draft.showProfile)} />
                  <NotificationItem title="Allow messages" description="Let teachers and classmates start a conversation with you." active={draft.allowMessages} onToggle={() => setPref("allowMessages", !draft.allowMessages)} />
                </div>
              )}
            </div>
          </div>

          {/* Dangerous Zone */}
          <div className="bg-red-50 p-8 rounded-[2rem] border border-red-100">
            <h3 className="text-red-900 font-black mb-2 flex items-center gap-2">
              <Trash2 size={20} />
              Danger Zone
            </h3>
            <p className="text-red-700 text-sm mb-6">Once you deactivate your account, your data will be frozen. Please contact IT support.</p>
            <button
              onClick={() => actions.inquiry("Account deactivation request", { type: "deactivation", title: "Request account deactivation", description: "Your request is sent to the administration. Your account stays active until it is approved.", fields: ["message"], submitLabel: "Send request" })}
              className="px-8 py-3 bg-red-600 text-white font-black rounded-xl shadow-lg hover:bg-red-700 transition-colors"
            >
              Request Deactivation
            </button>
          </div>

          <div className="flex justify-end gap-4">
            <button onClick={cancelPrefs} disabled={!dirty} className="px-8 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button onClick={savePrefs} disabled={!dirty} className="flex items-center gap-2 px-8 py-3 bg-primary text-white font-black rounded-xl shadow-xl hover:opacity-90 transition-opacity disabled:opacity-50">
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      {children}
    </div>
  );
}

function ThemeOption({ icon: Icon, label, active = false, onClick }: { icon: any; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all",
        active
          ? "bg-primary/5 border-primary text-primary"
          : "bg-gray-50 border-gray-100 text-gray-400 hover:border-primary/20 hover:text-primary"
      )}
    >
      <Icon size={24} />
      <span className="text-xs font-bold">{label}</span>
    </button>
  );
}

function NotificationItem({ title, description, active, onToggle }: { title: string; description: string; active: boolean; onToggle?: () => void }) {
  return (
    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100">
      <div>
        <h4 className="text-sm font-bold text-gray-900">{title}</h4>
        <p className="text-[10px] text-gray-500">{description}</p>
      </div>
      <Toggle active={active} onClick={onToggle} />
    </div>
  );
}

function Toggle({ active, onClick }: { active: boolean; onClick?: () => void }) {
  return (
    <div
      role="switch"
      aria-checked={active}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick?.()}
      className={cn(
        "w-12 h-6 rounded-full p-1 transition-colors relative cursor-pointer",
        active ? "bg-primary" : "bg-gray-200"
      )}
    >
      <div
        className={cn(
          "w-4 h-4 bg-white rounded-full transition-transform shadow-sm",
          active ? "translate-x-6" : "translate-x-0"
        )}
      ></div>
    </div>
  );
}
