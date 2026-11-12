"use client";

import React, { useState, useEffect } from "react";
import { 
  CreditCard, 
  Banknote as DollarSign, 
  Download, 
  History, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  ArrowUpRight, 
  Loader2, 
  XCircle,
  ShieldCheck,
  Smartphone,
  Wallet
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast, Toaster } from "react-hot-toast";

interface Student {
  name: string;
  studentId: string;
  deptCode: string;
  deptName: string;
}

interface FeeSummaryItem {
  label: string;
  value: string;
  sub: string;
  color: string;
  bg: string;
}

interface TransactionItem {
  id: string;
  type: string;
  method: string;
  date: string;
  amount: string;
  status: string;
}

interface UpcomingFeeItem {
  id: string;
  type: string;
  amount: string;
  deadline: string;
  urgent: boolean;
  rawAmount: number;
  itemType: string;
}

interface FeesData {
  student: Student;
  feeSummary: FeeSummaryItem[];
  transactionHistory: TransactionItem[];
  upcomingFees: UpcomingFeeItem[];
}

export default function FeesPage() {
  const [data, setData] = useState<FeesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Payment modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<UpcomingFeeItem | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("Vodafone Cash");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pinNumber, setPinNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  const fetchFees = async () => {
    try {
      const res = await fetch("/api/student/fees");
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/login/student";
          return;
        }
        throw new Error("Failed to fetch academic financial records");
      }
      const json = await res.json();
      if (json.success) {
        setData(json);
      } else {
        throw new Error(json.error || "An unexpected error occurred");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong while loading fees details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const handleOpenPayment = (fee: UpcomingFeeItem) => {
    setSelectedFee(fee);
    setIsPaymentModalOpen(true);
  };

  const handleBulkPayment = () => {
    if (!data || data.upcomingFees.length === 0) {
      toast.error("You have no outstanding dues to pay.");
      return;
    }
    
    // We can bundle all outstanding fees into a single bulk payment
    const totalAmount = data.upcomingFees.reduce((sum, f) => sum + f.rawAmount, 0);
    const bulkFee: UpcomingFeeItem = {
      id: data.upcomingFees.map(f => f.id).join(","),
      type: "All Outstanding Dues (Bulk Payment)",
      amount: `EGP ${totalAmount.toLocaleString()}`,
      deadline: "Today",
      urgent: true,
      rawAmount: totalAmount,
      itemType: "bulk"
    };

    setSelectedFee(bulkFee);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    let paymentNote = "";
    e.preventDefault();
    if (!selectedFee) return;

    if (["Vodafone Cash", "Fawry"].includes(paymentMethod)) {
      if (!phoneNumber.trim()) {
        toast.error("Please enter your mobile wallet number.");
        return;
      }
      if (!pinNumber.trim()) {
        toast.error("Please enter your wallet PIN.");
        return;
      }
    } else {
      if (!cardNumber.trim() || !cardExpiry.trim() || !cardCvv.trim()) {
        toast.error("Please enter card details.");
        return;
      }
    }

    setIsPaying(true);
    try {
      const itemsToPay = selectedFee.itemType === "bulk" 
        ? selectedFee.id.split(",") 
        : [selectedFee.id];
      const itemTypes = selectedFee.itemType === "bulk"
        ? data!.upcomingFees.map(f => f.itemType)
        : [selectedFee.itemType];

      // If it's a bulk payment, make multiple requests or process them sequentially
      for (let i = 0; i < itemsToPay.length; i++) {
        const id = itemsToPay[i];
        const type = itemTypes[i] || "fee";

        const res = await fetch("/api/student/fees", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id,
            itemType: type,
            paymentMethod
          })
        });

        if (!res.ok) {
          throw new Error("Failed to process payment.");
        }
        paymentNote = (await res.json().catch(() => ({})))?.message || "";
      }

      toast.success(paymentNote || `Payment of ${selectedFee.amount} via ${paymentMethod} succeeded!`);
      
      // Reset states
      setIsPaymentModalOpen(false);
      setSelectedFee(null);
      setPhoneNumber("");
      setPinNumber("");
      setCardNumber("");
      setCardExpiry("");
      setCardCvv("");
      
      // Reload details from API
      setLoading(true);
      fetchFees();

    } catch (err: any) {
      toast.error(err.message || "Something went wrong during payment.");
    } finally {
      setIsPaying(false);
    }
  };

  const handleDownloadStructure = () => {
    toast.success("Downloading academic fee structure PDF...");
  };

  if (loading && !data) {
    return (
      <div className="space-y-8 pb-10 max-w-7xl mx-auto animate-pulse">
        {/* Title skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="h-4 bg-gray-100 rounded w-64"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-11 bg-gray-200 rounded-xl w-36"></div>
            <div className="h-11 bg-gray-200 rounded-xl w-32"></div>
          </div>
        </div>
        
        {/* Cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-3xl"></div>
          ))}
        </div>

        {/* Content skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-[350px] bg-gray-200 rounded-[2rem]"></div>
          <div className="h-[350px] bg-gray-200 rounded-[2rem]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center p-8 bg-white rounded-[2rem] border border-red-100 shadow-sm space-y-4 max-w-xl mx-auto">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
          <XCircle size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Failed to Load Fee Details</h3>
        <p className="text-gray-500 max-w-md">{error}</p>
        <button 
          onClick={() => {
            setLoading(true);
            setError(null);
            fetchFees();
          }} 
          className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { student, feeSummary, transactionHistory, upcomingFees } = data!;

  return (
    <div className="space-y-8 pb-10 max-w-7xl mx-auto">
      <Toaster position="top-right" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Fees & Payments</h1>
          <p className="text-gray-500 mt-1">Manage academic financial records for {student.name} ({student.deptCode}).</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDownloadStructure}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Download size={18} />
            Fee Structure
          </button>
          <button 
            onClick={handleBulkPayment}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-opacity cursor-pointer"
          >
            <CreditCard size={18} />
            Pay Now
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {feeSummary.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:border-primary/20 transition-all"
          >
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className={cn("text-2xl font-black mb-2", stat.color)}>{stat.value}</h3>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium text-gray-500">{stat.sub}</span>
              <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center", stat.bg)}>
                <ArrowUpRight size={14} className={stat.color} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Methods / Promotions */}
          <div className="bg-gradient-to-br from-[#0F2E5D] to-[#2E5E9F] rounded-[2rem] p-8 text-white relative overflow-hidden group">
             <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                   <h2 className="text-3xl font-black mb-4">Pay securely with <span className="text-secondary">NextPay</span></h2>
                   <p className="text-blue-100 text-sm mb-8 opacity-80">Enjoy up to 5% cashback on early semester fee payments using our integrated payment gateway.</p>
                   <div className="flex flex-wrap gap-4">
                      {['Vodafone Cash', 'Fawry', 'Visa', 'MasterCard'].map(p => (
                        <span key={p} className="px-3 py-1 bg-white/10 rounded-lg text-xs font-bold backdrop-blur-sm">
                          {p}
                        </span>
                      ))}
                   </div>
                </div>
                <div className="hidden md:flex justify-center">
                   <div className="w-48 h-32 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 relative shadow-2xl">
                      <div className="w-10 h-10 bg-secondary rounded-lg mb-4"></div>
                      <div className="h-2 w-full bg-white/20 rounded mb-2"></div>
                      <div className="h-2 w-2/3 bg-white/20 rounded"></div>
                      <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-white/5 rounded-full blur-xl"></div>
                   </div>
                </div>
             </div>
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-1000">
                <CreditCard size={200} />
             </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
             <div className="flex items-center justify-between mb-8">
               <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                 <History size={20} className="text-primary" />
                 Payment History
               </h2>
             </div>
             <div className="overflow-x-auto no-scrollbar">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-50">
                      <th className="text-left py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Transaction ID</th>
                      <th className="text-left py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</th>
                      <th className="text-left py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                      <th className="text-left py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                      <th className="text-right py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {transactionHistory.map((tx, i) => (
                      <tr key={i} className="group hover:bg-gray-50 transition-colors">
                        <td className="py-5 font-medium text-xs text-gray-600">{tx.id}</td>
                        <td className="py-5">
                           <p className="font-bold text-xs text-gray-900">{tx.type}</p>
                           <p className="text-[10px] text-gray-400">{tx.method}</p>
                        </td>
                        <td className="py-5 text-xs text-gray-500 font-medium">{tx.date}</td>
                        <td className="py-5 font-black text-xs text-primary">{tx.amount}</td>
                        <td className="py-5 text-right">
                           <span className="text-[9px] font-black uppercase px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg">
                             {tx.status}
                           </span>
                        </td>
                      </tr>
                    ))}
                    {transactionHistory.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-400 text-xs font-semibold">
                          No transactions completed yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
             </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Upcoming Dues */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
             <h2 className="text-xl font-bold text-gray-900 mb-6">Upcoming Dues</h2>
             <div className="space-y-4">
                {upcomingFees.map((fee, i) => (
                  <div 
                    key={fee.id || i} 
                    onClick={() => handleOpenPayment(fee)}
                    className={cn(
                      "p-5 rounded-2xl border transition-all hover:scale-[1.02] cursor-pointer",
                      fee.urgent ? "bg-red-50/70 border-red-100" : "bg-gray-50 border-gray-100"
                    )}
                  >
                    <div className="flex justify-between items-start mb-4">
                       <div className={cn(
                         "p-2 rounded-xl bg-white shadow-sm",
                         fee.urgent ? "text-red-600" : "text-gray-400"
                       )}>
                         {fee.urgent ? <AlertCircle size={20} /> : <CreditCard size={20} />}
                       </div>
                       <span className={cn(
                         "text-[9px] font-black uppercase px-2 py-1 rounded-lg",
                         fee.urgent ? "bg-red-100 text-red-700" : "bg-white text-gray-500"
                       )}>
                         {fee.urgent ? "Urgent" : "Regular"}
                       </span>
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm mb-1">{fee.type}</h4>
                    <p className="text-lg font-black text-primary mb-4">{fee.amount}</p>
                    <div className="flex items-center justify-between text-[10px] font-bold">
                       <span className="text-gray-400">Deadline: {fee.deadline}</span>
                       <button onClick={() => handleOpenPayment(fee)} className="text-primary hover:underline flex items-center gap-1">
                          Pay <ChevronRight size={12} />
                       </button>
                    </div>
                  </div>
                ))}
                {upcomingFees.length === 0 && (
                  <div className="p-8 text-center text-gray-400 border border-dashed border-gray-200 rounded-2xl">
                    <CheckCircle2 size={32} className="mx-auto mb-2 text-emerald-500" />
                    <p className="text-xs font-bold text-gray-500">All Clear!</p>
                    <p className="text-[10px] text-gray-400 mt-1">No outstanding semester dues or fines.</p>
                  </div>
                )}
             </div>
             {upcomingFees.length > 0 && (
               <button 
                 onClick={handleBulkPayment}
                 className="w-full mt-6 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
               >
                  Make Bulk Payment
               </button>
             )}
          </div>

          {/* Need help? */}
          <div className="bg-secondary p-8 rounded-[2rem] text-primary relative overflow-hidden group">
             <h3 className="text-xl font-black mb-2">Payment Issues?</h3>
             <p className="text-sm font-medium opacity-80 mb-6">If you're facing any problems with payments or need a waiver application, contact our accounts department.</p>
             <button 
               onClick={() => toast.success("Accounts Desk ticket raised. A representative will contact you via email shortly.")}
               className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-[#0A1F3D] transition-colors cursor-pointer"
             >
                Contact Accounts
             </button>
             <div className="absolute -bottom-4 -right-4 p-8 opacity-10 rotate-12 group-hover:scale-125 transition-transform duration-700">
                <DollarSign size={100} />
             </div>
          </div>
        </div>
      </div>

      {/* Payment Gateway Modal */}
      <AnimatePresence>
        {isPaymentModalOpen && selectedFee && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 max-w-lg w-full overflow-hidden"
            >
              <div className="p-6 bg-primary text-white flex justify-between items-center relative">
                <div>
                  <h3 className="text-lg font-bold tracking-tight flex items-center gap-2">
                    <ShieldCheck className="text-secondary" />
                    Secure Payment Gateway
                  </h3>
                  <p className="text-[10px] text-blue-200 font-bold uppercase tracking-widest mt-1">NextPay Secure Transaction</p>
                </div>
                <button 
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="text-white hover:text-secondary font-light text-2xl leading-none cursor-pointer"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handlePaymentSubmit} className="p-6 space-y-6">
                <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Billed For</span>
                  <h4 className="font-bold text-gray-900 text-sm mt-1">{selectedFee.type}</h4>
                  <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-500 font-bold">Total Amount Payable:</span>
                    <span className="text-2xl font-black text-primary">{selectedFee.amount}</span>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select Payment Method</label>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { id: "Vodafone Cash", label: "Vodafone Cash", color: "border-pink-200 text-pink-600 bg-pink-50" },
                      { id: "Fawry", label: "Fawry", color: "border-orange-200 text-orange-600 bg-orange-50" },
                      { id: "Visa", label: "Visa", color: "border-blue-200 text-blue-600 bg-blue-50" },
                      { id: "MasterCard", label: "MasterCard", color: "border-red-200 text-red-600 bg-red-50" }
                    ].map(method => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={cn(
                          "py-3 border-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer",
                          paymentMethod === method.id 
                            ? `${method.color} scale-105 shadow-sm` 
                            : "border-gray-100 text-gray-500 hover:bg-gray-50 hover:border-gray-200"
                        )}
                      >
                        {["Vodafone Cash", "Fawry"].includes(method.id) ? <Smartphone size={16} /> : <Wallet size={16} />}
                        {method.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic input form fields */}
                {["Vodafone Cash", "Fawry"].includes(paymentMethod) ? (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{paymentMethod} Account Number</label>
                      <input 
                        type="tel"
                        required
                        placeholder="e.g. 010XXXXXXXX"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{paymentMethod} PIN</label>
                      <input 
                        type="password"
                        required
                        maxLength={5}
                        placeholder="•••••"
                        value={pinNumber}
                        onChange={(e) => setPinNumber(e.target.value)}
                        className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold tracking-[0.3em] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Card Number</label>
                      <input 
                        type="text"
                        required
                        placeholder="•••• •••• •••• ••••"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Expiry Date</label>
                        <input 
                          type="text"
                          required
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">CVV</label>
                        <input 
                          type="password"
                          required
                          maxLength={3}
                          placeholder="•••"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold tracking-[0.2em] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsPaymentModalOpen(false)}
                    className="px-5 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPaying}
                    className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    {isPaying && <Loader2 className="animate-spin" size={16} />}
                    {isPaying ? "Processing..." : `Pay ${selectedFee.amount}`}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
