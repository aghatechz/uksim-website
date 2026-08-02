"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import Image from "next/image";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  carrier: string;
}

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: WishlistItem[];
  onRemoveItem: (id: string) => void;
  onMoveToCart: (item: WishlistItem) => void;
}

export default function WishlistDrawer({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onMoveToCart,
}: WishlistDrawerProps) {
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

          {/* Right Slide-Over Wishlist Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col justify-between font-sans border-l border-slate-200"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-red-50/40">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-600 fill-red-600" />
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Your Wishlist</h2>
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Wishlist Items Scrollable List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-400 mb-4">
                    <Heart className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">Your wishlist is empty</h3>
                  <p className="text-xs text-slate-500 mb-6">
                    Click the heart icon on any SIM product card to save your favorite SIMs here.
                  </p>
                  <button
                    onClick={onClose}
                    className="bg-slate-900 text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-black transition-all cursor-pointer shadow-sm"
                  >
                    Browse SIM Store
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 bg-[#F8FAFC] rounded-2xl border border-slate-200/80 relative group"
                  >
                    {/* Thumbnail Image */}
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Info & Move to Cart */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-extrabold text-slate-900 line-clamp-2 leading-snug">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-slate-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                            title="Remove from Wishlist"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block mt-0.5">
                          {item.carrier}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60">
                        <span className="text-xs font-black text-slate-900">
                          Rs. {item.price.toLocaleString()}.00
                        </span>

                        <button
                          onClick={() => {
                            onMoveToCart(item);
                            onRemoveItem(item.id);
                          }}
                          className="bg-slate-900 hover:bg-black text-white text-[11px] font-bold px-3 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <ShoppingCart className="w-3 h-3" /> Move to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t border-slate-200 bg-white">
                <button
                  onClick={onClose}
                  className="w-full text-center text-xs font-bold text-slate-600 hover:text-slate-900 py-2 transition-colors cursor-pointer"
                >
                  Continue Browsing
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
