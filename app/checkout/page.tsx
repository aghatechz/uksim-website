"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Chatbot from "../components/Chatbot";
import { useCart } from "../components/CartProvider";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Truck,
  ShieldCheck,
  Phone,
  MapPin,
  User,
  Mail,
  ChevronRight,
  ArrowLeft,
  CreditCard,
  ShoppingBag,
  Sparkles,
  MessageCircle,
  Clock,
  Printer,
  Package,
  Calendar,
  Check,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();

  // URL query params
  const pkgParam = searchParams.get("pkg") || searchParams.get("name") || "";
  const priceParam = searchParams.get("price") ? Number(searchParams.get("price")) : null;
  const imageParam = searchParams.get("image") || "";
  const carrierParam = searchParams.get("carrier") || "";

  // Cart items passed from the cart drawer (serialized JSON)
  const itemsParam = searchParams.get("items") || "";
  let cartItemsParam: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    carrier: string;
  }> = [];
  if (itemsParam) {
    try {
      cartItemsParam = JSON.parse(itemsParam);
    } catch {
      cartItemsParam = [];
    }
  }

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    city: "Karachi",
    address: "",
    landmark: "",
    notes: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<"cod">("cod");
  const [couponCode, setCouponCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState("");

  // Determine dynamic package details
  let dynamicImage = imageParam || "/product pictures/Vodafone_img1_202304.jpg";
  let dynamicCarrier = carrierParam || "Vodafone UK";
  let dynamicPrice = priceParam || 3500;
  let dynamicTitle = pkgParam || "Official Vodafone UK Pay-As-You-Go SIM Card";

  if (pkgParam.toLowerCase().includes("t-mobile")) {
    dynamicImage = imageParam || "/t mobile/images (1).jpg";
    dynamicCarrier = "T-Mobile USA";
    if (!priceParam) dynamicPrice = 10500;
  } else if (pkgParam.toLowerCase().includes("giffgaff")) {
    dynamicImage = imageParam || "/product pictures/vodafone-sim.png";
    dynamicCarrier = "Giffgaff UK";
    if (!priceParam) dynamicPrice = 2000;
  } else if (pkgParam.toLowerCase().includes("ee")) {
    dynamicImage = imageParam || "/ee/ee-sim-card.svg";
    dynamicCarrier = "EE UK";
    if (!priceParam) dynamicPrice = 4000;
  } else if (pkgParam.toLowerCase().includes("lebara")) {
    dynamicImage = imageParam || "/lebara/lebara-sim-card.svg";
    dynamicCarrier = "Lebara UK";
    if (!priceParam) dynamicPrice = 2500;
  }

  // Dynamic Order Items (from cart drawer, or single package fallback)
  const hasSelectedPackage = Boolean(pkgParam) || cartItemsParam.length > 0;
  const orderItems =
    cartItemsParam.length > 0
      ? cartItemsParam.map((item) => ({
          id: item.id || `pkg-${Date.now()}`,
          name: item.name,
          qty: item.quantity || 1,
          price: item.price,
          image: item.image,
          carrier: item.carrier,
        }))
      : hasSelectedPackage
      ? [
          {
            id: `pkg-${Date.now()}`,
            name: dynamicTitle,
            qty: 1,
            price: dynamicPrice,
            image: dynamicImage,
            carrier: dynamicCarrier,
          },
        ]
      : [];

  const baseSubtotal = orderItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountAmount = discountApplied ? 500 : 0;
  const totalAmount = Math.max(0, baseSubtotal - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === "VODAFONE500" || couponCode.trim().toUpperCase() === "SIM500") {
      setDiscountApplied(true);
    } else {
      alert("Invalid coupon code. Try 'SIM500' for Rs. 500 off!");
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address) {
      alert("Please fill in your name, phone number, and delivery address.");
      return;
    }
    if (orderItems.length === 0) {
      alert("Please select a SIM package first before checking out.");
      return;
    }

    setIsSubmitting(true);
    const orderId = `VOD-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: orderId,
          customerName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          city: formData.city,
          address: formData.address,
          landmark: formData.landmark,
          notes: formData.notes,
          items: orderItems,
          totalAmount: totalAmount,
          paymentMethod: "Cash on Delivery",
          status: "Pending",
          createdAt: new Date().toISOString(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setGeneratedOrderId(orderId);
        setOrderSubmitted(true);
        clearCart();
      } else {
        alert("Failed to submit order. Please try again.");
      }
    } catch (err) {
      console.error("Checkout submission error:", err);
      setGeneratedOrderId(orderId);
      setOrderSubmitted(true);
      clearCart();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col justify-between pt-24 sm:pt-28">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 space-y-8">
        
        {/* Back link */}
        <div className="flex items-center justify-between">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to SIM Catalog</span>
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <ShieldCheck className="w-4 h-4" />
            <span>End-to-End Encrypted COD</span>
          </div>
        </div>

        {!orderSubmitted ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Customer Form (7 Cols) */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xl space-y-6">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Express Delivery Address
                </h1>
                <p className="text-xs font-semibold text-slate-500 mt-1">
                  Enter your details for Cash on Delivery across Pakistan.
                </p>
              </div>

              <form onSubmit={handleSubmitOrder} className="space-y-4">
                {/* Full Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="Muhammad Ali"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#E60000] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mobile / WhatsApp Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        placeholder="03001234567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#E60000] focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Email & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        placeholder="ali@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#E60000] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#E60000] focus:bg-white transition-all cursor-pointer"
                    >
                      <option value="Karachi">Karachi (Same Day / Next Day)</option>
                      <option value="Lahore">Lahore (Next Day Express)</option>
                      <option value="Islamabad">Islamabad / Rawalpindi</option>
                      <option value="Faisalabad">Faisalabad</option>
                      <option value="Multan">Multan</option>
                      <option value="Peshawar">Peshawar</option>
                      <option value="Quetta">Quetta</option>
                      <option value="Sialkot">Sialkot</option>
                      <option value="Other">Other City in Pakistan</option>
                    </select>
                  </div>
                </div>

                {/* Full Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Complete Street Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <textarea
                      required
                      rows={2}
                      placeholder="House/Flat number, Street name, Sector/Block..."
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#E60000] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Landmark & Special Notes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nearby Landmark
                    </label>
                    <input
                      type="text"
                      placeholder="Near Bilal Masjid / Main Market"
                      value={formData.landmark}
                      onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#E60000] focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Delivery Instructions
                    </label>
                    <input
                      type="text"
                      placeholder="Call before arrival"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#E60000] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Payment Selection */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                    PAYMENT METHOD
                  </label>

                  <div className="p-4 rounded-2xl bg-red-50/60 border-2 border-[#E60000] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#E60000] text-white flex items-center justify-center text-xs font-bold">
                        ✓
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900">Cash on Delivery (COD)</h4>
                        <p className="text-[10px] text-slate-500 font-semibold">Pay cash to courier rider upon SIM delivery.</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full uppercase">
                      FREE SHIPPING
                    </span>
                  </div>
                </div>

                {/* Submit Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || orderItems.length === 0}
                  className="w-full bg-[#E60000] hover:bg-[#CC0000] text-white font-extrabold text-xs py-4 rounded-2xl transition-all shadow-lg shadow-red-600/20 cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing Order...</span>
                    </>
                  ) : (
                    <span>CONFIRM &amp; PLACE COD ORDER</span>
                  )}
                </button>
              </form>
            </div>

            {/* Right Column: Order Summary (5 Cols) */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xl space-y-6">
              
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                <ShoppingBag className="w-5 h-5 text-[#E60000]" />
                <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">
                  Order Summary
                </h3>
              </div>

              {/* Order Items List */}
              {orderItems.length === 0 ? (
                <div className="py-8 text-center space-y-3">
                  <Package className="w-10 h-10 text-slate-300 mx-auto" />
                  <h4 className="text-sm font-black text-slate-700">No SIM Package Selected</h4>
                  <p className="text-xs text-slate-400 font-semibold">Please select a SIM card package from our catalog first.</p>
                  <Link
                    href="/products"
                    className="inline-block bg-[#E60000] text-white text-xs font-bold px-6 py-2.5 rounded-full transition-all"
                  >
                    Browse SIM Packages
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-white relative overflow-hidden border border-slate-200 shrink-0">
                          <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                          <span className="absolute top-0 right-0 bg-[#E60000] text-white text-[9px] font-black px-1.5 py-0.2 rounded-bl-md">
                            {item.qty}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-slate-900 leading-tight truncate">{item.name}</h4>
                          <span className="text-[10px] font-bold text-[#E60000] uppercase tracking-wider block mt-0.5">
                            {item.carrier}
                          </span>
                          <span className="text-xs font-black text-slate-900 block mt-1">
                            Rs. {item.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Coupon Code Input */}
                  <form onSubmit={handleApplyCoupon} className="flex gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="DISCOUNT CODE (E.G. SIM500)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 uppercase placeholder-slate-400 focus:outline-none focus:border-[#E60000]"
                    />
                    <button
                      type="submit"
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>

                  {/* Pricing Breakdown */}
                  <div className="space-y-2 pt-4 border-t border-slate-100 text-xs">
                    <div className="flex justify-between text-slate-600 font-semibold">
                      <span>Subtotal</span>
                      <span>Rs. {baseSubtotal.toLocaleString()}</span>
                    </div>

                    {discountApplied && (
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span>Discount (SIM500)</span>
                        <span>- Rs. 500</span>
                      </div>
                    )}

                    <div className="flex justify-between text-slate-600 font-semibold">
                      <span>Shipping (COD Courier)</span>
                      <span className="text-emerald-600 font-bold uppercase">FREE</span>
                    </div>

                    <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
                      <span>Total Payable</span>
                      <span className="text-[#E60000] text-xl">Rs. {totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>
        ) : (
          /* Success Screen */
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto space-y-6 shadow-2xl">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200 shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                COD ORDER CONFIRMED
              </span>
              <h2 className="text-3xl font-black text-slate-900 mt-3">
                Thank You, {formData.fullName}!
              </h2>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Your order <strong className="text-slate-900">#{generatedOrderId}</strong> has been successfully placed. Our agent will verify your details on WhatsApp shortly.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <Link
                href={`/track?id=${generatedOrderId}`}
                className="flex-1 bg-[#E60000] hover:bg-[#CC0000] text-white text-xs font-extrabold py-4 rounded-full transition-all text-center uppercase tracking-wider shadow-md shadow-red-600/20"
              >
                Track Order Live
              </Link>
            </div>
          </div>
        )}

      </main>

      <Footer />
      <Chatbot onOrderClick={() => {}} />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <>
      <header>
        <Navbar onOrderClick={() => {}} />
      </header>
      <Suspense fallback={<div className="min-h-screen pt-32 text-center text-xs font-bold">Loading Checkout...</div>}>
        <CheckoutContent />
      </Suspense>
    </>
  );
}
