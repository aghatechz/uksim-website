"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  carrier: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: (pkgName: string, price: number) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50"
          />

          {/* Right Slide-Over Cart Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col justify-between font-sans border-l border-slate-200"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-red-600" />
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Your Cart</h2>
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                  {items.reduce((sum, item) => sum + item.quantity, 0)} {items.length === 1 ? "item" : "items"}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items Scrollable List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">Your cart is empty</h3>
                  <p className="text-xs text-slate-500 mb-6">
                    Add a Vodafone UK, T-Mobile USA, EE, Lebara, or Giffgaff SIM to your cart to proceed.
                  </p>
                  <button
                    onClick={onClose}
                    className="bg-slate-900 text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-black transition-all cursor-pointer shadow-sm"
                  >
                    Explore SIM Store
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 bg-[#F8FAFC] rounded-2xl border border-slate-200/80 relative group"
                  >
                    {/* Item Image */}
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-extrabold text-slate-900 line-clamp-2 leading-snug">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-slate-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block mt-0.5">
                          {item.carrier}
                        </span>
                      </div>

                      {/* Qty Controls & Price */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60">
                        <div className="flex items-center border border-slate-300 rounded-lg bg-white">
                          <button
                            onClick={() => onUpdateQty(item.id, Math.max(1, item.quantity - 1))}
                            className="p-1 hover:bg-slate-100 text-slate-600 cursor-pointer rounded-l-lg"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-slate-100 text-slate-600 cursor-pointer rounded-r-lg"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-black text-slate-900">
                          Rs. {(item.price * item.quantity).toLocaleString()}.00
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout Action */}
            {items.length > 0 && (
              <div className="p-5 border-t border-slate-200 bg-white space-y-4 shadow-lg">
                {/* Shipping & Guarantee Notice */}
                <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-2.5 flex items-center justify-between text-xs font-bold text-emerald-800">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-emerald-600" /> Cash on Delivery (Pakistan)
                  </span>
                  <span className="text-emerald-700 font-extrabold uppercase text-[10px] bg-emerald-100 px-2 py-0.5 rounded-full">
                    FREE
                  </span>
                </div>

                {/* Pricing Summary */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900">Rs. {subtotal.toLocaleString()}.00</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Charges</span>
                    <span className="font-bold text-emerald-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
                    <span>Total Amount</span>
                    <span className="text-red-600 text-base">Rs. {subtotal.toLocaleString()}.00</span>
                  </div>
                </div>

                {/* Redirects to dedicated /checkout page */}
                <button
                  onClick={() => onCheckout("Cart", subtotal)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>PROCEED TO CHECKOUT VIA COD</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onClose}
                  className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-800 py-1 transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
