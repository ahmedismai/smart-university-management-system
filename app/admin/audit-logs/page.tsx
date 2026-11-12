"use client";

import React, { useEffect, useState, useCallback } from "react";
import { 
  Search, 
  Filter, 
  RefreshCw, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  User, 
  Activity, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  Clock,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
  const [activeAction, setActiveAction] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pagination, setPagination] = useState<any>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1
  });

  // Derived metrics
  const [stats, setStats] = useState({
    totalEvents: 0,
    successRate: 100,
    activeUsers: 0
  });

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      let url = `/api/admin/activities?page=${currentPage}&limit=${itemsPerPage}`;
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      if (activeStatus !== "All") {
        url += `&status=${encodeURIComponent(activeStatus)}`;
      }
      if (activeAction !== "All") {
        url += `&action=${encodeURIComponent(activeAction)}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (data.activities) {
        setLogs(data.activities);
        setPagination(data.pagination || {
          total: data.activities.length,
          page: currentPage,
          limit: itemsPerPage,
          pages: 1
        });

        // Compute metrics based on retrieved logs
        const total = data.pagination?.total || data.activities.length;
        const successCount = data.activities.filter((l: any) => l.status === "Success").length;
        const rate = data.activities.length > 0 
          ? Math.round((successCount / data.activities.length) * 100) 
          : 100;
        
        // Count unique users
        const uniqueUsers = new Set(data.activities.map((l: any) => l.user)).size;

        setStats({
          totalEvents: total,
          successRate: rate,
          activeUsers: uniqueUsers || 1
        });
      } else {
        // Fallback to array format if pagination is not supported
        setLogs(data);
        setStats({
          totalEvents: data.length,
          successRate: data.length > 0 ? Math.round((data.filter((l: any) => l.status === "Success").length / data.length) * 100) : 100,
          activeUsers: new Set(data.map((l: any) => l.user)).size || 1
        });
        setPagination({
          total: data.length,
          page: 1,
          limit: 10,
          pages: 1
        });
      }
    } catch (error) {
      console.error("Error fetching audit logs:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm, activeStatus, activeAction]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Debounced search trigger or form handler
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchLogs();
  };

  const resetFilters = () => {
    setSearchTerm("");
    setActiveStatus("All");
    setActiveAction("All");
    setCurrentPage(1);
  };

  // Helper for status badge styling
  const getStatusBadgeStyle = (status: string) => {
    if (status === "Success") {
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    }
    return "bg-rose-50 text-rose-700 border-rose-100";
  };

  // Helper for action type icon / color
  const getActionColor = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes("create") || act.includes("add")) return "text-blue-600 bg-blue-50 border-blue-100";
    if (act.includes("delete") || act.includes("remove")) return "text-rose-600 bg-rose-50 border-rose-100";
    if (act.includes("update") || act.includes("modify") || act.includes("edit")) return "text-amber-600 bg-amber-50 border-amber-100";
    if (act.includes("login") || act.includes("auth")) return "text-purple-600 bg-purple-50 border-purple-100";
    return "text-slate-600 bg-slate-50 border-slate-100";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="text-primary w-7 h-7" />
            System Audit Logs
          </h1>
          <p className="text-slate-500">Track and monitor security events, administrator updates, and system operations.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={resetFilters} 
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
          <button 
            onClick={() => fetchLogs()} 
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/95 transition-all shadow-md shadow-primary/10 cursor-pointer"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
        >
          <div className="p-4 bg-primary/10 rounded-xl text-primary">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Operations</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{stats.totalEvents}</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
        >
          <div className="p-4 bg-emerald-100 rounded-xl text-emerald-700">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Success Rate</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{stats.successRate}%</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
        >
          <div className="p-4 bg-purple-100 rounded-xl text-purple-700">
            <User size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Administrators</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{stats.activeUsers}</p>
          </div>
        </motion.div>
      </div>

      {/* Main Layout: Filters + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Advanced Filters Panel */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-fit space-y-6">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 text-base">
            <Filter size={18} className="text-slate-500" />
            Search & Filters
          </h3>

          <div className="space-y-4">
            {/* Search Input */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Search Logs</label>
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="User, action or detail..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-800"
                />
              </form>
            </div>

            {/* Status Selector */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Event Status</label>
              <div className="flex flex-wrap gap-2">
                {["All", "Success", "Failed"].map((status) => (
                  <button 
                    key={status}
                    onClick={() => {
                      setActiveStatus(status);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      activeStatus === status 
                        ? 'bg-primary text-white border-primary shadow-sm shadow-primary/10' 
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Type Preset Filters */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Action Category</label>
              <div className="flex flex-wrap gap-1.5">
                {["All", "Create", "Update", "Delete", "Login", "Fetch"].map((act) => (
                  <button 
                    key={act}
                    onClick={() => {
                      setActiveAction(act);
                      setCurrentPage(1);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
                      activeAction === act 
                        ? 'bg-primary text-white border-primary' 
                        : 'bg-slate-50 text-slate-600 border-slate-150 hover:bg-slate-100'
                    }`}
                  >
                    {act}
                  </button>
                ))}
              </div>
            </div>

            {/* Limits per Page */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Logs Per Page</label>
              <select 
                value={itemsPerPage} 
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none text-slate-700 font-semibold focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
              >
                <option value={10}>10 records</option>
                <option value={20}>20 records</option>
                <option value={50}>50 records</option>
                <option value={100}>100 records</option>
              </select>
            </div>
          </div>
        </div>

        {/* Audit Logs Table Panel */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between min-h-[500px]">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-sm font-semibold text-slate-500">Retrieving system events...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Event Date</th>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Action</th>
                    <th className="px-6 py-4">Details</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <AnimatePresence mode="popLayout">
                    {logs.map((log, i) => (
                      <motion.tr 
                        key={log._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: i * 0.02, duration: 0.15 }}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        {/* Event Date */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                            <Clock size={13} className="text-slate-400" />
                            <span className="whitespace-nowrap" title={new Date(log.timestamp).toLocaleString()}>
                              {new Date(log.timestamp).toLocaleString(undefined, {
                                month: 'short',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                              })}
                            </span>
                          </div>
                        </td>

                        {/* User identity */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-primary font-bold text-xs select-none">
                              {log.user ? log.user.substring(0, 2).toUpperCase() : "AD"}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-800">{log.user}</p>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Operator</span>
                            </div>
                          </div>
                        </td>

                        {/* Action Tag */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold border ${getActionColor(log.action)}`}>
                            {log.action}
                          </span>
                        </td>

                        {/* Description Details */}
                        <td className="px-6 py-4 text-xs font-medium text-slate-600 max-w-xs">
                          <div className="truncate font-semibold text-slate-700" title={log.details}>
                            {log.details || "No further details available."}
                          </div>
                        </td>

                        {/* Status badge */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeStyle(log.status)}`}>
                            {log.status === "Success" ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                            {log.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>

                  {logs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center">
                        <div className="max-w-xs mx-auto flex flex-col items-center justify-center">
                          <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-3 shadow-inner">
                            <FileText size={20} />
                          </div>
                          <h4 className="font-bold text-slate-800">No events matched</h4>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            No audit logs were found matching your current filter keywords or criteria. Try modifying your search.
                          </p>
                          <button 
                            onClick={resetFilters}
                            className="mt-4 px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                          >
                            Reset Queries
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Table Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
              <span className="text-xs font-bold text-slate-500">
                Showing Page <span className="text-slate-800">{pagination.page}</span> of <span className="text-slate-800">{pagination.pages}</span> ({pagination.total} total items)
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={pagination.page === 1 || loading}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, idx) => {
                  let pageNum = idx + 1;
                  // Center the active page in pagination bar if more than 5 pages
                  if (pagination.pages > 5 && pagination.page > 3) {
                    pageNum = pagination.page - 3 + idx;
                    if (pageNum + (4 - idx) > pagination.pages) {
                      pageNum = pagination.pages - 4 + idx;
                    }
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        pagination.page === pageNum
                          ? 'bg-primary text-white border-primary shadow-sm shadow-primary/10'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(pagination.pages, p + 1))}
                  disabled={pagination.page === pagination.pages || loading}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
