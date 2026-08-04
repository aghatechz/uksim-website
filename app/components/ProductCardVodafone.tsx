"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Plus,
  Minus,
  Lock,
  ShoppingCart,
} from "lucide-react";
import Image from "next/image";

const thumbnails = [
  "/vodafone/WhatsApp Image 2026-08-04 at 3.18.06 AM.jpeg",
  "/vodafone/WhatsApp Image 2026-08-04 at 3.18.07 AM.jpeg",
  "/vodafone/WhatsApp Image 2026-08-04 at 3.19.15 AM.jpeg",
  "/vodafone/WhatsApp Image 2026-08-04 at 3.20.28 AM.jpeg",
  "/product pictures/Vodafone_img1_202304.jpg",
  "/vodafone/WhatsApp Image 2026-08-01 at 10.00.16 AM (2).jpeg",
];

export default function ProductCardVodafone({
  onOrderClick,
  onAddToCart,
}: {
  onOrderClick: (pkg: string, price: number) => void;
  onAddToCart?: (item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    carrier: string;
  }) => void;
}) {
  const [activeThumb, setActiveThumb] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Auto-rotate thumbnails every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveThumb((prev) => (prev + 1) % thumbnails.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const unitPrice = 3500;
  const originalUnitPrice = 6000;

  const currentPrice = unitPrice * quantity;
  const currentOriginal = originalUnitPrice * quantity;

  const handleOrder = () => {
    const pkgLabel = `Official Vodafone UK SIM (Qty: ${quantity})`;
    onOrderClick(pkgLabel, currentPrice);
  };

  const handleCartClick = () => {
    if (onAddToCart) {
      onAddToCart({
        id: "vodafone-uk-official",
        name: "Official Vodafone UK Pay-As-You-Go SIM",
        price: unitPrice,
        quantity: quantity,
        image: "/vodafone/WhatsApp Image 2026-08-04 at 3.18.06 AM.jpeg",
        carrier: "Vodafone UK",
      });
    } else {
      handleOrder();
    }
  };

  return (
    <section id="vodafone" className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column (6 Cols) - Product Image Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 flex flex-col items-center"
          >
            {/* Main Active Image Display */}
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-gray-100 shadow-lg border border-gray-100 flex items-center justify-center">
              <div className="relative w-full h-full min-h-[260px]">
                <Image
                  src={thumbnails[activeThumb]}
                  alt="Vodafone UK SIM Card"
                  fill
                  className="object-cover transition-all duration-300"
                  priority
                />
              </div>
            </div>

            {/* 6 Thumbnails Grid Row */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 w-full mt-4">
              {thumbnails.map((imgSrc, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveThumb(idx)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${activeThumb === idx
                    ? "border-red-600 ring-2 ring-red-600/30 scale-105 shadow-md"
                    : "border-transparent opacity-80 hover:opacity-100 hover:border-gray-200"
                    }`}
                >
                  <Image
                    src={imgSrc}
                    alt={`Vodafone thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right Column (6 Cols) - Product Info & Purchase Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xl shadow-gray-200/50"
          >
            {/* Rating */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs font-semibold text-gray-500">(1,248 Reviews)</span>
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight leading-snug mb-3">
              Official Vodafone UK Pay-As-You-Go SIM
            </h2>

            {/* Description */}
            <p className="text-sm md:text-base text-slate-700 font-medium leading-relaxed mb-6">
              Works perfectly for TikTok Live in Pakistan, UK number verification for PayPal/Stripe, and international roaming without monthly contracts.
            </p>

            {/* Price Row */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl md:text-4xl font-black text-[#E60000] tracking-tight">
                Rs. {currentPrice.toLocaleString()}
              </span>
              <span className="text-sm md:text-base text-slate-400 line-through font-medium">
                Rs. {currentOriginal.toLocaleString()}
              </span>
              <span className="bg-red-50 text-[#E60000] border border-red-200/60 text-xs font-extrabold px-2.5 py-1 rounded-md">
                42% OFF
              </span>
            </div>

            {/* Quantity & Add to Cart Section */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  Select Quantity
                </label>
                <div className="flex items-center gap-3">
                  {/* Stepper */}
                  <div className="inline-flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                      aria-label="Decrease"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center text-sm font-extrabold text-gray-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                      aria-label="Increase"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* ADD TO CART Button (Opens Slide-Over Cart Drawer) */}
                  <button
                    onClick={handleCartClick}
                    className="flex-1 border-2 border-slate-900 hover:bg-slate-900 hover:text-white text-slate-900 py-3 px-6 rounded-xl text-xs md:text-sm font-extrabold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    ADD TO CART
                  </button>
                </div>
              </div>

              {/* Primary Action Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleOrder}
                className="w-full btn-ripple bg-gradient-to-r from-[#E60000] to-[#CC0000] hover:from-[#CC0000] hover:to-[#B30000] text-white py-4 rounded-2xl text-xs md:text-sm font-black uppercase tracking-wider shadow-xl shadow-red-500/25 transition-all text-center cursor-pointer"
              >
                BUY NOW - CASH ON DELIVERY (Rs. {currentPrice.toLocaleString()})
              </motion.button>
            </div>

            {/* Trust Subtext */}
            <div className="mt-4 text-center border-t border-gray-100 pt-4">
              <span className="text-xs text-gray-500 font-medium inline-flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-gray-400" />
                Secure Transaction | Pay when you receive
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
