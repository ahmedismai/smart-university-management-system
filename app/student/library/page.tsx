"use client";

import React, { useEffect, useState } from "react";
import { actions } from "@/lib/siteActions";
import { Library, Search, Book, Bookmark, Clock, CheckCircle2, ChevronRight, Filter, BookOpen, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import useSWR from "swr";
import { toast } from "react-hot-toast";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function LibraryPage() {
  const [searchVal, setSearchVal] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isRenewing, setIsRenewing] = useState<string | null>(null);
  const [isBorrowing, setIsBorrowing] = useState<string | null>(null);
  const [favs, setFavs] = useState<string[]>([]);
  const [showFavs, setShowFavs] = useState(false);

  useEffect(() => {
    try {
      setFavs(JSON.parse(localStorage.getItem("favorite_books") || "[]"));
    } catch {}
  }, []);

  const toggleFav = (id: string) =>
    setFavs((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem("favorite_books", JSON.stringify(next));
      } catch {}
      return next;
    });

  // SWR for fetching dynamic library stats, active borrowings, and the book catalog
  const { data: response, error, isLoading, mutate } = useSWR(
    `/api/student/library?search=${searchQuery}&category=${selectedCategory === "All" ? "" : selectedCategory}`,
    fetcher
  );

  const libraryData = response?.success ? response.data : null;
  const borrowedBooks = libraryData?.borrowedBooks || [];
  const catalogRaw: any[] = libraryData?.catalogBooks || [];
  const catalogBooks: any[] = showFavs ? catalogRaw.filter((b) => favs.includes(b.id)) : catalogRaw;
  const stats = libraryData?.stats || { totalBorrowed: 0, onTimeRate: "98%", activeFines: "EGP 0.00" };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchVal);
  };

  const handleRenew = async (issueId: string) => {
    setIsRenewing(issueId);
    try {
      const res = await fetch("/api/student/library/renew", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issueId })
      });
      const result = await res.json();
      if (result.success) {
        toast.success(result.message || "Book renewed successfully!");
        mutate();
      } else {
        toast.error(result.message || "Failed to renew book");
      }
    } catch (err) {
      toast.error("An error occurred during renewal.");
    } finally {
      setIsRenewing(null);
    }
  };

  const handleBorrow = async (bookId: string) => {
    setIsBorrowing(bookId);
    try {
      const res = await fetch("/api/student/library/borrow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId })
      });
      const result = await res.json();
      if (result.success) {
        toast.success(result.message || "Book borrowed successfully!");
        mutate();
      } else {
        toast.error(result.message || "Failed to borrow book");
      }
    } catch (err) {
      toast.error("An error occurred during borrowing.");
    } finally {
      setIsBorrowing(null);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-red-50 border border-red-100 rounded-3xl">
        <h2 className="text-xl font-bold text-red-700">Failed to load library</h2>
        <p className="text-red-500 mt-2">There was an issue connecting to the library server. Please try again later.</p>
        <button onClick={() => mutate()} className="mt-4 px-6 py-2.5 bg-red-600 text-white font-bold rounded-xl shadow-lg hover:bg-red-700 transition-colors">
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">University Library</h1>
          <p className="text-gray-500 mt-1">Explore books, journals, and digital resources for your studies.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowFavs((v) => !v)} aria-pressed={showFavs} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
            <Bookmark size={18} />
            My Favorites
          </button>
          <button onClick={() => actions.go("/academics/libraries")} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-opacity">
            <BookOpen size={18} />
            E-Library Access
          </button>
        </div>
      </div>

      {/* Search Header */}
      <div className="bg-gradient-to-br from-primary to-[#0A1F3D] rounded-[2rem] p-10 text-white relative overflow-hidden group">
         <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8">
            <h2 className="text-4xl font-black">Search our vast collection</h2>
            <form onSubmit={handleSearchSubmit} className="relative group">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={24} />
               <input 
                 type="text" 
                 placeholder="Search by title, author, or ISBN..." 
                 value={searchVal}
                 onChange={(e) => setSearchVal(e.target.value)}
                 className="w-full pl-16 pr-32 py-5 bg-white text-gray-900 rounded-3xl shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/20 transition-all font-medium"
               />
               <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:bg-black transition-colors cursor-pointer">
                  Search
               </button>
            </form>
            <div className="flex items-center justify-center flex-wrap gap-4 md:gap-6">
               {['All', 'Engineering', 'Science', 'Arts', 'Commerce', 'Law'].map(cat => {
                 const isActive = selectedCategory === cat;
                 return (
                   <button 
                     key={cat} 
                     onClick={() => {
                       setSelectedCategory(cat);
                       // Auto-trigger search reset if they click categories to search broadly in that category
                       setSearchVal("");
                       setSearchQuery("");
                     }}
                     className={cn(
                       "text-sm font-bold transition-all flex items-center gap-2 cursor-pointer",
                       isActive ? "opacity-100 text-secondary scale-105" : "opacity-60 hover:opacity-100 text-white"
                     )}
                   >
                      <div className={cn("w-1.5 h-1.5 rounded-full", isActive ? "bg-secondary" : "bg-white/40")}></div>
                      {cat}
                   </button>
                 );
               })}
            </div>
         </div>
         <Library size={300} className="absolute -bottom-20 -left-20 opacity-5 group-hover:scale-110 transition-transform duration-1000" />
         <Book size={200} className="absolute -top-10 -right-10 opacity-5 group-hover:scale-110 transition-transform duration-1000 rotate-12" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
           {/* Borrowed Books */}
           <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Bookmark size={20} className="text-primary" />
                    Currently Borrowed
                 </h2>
                 <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                   Limit: {borrowedBooks.length} / 5 Books
                 </span>
              </div>

              {isLoading && !libraryData ? (
                // SWR Loading Skeleton for borrowings
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2].map((n) => (
                    <div key={n} className="p-6 bg-gray-50/50 border border-gray-100 rounded-3xl animate-pulse space-y-4">
                      <div className="flex justify-between">
                        <div className="w-12 h-16 bg-gray-200 rounded-lg"></div>
                        <div className="w-16 h-6 bg-gray-200 rounded-lg"></div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-1.5 bg-gray-200 rounded-full"></div>
                    </div>
                  ))}
                </div>
              ) : borrowedBooks.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-gray-200 rounded-3xl">
                  <BookOpen size={48} className="mx-auto text-gray-300 mb-3" />
                  <h3 className="font-bold text-gray-700">No Active Borrowings</h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                    You don't have any borrowed books at the moment. Use the search bar above to find and borrow books!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {borrowedBooks.map((book: any) => (
                     <div key={book.id} className="p-6 bg-gray-50/50 border border-gray-100 rounded-3xl hover:bg-white hover:shadow-xl hover:border-primary/10 transition-all group">
                        <div className="flex items-start justify-between mb-4">
                           <div className="w-12 h-16 bg-white rounded-lg shadow-inner flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors border border-gray-100">
                              <Book size={24} />
                           </div>
                           <div className="text-right">
                              <span className={cn(
                                "text-[10px] font-black uppercase px-2 py-1 rounded-lg",
                                book.status === "Overdue" ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
                              )}>
                                 {book.status}
                              </span>
                           </div>
                        </div>
                        <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors leading-tight mb-1 truncate" title={book.title}>
                          {book.title}
                        </h4>
                        <p className="text-xs text-gray-500 mb-6">{book.author}</p>
                        
                        <div className="space-y-4">
                           <div className="flex items-center justify-between text-[10px] font-bold">
                              <span className="text-gray-400">Due Date: {book.dueDate}</span>
                              <span className={cn(book.daysLeft <= 3 ? "text-red-500" : "text-emerald-600")}>
                                 {book.daysLeft <= 0 ? "Overdue" : `${book.daysLeft} Days Left`}
                              </span>
                           </div>
                           <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                              <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${book.progress}%` }}
                                 transition={{ duration: 1.5 }}
                                 className={cn(
                                   "h-full rounded-full",
                                   book.status === "Overdue" ? "bg-red-500" : "bg-primary"
                                 )}
                              />
                           </div>
                           <button 
                             disabled={isRenewing === book.id}
                             onClick={() => handleRenew(book.id)}
                             className="w-full py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-500 hover:text-primary hover:border-primary/20 hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-50"
                           >
                              {isRenewing === book.id ? "Renewing..." : "Renew Book"}
                           </button>
                        </div>
                     </div>
                   ))}
                </div>
              )}
           </div>

           {/* Recommended / Catalog Books Grid */}
           <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-xl font-bold text-gray-900">
                   {searchQuery ? `Search Results for "${searchQuery}"` : "Recommended for your Semester"}
                 </h2>
                 {searchQuery && (
                   <button 
                     onClick={() => {
                       setSearchVal("");
                       setSearchQuery("");
                     }}
                     className="text-sm font-bold text-primary hover:underline cursor-pointer"
                   >
                     Clear Search
                   </button>
                 )}
              </div>

              {isLoading && !libraryData ? (
                // SWR Loading Skeleton for catalog
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="space-y-3 animate-pulse">
                      <div className="aspect-[3/4] bg-gray-100 rounded-2xl"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : catalogBooks.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-3xl border border-gray-100">
                  <Library className="mx-auto text-gray-300 mb-3" size={48} />
                  <h3 className="font-bold text-gray-700">No Books Found</h3>
                  <p className="text-xs text-gray-400 mt-1">We couldn't find any books matching your criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                   {catalogBooks.map((book: any) => (
                     <div key={book.id} className="space-y-3 group cursor-pointer relative">
                        <div className="aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden relative shadow-sm border border-gray-100">
                           <button
                             onClick={(e) => { e.stopPropagation(); toggleFav(book.id); }}
                             aria-label={favs.includes(book.id) ? "Remove from favorites" : "Add to favorites"}
                             className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow hover:scale-110 transition-transform cursor-pointer"
                           >
                             <Bookmark size={16} className={favs.includes(book.id) ? "fill-current text-primary" : "text-gray-500"} />
                           </button>
                           <img src={book.image} alt={book.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                              <span className="text-[10px] text-gray-300 font-bold mb-1">Shelf: {book.location}</span>
                              <button 
                                disabled={isBorrowing === book.id || !book.available}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleBorrow(book.id);
                                }}
                                className={cn(
                                  "w-full py-2 text-xs font-bold rounded-lg shadow-xl cursor-pointer transition-all",
                                  book.available 
                                    ? "bg-secondary text-primary hover:scale-105" 
                                    : "bg-gray-600 text-gray-300 cursor-not-allowed"
                                )}
                              >
                                 {isBorrowing === book.id 
                                   ? "Borrowing..." 
                                   : book.available 
                                     ? "Borrow Book" 
                                     : "Out of Stock"}
                              </button>
                           </div>
                           {!book.available && (
                             <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-black uppercase px-2 py-1 rounded-md shadow-lg">
                                Out of Stock
                             </div>
                           )}
                           {book.available && (
                             <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[9px] font-black uppercase px-2 py-1 rounded-md shadow-lg">
                                {book.availableCopies} Copies Available
                             </div>
                           )}
                        </div>
                        <div>
                           <h4 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors leading-tight line-clamp-1" title={book.title}>
                             {book.title}
                           </h4>
                           <p className="text-[10px] font-medium text-gray-500">{book.author}</p>
                        </div>
                     </div>
                   ))}
                </div>
              )}
           </div>
        </div>

        {/* Library Info Sidebar */}
        <div className="space-y-6">
           <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Library Stats</h2>
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                       <Book size={18} className="text-blue-500" />
                       <span className="text-sm font-bold text-gray-600">Total Borrowed</span>
                    </div>
                    {isLoading && !libraryData ? (
                      <span className="h-6 w-8 bg-gray-200 rounded animate-pulse"></span>
                    ) : (
                      <span className="font-black text-gray-900 text-lg">{stats.totalBorrowed}</span>
                    )}
                 </div>
                 <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                       <Bookmark size={18} className="text-emerald-500" />
                       <span className="text-sm font-bold text-gray-600">Returned on time</span>
                    </div>
                    {isLoading && !libraryData ? (
                      <span className="h-6 w-12 bg-gray-200 rounded animate-pulse"></span>
                    ) : (
                      <span className="font-black text-gray-900 text-lg">{stats.onTimeRate}</span>
                    )}
                 </div>
                 <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                       <Clock size={18} className="text-amber-500" />
                       <span className="text-sm font-bold text-gray-600">Active Fines</span>
                    </div>
                    {isLoading && !libraryData ? (
                      <span className="h-6 w-16 bg-gray-200 rounded animate-pulse"></span>
                    ) : (
                      <span className="font-black text-gray-900 text-lg">{stats.activeFines}</span>
                    )}
                 </div>
              </div>
           </div>

           <div className="bg-amber-50 p-8 rounded-[2rem] border border-amber-100">
              <h3 className="font-black text-amber-900 mb-2">Notice</h3>
              <p className="text-xs text-amber-700 leading-relaxed mb-6">
                 Library will remain closed on Friday for system maintenance. Please return your books by Thursday 4:00 PM.
              </p>
              <button onClick={() => actions.go("/quick-links/news")} className="w-full py-3 bg-amber-600 text-white font-bold rounded-xl shadow-lg shadow-amber-600/20 hover:opacity-90 transition-opacity cursor-pointer">
                 See More News
              </button>
           </div>
           
           <div className="bg-gray-900 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
              <div className="relative z-10">
                 <h3 className="font-bold text-lg mb-2">Study Room Booking</h3>
                 <p className="text-xs text-gray-400 mb-6">Need a quiet space for group study? Book a room now.</p>
                 <button onClick={() => actions.inquiry("Study room booking", { type: "registration", title: "Book a study room", description: "Tell us the date, time and group size and the library staff will confirm your booking.", fields: ["message"], submitLabel: "Request booking" })} className="w-full py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-secondary transition-colors cursor-pointer">
                    Check Availability
                 </button>
              </div>
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-1000 rotate-45">
                 <MapPin size={100} />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function MapPin({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
