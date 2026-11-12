"use client";

import { actions } from "@/lib/siteActions";
import toast from "react-hot-toast";
import { EntityModal, ConfirmDelete, type EntityField } from "@/components/admin/EntityModal";
import React from "react";
import useSWR from "swr";
import { 
  Building2, 
  Bus, 
  Users, 
  MapPin, 
  Search, 
  Plus, 
  ChevronRight, 
  Bed, 
  Home, 
  Navigation,
  Clock,
  Settings,
  MoreVertical,
  X,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function HostelTransportPage() {
  const [activeTab, setActiveTab] = React.useState<"hostel" | "transport">("hostel");
  const [isHostelModalOpen, setIsHostelModalOpen] = React.useState(false);
  const [hostelForm, setHostelForm] = React.useState({ name: '', type: 'Boys', capacity: '', occupied: 0, status: 'Available' });
  const [isRouteModalOpen, setIsRouteModalOpen] = React.useState(false);
  const [routeForm, setRouteForm] = React.useState({ route: '', vehicle: '', time: '', students: 0, status: 'On Time' });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [manage, setManage] = React.useState<any>(null);
  const [removeHostel, setRemoveHostel] = React.useState<any>(null);
  const [allocStudent, setAllocStudent] = React.useState("");
  const [allocHostel, setAllocHostel] = React.useState("");
  const [allocating, setAllocating] = React.useState(false);

  const allocate = async () => {
    setAllocating(true);
    try {
      const res = await fetch("/api/admin/hostels/allocate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: allocStudent, hostelId: allocHostel }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Allocation failed");
      toast.success(json.message);
      setAllocStudent("");
      mutateHostels();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setAllocating(false);
    }
  };

  const hostelFields: EntityField[] = [
    { name: "name", label: "Hostel name", required: true },
    { name: "type", label: "Type", type: "select", options: ["Boys", "Girls", "Mixed"], required: true },
    { name: "capacity", label: "Capacity (beds)", required: true },
    { name: "occupied", label: "Occupied beds" },
    { name: "status", label: "Status", type: "select", options: ["Available", "Full", "Maintenance"] },
  ];

  const { data: hostelData, isLoading: hostelLoading, mutate: mutateHostels } = useSWR("/api/admin/hostels", fetcher);
  const { data: transportData, isLoading: transportLoading, mutate: mutateTransport } = useSWR("/api/admin/transport", fetcher);

  const handleAddHostel = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/hostels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...hostelForm,
          capacity: Number(hostelForm.capacity),
          occupied: Number(hostelForm.occupied)
        })
      });
      if (res.ok) {
        mutateHostels();
        setIsHostelModalOpen(false);
        setHostelForm({ name: '', type: 'Boys', capacity: '', occupied: 0, status: 'Available' });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/transport", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...routeForm,
          students: Number(routeForm.students)
        })
      });
      if (res.ok) {
        mutateTransport();
        setIsRouteModalOpen(false);
        setRouteForm({ route: '', vehicle: '', time: '', students: 0, status: 'On Time' });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hostels: any[] = hostelData?.data?.hostels || [];
  const hStats = hostelData?.data?.stats || { totalCapacity: 0, occupied: 0, available: 0 };
  const hostelStats = [
    { label: "Total Capacity", value: hStats.totalCapacity.toString(), icon: Bed, color: "bg-blue-100 text-blue-600" },
    { label: "Occupied", value: hStats.occupied.toString(), icon: Users, color: "bg-emerald-100 text-emerald-600" },
    { label: "Available", value: hStats.available.toString(), icon: Home, color: "bg-amber-100 text-amber-600" },
  ];

  const busRoutes: any[] = transportData?.data?.routes || [];
  const tStats = transportData?.data?.stats || { totalVehicles: 0, activeRoutes: 0, subscribed: 0 };
  const transportStats = [
    { label: "Total Vehicles", value: tStats.totalVehicles.toString(), icon: Bus, color: "bg-purple-100 text-purple-600" },
    { label: "Active Routes", value: tStats.activeRoutes.toString(), icon: Navigation, color: "bg-orange-100 text-orange-600" },
    { label: "Subscribed", value: tStats.subscribed.toString(), icon: Users, color: "bg-indigo-100 text-indigo-600" },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Hostel & Transport</h1>
          <p className="text-slate-500">Manage student accommodation and university transportation system.</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <button 
            onClick={() => setActiveTab("hostel")}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'hostel' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-primary'
            }`}
          >
            Hostel
          </button>
          <button 
            onClick={() => setActiveTab("transport")}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'transport' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-primary'
            }`}
          >
            Transport
          </button>
        </div>
      </div>

      {activeTab === "hostel" ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Hostel Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hostelStats.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className={`${stat.color} p-4 rounded-xl`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Hostel List */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Building2 size={20} className="text-primary" />
                  Hostel Inventory
                </h3>
                <button 
                  onClick={() => setIsHostelModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold hover:bg-primary hover:text-white transition-all cursor-pointer"
                >
                  <Plus size={14} />
                  Add Hostel
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                    <tr>
                      <th className="px-6 py-4">Hostel Name</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Occupancy</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {hostels.map((hostel, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-800 text-sm">{hostel.name}</td>
                        <td className="px-6 py-4 text-xs text-slate-500">{hostel.type}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex justify-between text-[10px] font-bold">
                              <span>{hostel.occupied}/{hostel.capacity}</span>
                              <span>{Math.round((hostel.occupied/hostel.capacity)*100)}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${hostel.status === 'Full' ? 'bg-red-500' : 'bg-emerald-500'}`} 
                                style={{ width: `${(hostel.occupied/hostel.capacity)*100}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                            hostel.status === 'Full' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
                          }`}>
                            {hostel.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <button onClick={() => setManage(hostel)} className="text-primary font-bold text-xs hover:underline cursor-pointer">Manage</button>
                            <button onClick={() => setRemoveHostel(hostel)} className="text-red-500 font-bold text-xs hover:underline cursor-pointer">Remove</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Allocation */}
            <div className="bg-slate-800 rounded-2xl p-6 text-white h-fit">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-secondary">
                <Bed size={20} />
                Quick Allocation
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Student ID</label>
                  <input type="text" value={allocStudent} onChange={(e) => setAllocStudent(e.target.value)} placeholder="e.g. CSE2024001" className="w-full bg-slate-700 border-none rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/50" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Select Hostel</label>
                  <select value={allocHostel} onChange={(e) => setAllocHostel(e.target.value)} className="w-full bg-slate-700 border-none rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/50">
                    <option value="">Select Option</option>
                    {hostels.map((h) => (
                      <option key={h._id} value={h._id} disabled={h.status === "Maintenance" || h.occupied >= h.capacity}>
                        {h.name} ({h.occupied}/{h.capacity})
                      </option>
                    ))}
                  </select>
                </div>
                <button onClick={allocate} disabled={allocating || !allocStudent.trim() || !allocHostel} className="w-full py-3 bg-secondary text-primary font-bold rounded-xl text-sm hover:bg-white transition-all cursor-pointer mt-4 disabled:opacity-50">
                  {allocating ? "Allocating..." : "Allocate Room"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Transport Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {transportStats.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className={`${stat.color} p-4 rounded-xl`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Bus Routes List */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Navigation size={20} className="text-primary" />
                  Active Bus Routes
                </h3>
                <div className="flex gap-2">
                   <button onClick={() => actions.filter("Search this page")} className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 cursor-pointer"><Search size={16} /></button>
                   <button 
                    onClick={() => setIsRouteModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold shadow-lg shadow-primary/20 cursor-pointer"
                  >
                    <Plus size={14} />
                    New Route
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                    <tr>
                      <th className="px-6 py-4">Route Name</th>
                      <th className="px-6 py-4">Vehicle</th>
                      <th className="px-6 py-4">Departure</th>
                      <th className="px-6 py-4">Subscribed</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {busRoutes.map((route, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-800 text-sm">{route.route}</td>
                        <td className="px-6 py-4 text-xs text-slate-500">{route.vehicle}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-xs text-slate-600">
                            <Clock size={14} className="text-slate-400" />
                            {route.time}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-slate-600">{route.students} Students</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                            route.status === 'On Time' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                          }`}>
                            {route.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={(e) => actions.details(e)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 cursor-pointer"><MoreVertical size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tracking Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                  <MapPin size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Live Fleet Tracking</h3>
                <p className="text-sm text-slate-500 mb-6">Real-time GPS tracking for all active university buses and shuttle services.</p>
                <button onClick={() => actions.go("/students/transport")} className="w-full py-3 bg-primary text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-primary/20 transition-all cursor-pointer">
                  Launch Map
                  <ChevronRight size={16} />
                </button>
              </div>
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Navigation size={120} />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Add Hostel Modal */}
      {isHostelModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Add New Hostel</h3>
              <button 
                onClick={() => setIsHostelModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddHostel} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Hostel Name</label>
                <input 
                  required
                  type="text"
                  value={hostelForm.name}
                  onChange={(e) => setHostelForm({...hostelForm, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="e.g. Al-Azhar Hall"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Type</label>
                  <select 
                    value={hostelForm.type}
                    onChange={(e) => setHostelForm({...hostelForm, type: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="Boys">Boys</option>
                    <option value="Girls">Girls</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Status</label>
                  <select 
                    value={hostelForm.status}
                    onChange={(e) => setHostelForm({...hostelForm, status: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="Available">Available</option>
                    <option value="Full">Full</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Capacity</label>
                  <input 
                    required
                    type="number"
                    value={hostelForm.capacity}
                    onChange={(e) => setHostelForm({...hostelForm, capacity: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Total beds"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Occupied</label>
                  <input 
                    required
                    type="number"
                    value={hostelForm.occupied}
                    onChange={(e) => setHostelForm({...hostelForm, occupied: Number(e.target.value)})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Filled beds"
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsHostelModalOpen(false)}
                  className="flex-1 px-4 py-2.5 text-slate-500 font-bold text-sm bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 text-white font-bold text-sm bg-primary hover:bg-primary/90 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Save Hostel"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Add Route Modal */}
      {isRouteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Add New Route</h3>
              <button 
                onClick={() => setIsRouteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddRoute} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Route Name</label>
                <input 
                  required
                  type="text"
                  value={routeForm.route}
                  onChange={(e) => setRouteForm({...routeForm, route: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="e.g. Route A (Nasr City)"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Vehicle ID</label>
                  <input 
                    required
                    type="text"
                    value={routeForm.vehicle}
                    onChange={(e) => setRouteForm({...routeForm, vehicle: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="e.g. Bus-04"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Status</label>
                  <select 
                    value={routeForm.status}
                    onChange={(e) => setRouteForm({...routeForm, status: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="On Time">On Time</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Departure Time</label>
                  <input 
                    required
                    type="text"
                    value={routeForm.time}
                    onChange={(e) => setRouteForm({...routeForm, time: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="e.g. 07:30 AM"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Subscribed Students</label>
                  <input 
                    required
                    type="number"
                    value={routeForm.students}
                    onChange={(e) => setRouteForm({...routeForm, students: Number(e.target.value)})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Number"
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsRouteModalOpen(false)}
                  className="flex-1 px-4 py-2.5 text-slate-500 font-bold text-sm bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 text-white font-bold text-sm bg-primary hover:bg-primary/90 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Save Route"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      {manage && (
        <EntityModal title="Manage hostel" mode="edit" endpoint="/api/admin/hostels" fields={hostelFields} initial={manage} onClose={() => setManage(null)} onSaved={() => mutateHostels()} />
      )}
      {removeHostel && <ConfirmDelete what="hostel" endpoint="/api/admin/hostels" id={removeHostel._id} onClose={() => setRemoveHostel(null)} onDone={() => mutateHostels()} />}
    </div>
  );
}
