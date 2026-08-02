"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Chatbot from "../components/Chatbot";
import SalesToast from "../components/SalesToast";
import CheckoutModal from "../components/CheckoutModal";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  Phone,
  MapPin,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Calendar,
  AlertCircle,
  RefreshCw,
  Wifi,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface OrderItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  image: string;
  carrier: string;
}

interface OrderData {
  id: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  status: "Pending" | "Confirmed" | "Dispatched" | "Delivered" | "Cancelled";
  createdAt: string;
}

function TrackContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query") || searchParams.get("id") || "";

  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [foundOrder, setFoundOrder] = useState<OrderData | null>(null);

  // Search function
  const handleTrack = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanQuery = query.trim().replace(/^#/, "");
    if (!cleanQuery) return;

    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch("/api/orders");
      const data = await res.json();

      if (data.success && Array.isArray(data.orders)) {
        const match = data.orders.find(
          (o: OrderData) =>
            o.id.toLowerCase() === cleanQuery.toLowerCase() ||
            o.phone.includes(cleanQuery) ||
            o.customerName.toLowerCase().includes(cleanQuery.toLowerCase())
        );
        setFoundOrder(match || null);
      } else {
        setFoundOrder(null);
      }
    } catch (err) {
      console.error("Tracking fetch error:", err);
      setFoundOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      handleTrack();
    }
  }, [initialQuery]);

  // Determine active step (1 to 4)
  const getStepIndex = (status: OrderData["status"]) => {
    if (status === "Pending") return 1;
    if (status === "Confirmed") return 2;
    if (status === "Dispatched") return 3;
    if (status === "Delivered") return 4;
    return 1;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col justify-between pt-24 sm:pt-28">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 w-full py-8 space-y-8">
        
        {/* Header & Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-[#E60000] text-xs font-black uppercase tracking-wider">
            <Wifi className="w-4 h-4" />
            <span>Official Order Tracker</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Track Your Vodafone SIM Order
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold max-w-xl mx-auto">
            Enter your Order ID (e.g. <strong className="text-slate-900">VOD-849201</strong>) or Phone Number to check real-time courier status across Pakistan.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="max-w-2xl mx-auto bg-white p-2.5 sm:p-3 rounded-full border border-slate-200/80 shadow-lg shadow-slate-200/50 flex items-center gap-2">
          <div className="relative flex-1 pl-4">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Enter Order ID (#VOD-849201) or Phone Number..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTrack()}
              className="w-full bg-transparent pl-8 pr-4 py-2.5 text-sm text-slate-900 font-bold placeholder-slate-400 focus:outline-none"
            />
          </div>

          <button
            onClick={() => handleTrack()}
            disabled={loading}
            className="bg-[#E60000] hover:bg-[#CC0000] text-white font-extrabold text-xs px-6 sm:px-8 py-3.5 rounded-full transition-all shadow-md shadow-red-600/20 cursor-pointer uppercase tracking-wider flex items-center gap-2 shrink-0 disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Track Status</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Result Area */}
        <AnimatePresence mode="wait">
          {searched && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {foundOrder ? (
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-8">
                  
                  {/* Order Overview Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                    <div>
                      <span className="text-[10px] font-black uppercase text-[#E60000] tracking-widest block mb-1">
                        CONFIRMED SIM ORDER
                      </span>
                      <h2 className="text-2xl font-black text-slate-900">
                        Order #{foundOrder.id}
                      </h2>
                      <p className="text-xs text-slate-400 font-semibold mt-0.5">
                        Placed on {new Date(foundOrder.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider border ${
                          foundOrder.status === "Pending"
                            ? "bg-amber-50 text-amber-800 border-amber-300"
                            : foundOrder.status === "Dispatched"
                            ? "bg-blue-50 text-blue-800 border-blue-300"
                            : foundOrder.status === "Delivered"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : "bg-rose-50 text-rose-800 border-rose-300"
                        }`}
                      >
                        {foundOrder.status === "Pending"
                          ? "⏳ Pending Verification"
                          : foundOrder.status === "Dispatched"
                          ? "🚚 Courier In-Transit"
                          : foundOrder.status === "Delivered"
                          ? "✅ Delivered"
                          : "❌ Cancelled"}
                      </span>
                    </div>
                  </div>

                  {/* Visual 4-Step Timeline Progress Bar */}
                  <div className="py-4">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-6 text-center">
                      LIVE DELIVERY PROGRESS
                    </span>

                    <div className="grid grid-cols-4 gap-2 relative">
                      {/* Connecting Line */}
                      <div className="absolute top-5 left-[12%] right-[12%] h-1 bg-slate-200 -z-0">
                        <div
                          style={{
                            width: `${((getStepIndex(foundOrder.status) - 1) / 3) * 100}%`,
                          }}
                          className="h-full bg-[#E60000] transition-all duration-500 rounded-full"
                        />
                      </div>

                      {[
                        { step: 1, label: "Order Received", desc: "SIM Order Recorded", icon: Clock },
                        { step: 2, label: "Address Verified", desc: "WhatsApp Verified", icon: ShieldCheck },
                        { step: 3, label: "In-Transit", desc: "TCS / Leopard Pickup", icon: Truck },
                        { step: 4, label: "Delivered", desc: "Handed to Customer", icon: CheckCircle2 },
                      ].map((st) => {
                        const isCompleted = getStepIndex(foundOrder.status) >= st.step;
                        const isCurrent = getStepIndex(foundOrder.status) === st.step;
                        const IconComp = st.icon;

                        return (
                          <div key={st.step} className="flex flex-col items-center text-center space-y-2 relative z-10">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                isCompleted
                                  ? "bg-[#E60000] text-white shadow-md shadow-red-600/30 ring-4 ring-red-100"
                                  : "bg-white text-slate-400 border-2 border-slate-200"
                              }`}
                            >
                              <IconComp className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className={`text-xs font-black ${isCompleted ? "text-slate-900" : "text-slate-400"}`}>
                                {st.label}
                              </h4>
                              <p className="text-[10px] text-slate-400 hidden sm:block font-medium">
                                {st.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Order & Package Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs border-t border-slate-100 pt-6">
                    {/* Customer & City */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                        DESTINATION &amp; RECIPIENT
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-sm">{foundOrder.customerName}</h4>
                      <p className="text-slate-600 font-semibold">{foundOrder.phone}</p>
                      <p className="text-slate-700">{foundOrder.address}</p>
                      <span className="text-xs font-bold text-[#E60000] block pt-1">
                        📍 {foundOrder.city}, Pakistan
                      </span>
                    </div>

                    {/* Package & Payment */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-2">
                          ORDERED PACKAGE
                        </span>
                        {foundOrder.items && foundOrder.items.length > 0 && (
                          <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200/60">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 relative overflow-hidden shrink-0">
                              <Image src={foundOrder.items[0].image} alt={foundOrder.items[0].name} fill className="object-cover" />
                            </div>
                            <div>
                              <h5 className="font-extrabold text-slate-900 leading-tight">{foundOrder.items[0].name}</h5>
                              <span className="text-[10px] text-slate-400 font-semibold">Qty: {foundOrder.items[0].qty} • {foundOrder.items[0].carrier}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                        <span className="font-bold text-slate-600">Total COD Amount:</span>
                        <span className="text-lg font-black text-slate-900">Rs. {foundOrder.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Direct WhatsApp Action Bar */}
                  <div className="bg-emerald-50 border border-emerald-200/80 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-emerald-950">Have a question about your delivery?</h4>
                        <p className="text-[11px] text-emerald-700 font-medium">Chat directly with our dispatch team on WhatsApp.</p>
                      </div>
                    </div>

                    <a
                      href={`https://wa.me/923000000000?text=Hi%20Vodafone%20Team,%20I%20am%20checking%20status%20for%20order%20%23${foundOrder.id}.`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-full transition-all text-center cursor-pointer uppercase tracking-wider shrink-0"
                    >
                      Chat on WhatsApp
                    </a>
                  </div>

                </div>
              ) : (
                /* Not Found Box */
                <div className="bg-white border border-slate-200/80 rounded-3xl p-8 text-center space-y-4 shadow-md max-w-lg mx-auto">
                  <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-200">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">No Order Found</h3>
                    <p className="text-xs font-semibold text-slate-500 mt-1">
                      We couldn't find any SIM order matching "<strong>{query}</strong>". Please double-check your Order ID or Phone Number.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setQuery("");
                      setSearched(false);
                    }}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-6 py-2.5 rounded-full transition-all cursor-pointer"
                  >
                    Try Another Search
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      <Footer />
      <Chatbot onOrderClick={() => {}} />
      <SalesToast />
    </div>
  );
}

export default function TrackPage() {
  return (
    <>
      <header>
        <Navbar onOrderClick={() => {}} />
      </header>
      <Suspense fallback={<div className="min-h-screen pt-32 text-center text-xs font-bold">Loading Order Tracker...</div>}>
        <TrackContent />
      </Suspense>
    </>
  );
}
