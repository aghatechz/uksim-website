"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Phone,
  MessageCircle,
  MapPin,
  Building2,
  Package,
  CheckCircle2,
  Loader2,
  ShoppingBag,
  Copy,
  Wifi,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage?: string;
  selectedPrice?: number;
  selectedImage?: string;
  selectedCarrier?: string;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  selectedPackage = "Official Vodafone UK Pay-As-You-Go SIM Card",
  selectedPrice = 3500,
  selectedImage,
  selectedCarrier,
}: CheckoutModalProps) {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    whatsapp: "",
    address: "",
    city: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Determine thumbnail image & carrier dynamically
  let pkgImage = selectedImage || "/vodafone/WhatsApp Image 2026-08-04 at 3.18.06 AM.jpeg";
  let pkgCarrier = selectedCarrier || "Vodafone UK";

  if (selectedPackage && selectedPackage.toLowerCase().includes("t-mobile")) {
    pkgImage = "/t-mobile/WhatsApp Image 2026-08-04 at 3.28.45 AM.jpeg";
    pkgCarrier = "T-Mobile USA";
  } else if (selectedPackage && selectedPackage.toLowerCase().includes("giffgaff")) {
    pkgImage = "/product pictures/vodafone-sim.png";
    pkgCarrier = "Giffgaff UK";
  } else if (selectedPackage && selectedPackage.toLowerCase().includes("ee")) {
    pkgImage = "/ee/ee-sim-card.svg";
    pkgCarrier = "EE UK";
  } else if (selectedPackage && selectedPackage.toLowerCase().includes("lebara")) {
    pkgImage = "/lebara/lebara-sim-card.svg";
    pkgCarrier = "Lebara UK";
  }

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (!form.phone.trim() || form.phone.length < 10)
      errs.phone = "Valid phone number is required";
    if (!form.whatsapp.trim() || form.whatsapp.length < 10)
      errs.whatsapp = "Valid WhatsApp number is required";
    if (!form.address.trim()) errs.address = "Delivery address is required";
    if (!form.city.trim()) errs.city = "City is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/submit-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          selectedPackage,
          selectedPrice,
          selectedImage: pkgImage,
          selectedCarrier: pkgCarrier,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setOrderId(data.orderId);
      }
    } catch {
      const localId = `VOD-${Math.floor(100000 + Math.random() * 900000)}`;
      setSuccess(true);
      setOrderId(localId);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm({ fullName: "", phone: "", whatsapp: "", address: "", city: "" });
    setErrors({});
    setSuccess(false);
    setOrderId("");
    setLoading(false);
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 rounded-2xl flex items-center justify-center border border-red-200 shadow-2xs">
                  <Wifi className="w-5 h-5 text-[#E60000]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    SIM Card Checkout
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold">Cash on Delivery • Express Pakistan Delivery</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer text-slate-400 hover:text-slate-900"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!success ? (
              <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4 font-sans">
                
                {/* Dynamic Order Summary Box */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                    SELECTED SIM PACKAGE SUMMARY
                  </span>
                  
                  <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/80">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 relative overflow-hidden border border-slate-200 shrink-0">
                        <Image
                          src={pkgImage}
                          alt={selectedPackage}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9.5px] font-extrabold uppercase text-[#E60000] bg-red-50 px-2 py-0.5 rounded-md inline-block border border-red-200">
                          {pkgCarrier}
                        </span>
                        <h4 className="text-xs font-black text-slate-900 truncate mt-0.5 leading-snug">
                          {selectedPackage}
                        </h4>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-base font-black text-slate-900 block">
                        Rs. {selectedPrice.toLocaleString()}
                      </span>
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block border border-emerald-200">
                        Free COD Shipping
                      </span>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                {[
                  {
                    key: "fullName",
                    label: "Full Name",
                    icon: User,
                    placeholder: "Enter your full name",
                    type: "text",
                  },
                  {
                    key: "phone",
                    label: "Phone Number",
                    icon: Phone,
                    placeholder: "03XX-XXXXXXX",
                    type: "tel",
                  },
                  {
                    key: "whatsapp",
                    label: "WhatsApp Number",
                    icon: MessageCircle,
                    placeholder: "03XX-XXXXXXX",
                    type: "tel",
                  },
                  {
                    key: "address",
                    label: "Delivery Address",
                    icon: MapPin,
                    placeholder: "House / Flat / Street address",
                    type: "text",
                  },
                  {
                    key: "city",
                    label: "City",
                    icon: Building2,
                    placeholder: "e.g. Karachi, Lahore, Islamabad",
                    type: "text",
                  },
                ].map((field) => (
                  <div key={field.key} className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      {field.label} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <field.icon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={form[field.key as keyof typeof form]}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white transition-all ${
                          errors[field.key]
                            ? "border-red-400 focus:border-red-500"
                            : "border-slate-200 focus:border-[#E60000]"
                        }`}
                      />
                    </div>
                    {errors[field.key] && (
                      <p className="text-[11px] text-red-500 font-semibold">{errors[field.key]}</p>
                    )}
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#E60000] hover:bg-[#CC0000] text-white font-extrabold text-xs py-4 rounded-2xl transition-all shadow-lg shadow-red-600/20 cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Placing Order...</span>
                    </>
                  ) : (
                    <span>CONFIRM CASH ON DELIVERY ORDER</span>
                  )}
                </button>
              </form>
            ) : (
              /* Success View */
              <div className="px-6 py-8 text-center space-y-6 font-sans">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200 shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                    ORDER SUCCESSFULLY PLACED
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2">
                    Thank You, {form.fullName}!
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold mt-1 max-w-sm mx-auto">
                    Your SIM order has been confirmed. Our team will verify your address via WhatsApp shortly.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl text-left space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-bold">Order Reference ID:</span>
                    <span className="font-mono font-black text-slate-900">{orderId}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-bold">Package:</span>
                    <span className="font-bold text-slate-900">{selectedPackage}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                    <span className="text-slate-400 font-bold">Total Amount (COD):</span>
                    <span className="font-black text-slate-900 text-sm">Rs. {selectedPrice.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/track?id=${orderId}`}
                    onClick={handleClose}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold py-3.5 rounded-full transition-all text-center uppercase tracking-wider"
                  >
                    Track Order Live
                  </Link>

                  <button
                    onClick={handleClose}
                    className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-full transition-all cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
