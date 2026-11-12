"use client";

import { actions } from "@/lib/siteActions";
import React, { useState } from "react";
import { 
  Library, 
  Search, 
  Plus, 
  BookOpen, 
  UserPlus, 
  History, 
  AlertCircle, 
  CheckCircle2, 
  MoreVertical,
  Book,
  Clock,
  ArrowRight,
  Filter,
  Download
} from "lucide-react";
import { motion } from "framer-motion";
import useSWR from "swr";
import { toast } from "react-hot-toast";

const fetcher = (url: string) => fetch(url).then((res) => res.json());


export default function LibraryPage() {
  const { data: libraryData, error, mutate } = useSWR("/api/admin/library/stats", fetcher);

  const [issueData, setIssueData] = useState({
    memberId: "",
    isbn: "",
    dueDate: "",
  });
  const [isIssuing, setIsIssuing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("Active Borrowings");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBookData, setNewBookData] = useState({ title: "", author: "", isbn: "", category: "", copies: 1, location: "" });
  const [isAdding, setIsAdding] = useState(false);

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      const res = await fetch("/api/admin/library/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBookData),
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Book added successfully");
        setIsAddModalOpen(false);
        setNewBookData({ title: "", author: "", isbn: "", category: "", copies: 1, location: "" });
        mutate();
      } else {
        toast.error(result.message || "Failed to add book");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsAdding(false);
    }
  };

  const handleIssue = async () => {
    if (!issueData.memberId || !issueData.isbn || !issueData.dueDate) {
      toast.error("Please fill all fields for quick issue");
      return;
    }
    setIsIssuing(true);
    try {
      const res = await fetch("/api/admin/library/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(issueData),
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Book issued successfully!");
        setIssueData({ memberId: "", isbn: "", dueDate: "" });
        mutate();
      } else {
        toast.error(result.message || "Failed to issue book");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsIssuing(false);
    }
  };

  const handleReturn = async (issueId: string) => {
    try {
      const res = await fetch("/api/admin/library/issues", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issueId, action: "return" }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Book returned successfully");
        mutate();
      } else {
        toast.error(result.message || "Failed to return book");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  if (error) return <div className="p-8 text-center text-red-500">Failed to load library data</div>;
  if (!libraryData) return <div className="p-8 text-center text-slate-500 animate-pulse">Loading library dashboard...</div>;

  const { stats: apiStats, popularBooks: apiPopularBooks, recentIssues: apiRecentIssues } = libraryData.data;

  const dynamicStats = [
    { label: "Total Books", value: apiStats.totalBooks.toLocaleString(), icon: Library, color: "bg-blue-500" },
    { label: "Issued Books", value: apiStats.issuedBooks.toLocaleString(), icon: BookOpen, color: "bg-emerald-500" },
    { label: "Overdue Books", value: apiStats.overdueBooks.toLocaleString(), icon: AlertCircle, color: "bg-red-500" },
    { label: "New Arrivals", value: apiStats.newArrivals.toLocaleString(), icon: Plus, color: "bg-purple-500" },
  ];

  const filteredIssues = (apiRecentIssues || []).filter((issue: any) => {
    const term = searchQuery.toLowerCase();
    const matchSearch = issue.book?.title?.toLowerCase().includes(term) || issue.memberId?.toLowerCase().includes(term);
    
    let matchFilter = true;
    if (filter === "Active Borrowings") matchFilter = issue.status === "Active";
    else if (filter === "Overdue Only") matchFilter = issue.status === "Overdue";
    else if (filter === "Returned History") matchFilter = issue.status === "Returned";

    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Library Management</h1>
          <p className="text-slate-500">Manage catalog, student borrowings, and digital resources.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => actions.exportCsv("Export Catalog")} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer shadow-sm">
            <Download size={18} />
            Export Catalog
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer"
          >
            <Plus size={18} />
            Add New Book
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dynamicStats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm group hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-xl text-white shadow-lg shadow-current/10`}>
                <stat.icon size={20} />
              </div>
              <button onClick={(e) => actions.details(e)} className="text-slate-300 hover:text-slate-600 transition-colors cursor-pointer">
                <MoreVertical size={16} />
              </button>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Records Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search by book title or member..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => actions.filter("Filter rows")} className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-primary transition-colors cursor-pointer">
                <Filter size={18} />
              </button>
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none font-medium"
              >
                <option>Active Borrowings</option>
                <option>Overdue Only</option>
                <option>Returned History</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <History size={18} className="text-primary" />
                Current Borrowings
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                  <tr>
                    <th className="px-6 py-4">Issue ID</th>
                    <th className="px-6 py-4">Book & Member</th>
                    <th className="px-6 py-4">Issue Date</th>
                    <th className="px-6 py-4">Due Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredIssues.map((issue: any) => (
                    <tr key={issue._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 text-xs font-bold text-slate-500">{issue._id.slice(-6).toUpperCase()}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-800">{issue.book?.title || "Unknown Book"}</span>
                          <span className="text-[10px] text-primary font-medium">{issue.memberId} ({issue.memberType})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600 font-medium">
                        {new Date(issue.issueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                          <Clock size={14} className={issue.status === 'Overdue' ? 'text-red-500' : 'text-slate-400'} />
                          {new Date(issue.dueDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          issue.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 
                          issue.status === 'Returned' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {issue.status === 'Active' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                          {issue.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {issue.status !== "Returned" && (
                          <button 
                            onClick={() => handleReturn(issue._id)}
                            className="px-3 py-1 bg-slate-100 text-slate-600 hover:bg-primary hover:text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                          >
                            Return
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-slate-50 text-center">
              <button onClick={actions.exportCsv.bind(null, "Library transactions")} className="text-xs text-primary font-bold hover:underline cursor-pointer">View All Transactions</button>
            </div>
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          {/* Issue Book Form Card */}
          <div className="bg-slate-800 rounded-2xl p-6 text-white shadow-xl">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-secondary">
              <UserPlus size={20} />
              Quick Issue
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Member ID</label>
                <input 
                  type="text" 
                  value={issueData.memberId}
                  onChange={(e) => setIssueData({...issueData, memberId: e.target.value})}
                  placeholder="STU-1001" 
                  className="w-full bg-slate-700 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-secondary/50 outline-none text-white placeholder-slate-500" 
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Book ISBN</label>
                <input 
                  type="text" 
                  value={issueData.isbn}
                  onChange={(e) => setIssueData({...issueData, isbn: e.target.value})}
                  placeholder="ISBN 978-01..." 
                  className="w-full bg-slate-700 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-secondary/50 outline-none text-white placeholder-slate-500" 
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Due Date</label>
                <input 
                  type="date" 
                  value={issueData.dueDate}
                  onChange={(e) => setIssueData({...issueData, dueDate: e.target.value})}
                  className="w-full bg-slate-700 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-secondary/50 outline-none text-white" 
                />
              </div>
              <button 
                onClick={handleIssue}
                disabled={isIssuing}
                className="w-full py-3.5 bg-secondary text-primary font-extrabold rounded-xl text-sm shadow-lg hover:shadow-secondary/10 hover:-translate-y-0.5 transition-all cursor-pointer disabled:opacity-70"
              >
                {isIssuing ? "Processing..." : "Process Issue"}
              </button>
            </div>
          </div>

          {/* Popular / Low Stock */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Book size={18} className="text-primary" />
              High Demand Books
            </h3>
            <div className="space-y-6">
              {apiPopularBooks?.map((book: any, i: number) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold text-slate-800 leading-tight">{book.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{book.author}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      book.availableCopies === 0 ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {book.availableCopies} Available
                    </span>
                  </div>
                  <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${book.availableCopies === 0 ? 'bg-red-500' : 'bg-primary'}`} 
                      style={{ width: `${(book.availableCopies / (book.copies || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              {(!apiPopularBooks || apiPopularBooks.length === 0) && (
                <div className="text-sm text-slate-500 text-center py-4">No data available</div>
              )}
            </div>
            <button onClick={() => actions.go("/admin/reports")} className="w-full mt-8 flex items-center justify-center gap-2 text-xs font-bold text-primary group cursor-pointer">
              View Analytics
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
      {/* Add New Book Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Book size={20} className="text-primary" />
                Add New Book
              </h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">
                &times;
              </button>
            </div>
            <form onSubmit={handleAddBook} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Book Title *</label>
                <input required type="text" value={newBookData.title} onChange={e => setNewBookData({...newBookData, title: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" placeholder="e.g. Clean Code" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Author *</label>
                  <input required type="text" value={newBookData.author} onChange={e => setNewBookData({...newBookData, author: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" placeholder="e.g. Robert C. Martin" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">ISBN *</label>
                  <input required type="text" value={newBookData.isbn} onChange={e => setNewBookData({...newBookData, isbn: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" placeholder="e.g. 978-0132350884" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Category</label>
                  <input type="text" value={newBookData.category} onChange={e => setNewBookData({...newBookData, category: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" placeholder="e.g. Programming" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Total Copies *</label>
                  <input required type="number" min="1" value={newBookData.copies} onChange={e => setNewBookData({...newBookData, copies: parseInt(e.target.value)})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Location/Shelf</label>
                <input type="text" value={newBookData.location} onChange={e => setNewBookData({...newBookData, location: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" placeholder="e.g. Rack A1" />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={isAdding} className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-70">
                  {isAdding ? "Saving..." : "Save Book"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
