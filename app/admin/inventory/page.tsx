"use client";

import { actions } from "@/lib/siteActions";
import { EntityModal, ConfirmDelete, type EntityField } from "@/components/admin/EntityModal";
import { InventoryAuditModal } from "@/components/admin/InventoryAuditModal";
import React, { useState } from "react";
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle, 
  Activity, 
  Banknote as DollarSign, 
  Box, 
  Eye, 
  Edit3, 
  Trash2, 
  ArrowUpRight,
  ClipboardList,
  History
} from "lucide-react";
import { motion } from "framer-motion";
import useSWR from "swr";
import { toast } from "react-hot-toast";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function InventoryPage() {
  const { data, error, mutate } = useSWR("/api/admin/inventory", fetcher);

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All Categories");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAssetData, setNewAssetData] = useState({ itemName: "", category: "", quantity: 1, unit: "Pcs", unitPrice: 0, location: "", status: "In Stock" });
  const [isAdding, setIsAdding] = useState(false);
  const [rowModal, setRowModal] = useState<{ mode: "view" | "edit"; item: any } | null>(null);
  const [deleting, setDeleting] = useState<any>(null);
  const [auditOpen, setAuditOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const assetFields: EntityField[] = [
    { name: "itemName", label: "Item name", required: true },
    { name: "category", label: "Category", required: true },
    { name: "quantity", label: "Quantity", required: true },
    { name: "unit", label: "Unit" },
    { name: "unitPrice", label: "Unit price (EGP)" },
    { name: "location", label: "Location" },
    { name: "status", label: "Status", type: "select", options: ["In Stock", "Out of Stock", "Under Maintenance"] },
  ];

  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      const res = await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAssetData),
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Asset added successfully");
        setIsAddModalOpen(false);
        setNewAssetData({ itemName: "", category: "", quantity: 1, unit: "Pcs", unitPrice: 0, location: "", status: "In Stock" });
        mutate();
      } else {
        toast.error(result.message || "Failed to add asset");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsAdding(false);
    }
  };

  if (error) return <div className="p-8 text-center text-red-500">Failed to load inventory data</div>;
  if (!data) return <div className="p-8 text-center text-slate-500 animate-pulse">Loading inventory dashboard...</div>;

  const { inventory: apiInventory, stats: apiStats, recentActivities: apiRecentActivities, lastAudit } = data.data;

  const dynamicStats = [
    { label: "Total Assets", value: apiStats.totalAssets.toLocaleString(), icon: Box, color: "bg-blue-500", trend: "+5%" },
    { label: "Low Stock Items", value: apiStats.lowStock.toLocaleString(), icon: AlertTriangle, color: "bg-amber-500", trend: "Critical" },
    { label: "In Maintenance", value: apiStats.maintenance.toLocaleString(), icon: Activity, color: "bg-purple-500", trend: "-2%" },
    { label: "Total Asset Value", value: apiStats.totalValue, icon: DollarSign, color: "bg-emerald-500", trend: "+12%" },
  ];

  const filteredInventory = apiInventory.filter((item: any) => {
    const term = searchQuery.toLowerCase();
    const matchSearch = item.itemName?.toLowerCase().includes(term) || item._id?.toLowerCase().includes(term);
    const matchFilter = filter === "All Categories" || item.category === filter;
    return matchSearch && matchFilter;
  });
  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Inventory & Assets</h1>
          <p className="text-slate-500">Track, manage and audit all university assets and supplies.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setAuditOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer">
            <ClipboardList size={16} />
            Inventory Audit
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 cursor-pointer"
          >
            <Plus size={16} />
            Add New Asset
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dynamicStats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.color} p-3 rounded-xl text-white`}>
                <stat.icon size={20} />
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                stat.trend.includes('+') ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
              }`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Main Inventory Table */}
        <div className="xl:col-span-3 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by name, ID or category..." 
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => actions.filter("Filter rows")} className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-primary transition-colors cursor-pointer">
                <Filter size={18} />
              </button>
              <select 
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
              >
                <option>All Categories</option>
                <option>Electronics</option>
                <option>Furniture</option>
                <option>Lab Equipment</option>
                <option>Office Supplies</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                  <tr>
                    <th className="px-6 py-4">Asset ID</th>
                    <th className="px-6 py-4">Item Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {(showAll ? filteredInventory : filteredInventory.slice(0, 8)).map((item: any) => (
                    <tr key={item._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 text-xs font-bold text-primary">{item._id.slice(-6).toUpperCase()}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-800">{item.itemName}</span>
                          <span className="text-[10px] text-slate-400">Added: {new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-600">{item.category}</td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-800">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'In Stock' ? 'bg-emerald-100 text-emerald-700' : 
                          item.status === 'Out of Stock' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {item.quantity > 0 && item.quantity <= 10 && item.status === 'In Stock' ? "Low Stock" : item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => setRowModal({ mode: "view", item })} title="View" className="p-1.5 text-slate-400 hover:text-primary transition-all cursor-pointer"><Eye size={16} /></button>
                          <button onClick={() => setRowModal({ mode: "edit", item })} title="Edit" className="p-1.5 text-slate-400 hover:text-amber-600 transition-all cursor-pointer"><Edit3 size={16} /></button>
                          <button onClick={() => setDeleting(item)} title="Delete" className="p-1.5 text-slate-400 hover:text-red-600 transition-all cursor-pointer"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Showing {showAll ? filteredInventory.length : Math.min(8, filteredInventory.length)} of {filteredInventory.length} assets</span>
              {filteredInventory.length > 8 && (
                <button onClick={() => setShowAll((v) => !v)} className="text-xs text-primary font-bold hover:underline cursor-pointer">
                  {showAll ? "Show Less" : "View Full Inventory"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Recent Transactions & Alerts */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <History size={18} className="text-primary" />
              Recent Activities
            </h3>
            <div className="space-y-4">
              {apiRecentActivities.length === 0 && <p className="text-xs text-slate-400">No activity yet.</p>}
              {apiRecentActivities.map((act: any, i: number) => (
                <div key={i} className="flex gap-3 items-start pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                  <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                    act.action === 'Removed' ? 'bg-red-500' : act.action === 'Adjusted' || act.action === 'Audited' ? 'bg-amber-500' : act.action === 'Added' ? 'bg-emerald-500' : 'bg-blue-500'
                  }`} />
                  <div>
                    <p className="text-xs font-bold text-slate-800">{act.action} - {act.item}{act.detail ? ` (${act.detail})` : ""}</p>
                    <p className="text-[10px] text-slate-500">{act.user} • {new Date(act.date).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800 p-6 rounded-2xl text-white">
            <div className="w-10 h-10 bg-amber-500/20 text-amber-500 rounded-xl flex items-center justify-center mb-4">
              <AlertTriangle size={20} />
            </div>
            <h4 className="font-bold mb-2">{lastAudit ? "Last audit" : "No audit yet"}</h4>
            <p className="text-xs text-slate-400 mb-4">
              {lastAudit
                ? `${new Date(lastAudit.date).toLocaleDateString()}: ${lastAudit.itemsChecked} items checked, ${lastAudit.discrepancies} difference${lastAudit.discrepancies === 1 ? "" : "s"}${lastAudit.applied ? " (stock corrected)" : ""}.`
                : "Count your stock and compare it with the system to catch missing or extra items."}
            </p>
            <button onClick={() => setAuditOpen(true)} className="w-full py-2 bg-white text-slate-800 rounded-lg text-xs font-bold hover:bg-secondary transition-all cursor-pointer">
              Start Audit
            </button>
          </div>
        </div>
      </div>

      {/* Add New Asset Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Box size={20} className="text-primary" />
                Add New Asset
              </h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">
                &times;
              </button>
            </div>
            <form onSubmit={handleAddAsset} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Item Name *</label>
                <input required type="text" value={newAssetData.itemName} onChange={e => setNewAssetData({...newAssetData, itemName: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" placeholder="e.g. Dell Latitude 5420" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Category *</label>
                  <select required value={newAssetData.category} onChange={e => setNewAssetData({...newAssetData, category: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none">
                    <option value="">Select...</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Lab Equipment">Lab Equipment</option>
                    <option value="Office Supplies">Office Supplies</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Location</label>
                  <input type="text" value={newAssetData.location} onChange={e => setNewAssetData({...newAssetData, location: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" placeholder="e.g. IT Room" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Quantity *</label>
                  <input required type="number" min="0" value={newAssetData.quantity} onChange={e => setNewAssetData({...newAssetData, quantity: parseInt(e.target.value)})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Unit</label>
                  <input type="text" value={newAssetData.unit} onChange={e => setNewAssetData({...newAssetData, unit: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" placeholder="e.g. Pcs, Pack" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Unit price (EGP)</label>
                <input type="number" min="0" value={newAssetData.unitPrice} onChange={e => setNewAssetData({...newAssetData, unitPrice: Number(e.target.value) || 0})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Status</label>
                <select value={newAssetData.status} onChange={e => setNewAssetData({...newAssetData, status: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none">
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={isAdding} className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-70">
                  {isAdding ? "Saving..." : "Save Asset"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      {rowModal && (
        <EntityModal
          title={rowModal.mode === "edit" ? "Edit asset" : "Asset details"}
          mode={rowModal.mode}
          endpoint="/api/admin/inventory"
          fields={assetFields}
          initial={rowModal.item}
          onClose={() => setRowModal(null)}
          onSaved={() => mutate()}
        />
      )}
      {deleting && <ConfirmDelete what="asset" endpoint="/api/admin/inventory" id={deleting._id} onClose={() => setDeleting(null)} onDone={() => mutate()} />}
      {auditOpen && <InventoryAuditModal items={apiInventory} onClose={() => setAuditOpen(false)} onDone={() => mutate()} />}
    </div>
  );
}
