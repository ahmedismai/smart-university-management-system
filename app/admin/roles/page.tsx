"use client";

import React from "react";
import { 
  ShieldCheck, 
  Users, 
  Plus, 
  Lock, 
  Eye, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle,
  Settings,
  ShieldAlert,
  Save,
  RotateCcw,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const ROLE_STYLE: Record<string, string> = {
  Admin: "text-blue-600 bg-blue-100",
  Teacher: "text-emerald-600 bg-emerald-100",
  Student: "text-purple-600 bg-purple-100",
  Staff: "text-amber-600 bg-amber-100",
  Parent: "text-pink-600 bg-pink-100",
};

type RoleInfo = {
  name: string;
  users: number;
  permissions: Record<string, string[]>;
  customized: boolean;
  defaults: Record<string, string[]>;
};

export default function RoleManagement() {
  const [selectedRole, setSelectedRole] = React.useState("Admin");
  const [roles, setRoles] = React.useState<RoleInfo[]>([]);
  const [modules, setModules] = React.useState<string[]>([]);
  const [actions, setActions] = React.useState<string[]>([]);
  const [draft, setDraft] = React.useState<Record<string, string[]>>({});
  const [saving, setSaving] = React.useState(false);

  const load = React.useCallback(async () => {
    const res = await fetch("/api/admin/roles");
    const json = await res.json();
    if (res.ok) {
      setRoles(json.roles);
      setModules(json.modules);
      setActions(json.actions);
    } else toast.error(json.error || "Failed to load roles");
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const current = roles.find((r) => r.name === selectedRole);
  React.useEffect(() => {
    if (current) setDraft(current.permissions);
  }, [selectedRole, roles]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = (module: string, action: string) =>
    setDraft((d) => {
      const has = (d[module] || []).includes(action);
      return { ...d, [module]: has ? d[module].filter((a) => a !== action) : [...(d[module] || []), action] };
    });

  const save = async () => {
    setSaving(true);
    const res = await fetch("/api/admin/roles", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: selectedRole, permissions: draft }),
    });
    const json = await res.json();
    if (res.ok) {
      toast.success(`Permissions saved for ${selectedRole}`);
      load();
    } else toast.error(json.error || "Failed to save");
    setSaving(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Role & Permission Management</h1>
          <p className="text-slate-500">Define system access levels and module-specific permissions.</p>
        </div>
        
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Roles List */}
        <div className="xl:col-span-1 space-y-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 px-1">
            <Users size={18} className="text-primary" />
            System Roles
          </h3>
          <div className="space-y-3">
            {roles.map((role, i) => (
              <motion.button
                key={role.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedRole(role.name)}
                className={`w-full p-4 rounded-2xl border transition-all text-left group ${
                  selectedRole === role.name 
                  ? 'bg-white border-primary shadow-lg ring-1 ring-primary' 
                  : 'bg-white border-slate-100 hover:border-primary/30 hover:shadow-md'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-widest ${ROLE_STYLE[role.name]}`}>
                    {role.name}
                  </span>
                  <ChevronRight size={16} className={`transition-transform ${selectedRole === role.name ? 'translate-x-1 text-primary' : 'text-slate-300'}`} />
                </div>
                <h4 className="font-bold text-slate-800 group-hover:text-primary transition-colors">{role.name}</h4>
                <div className="flex items-center justify-between mt-3 text-[10px] font-bold text-slate-400">
                   <span className="flex items-center gap-1"><Users size={12} /> {role.users} Users Assigned</span>
                   <span className={role.customized ? 'text-emerald-500' : 'text-slate-400'}>{role.customized ? 'Customized' : 'Default'}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Permissions Matrix */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <div>
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Lock size={18} className="text-primary" />
                  Permissions Matrix: <span className="text-primary">{selectedRole}</span>
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Configure module-level access</p>
              </div>
              <div className="flex gap-2">
                <button title="Reset to defaults" onClick={() => current && setDraft(current.defaults)} className="p-2.5 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-xl transition-all cursor-pointer">
                  <RotateCcw size={20} />
                </button>
                <button onClick={save} disabled={saving} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/10 hover:shadow-xl transition-all cursor-pointer disabled:opacity-60">
                  <Save size={16} />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                  <tr>
                    <th className="px-8 py-4">Module Name</th>
                    {actions.map(p => (
                      <th key={p} className="px-6 py-4 text-center">{p}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {modules.map((module, i) => (
                    <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-8 py-5">
                        <span className="text-sm font-bold text-slate-700">{module}</span>
                      </td>
                      {actions.map((p, j) => (
                        <td key={j} className="px-6 py-5 text-center">
                          <label className="inline-flex items-center justify-center cursor-pointer group">
                            <input 
                              type="checkbox" 
                              checked={(draft[module] || []).includes(p)}
                              onChange={() => toggle(module, p)}
                              className="hidden peer"
                            />
                            <div className="w-6 h-6 border-2 border-slate-200 rounded-lg flex items-center justify-center transition-all peer-checked:bg-primary peer-checked:border-primary group-hover:border-primary/50">
                              <CheckCircle2 size={14} className="text-white scale-0 transition-transform peer-checked:scale-100" />
                            </div>
                          </label>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Warning Section */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 flex items-start gap-4">
            <div className="bg-amber-100 p-3 rounded-xl text-amber-600">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h4 className="font-bold text-amber-900 mb-1">Critical Permissions Warning</h4>
              <p className="text-sm text-amber-700">Changing permissions for the <span className="font-bold">{selectedRole}</span> role will immediately affect <span className="font-bold">{current?.users ?? 0} users</span>. All active sessions for this role will be updated upon their next navigation.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800 rounded-2xl p-6 text-white group cursor-pointer hover:shadow-xl transition-all border border-slate-700">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-primary/20 p-3 rounded-xl">
                  <ShieldCheck size={20} className="text-secondary" />
                </div>
                <Settings size={18} className="text-slate-500 group-hover:rotate-90 transition-transform duration-500" />
              </div>
              <h4 className="font-bold mb-1">Global Security Policies</h4>
              <p className="text-xs text-slate-400">Configure 2FA requirements and session timeout policies for all roles.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm group cursor-pointer hover:shadow-xl transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <Users size={20} className="text-primary" />
                </div>
                <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
              </div>
              <h4 className="font-bold text-slate-800 mb-1">Assign Users to Roles</h4>
              <p className="text-xs text-slate-500">Quickly move users between different permission levels and roles.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
