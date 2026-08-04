"use client";

import { motion } from "framer-motion";
import { Home, ShoppingCart, MessageCircle } from "lucide-react";
import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between selection:bg-[#E60000] selection:text-white">
      {/* Header */}
      <header>
        <Navbar />
      </header>

      {/* Main Content Container */}
      <main className="flex-1 relative flex items-center justify-center py-20 sm:py-28 px-4 overflow-hidden">
        {/* Subtle Architectural Dot Pattern Background */}
        <div
          className="absolute inset-0 opacity-[0.35] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#cbd5e1 1.2px, transparent 1.2px)`,
            backgroundSize: `24px 24px`,
          }}
        />

        <div className="relative z-10 max-w-xl mx-auto text-center space-y-7">


          {/* 404 Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-2 select-none"
          >
            <h1 className="text-7xl sm:text-8xl md:text-9xl font-black text-slate-900 tracking-tight leading-none">
              404
            </h1>
          </motion.div>

          {/* Title & Description */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-3"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              We couldn't find that page
            </h2>
            <p className="text-sm sm:text-base text-slate-500 max-w-md mx-auto leading-relaxed font-medium">
              The page you are looking for might have been removed, renamed, or is temporarily unavailable.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
          >
            <Link
              href="/"
              className="w-full sm:w-auto bg-[#E60000] hover:bg-[#CC0000] text-white px-7 py-3.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 group cursor-pointer"
            >
              <Home className="w-4 h-4" />
              Return to Homepage
            </Link>

            <Link
              href="/products"
              className="w-full sm:w-auto bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 px-7 py-3.5 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4 text-[#E60000]" />
              Browse SIM Cards
            </Link>
          </motion.div>

          {/* Direct Support Sublink */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="pt-4"
          >
            <a
              href="https://wa.me/923408219725?text=Hi!%20I%20hit%20a%20404%20page%20and%20need%20assistance"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#E60000] transition-colors font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              Need assistance? Chat with Support Team
            </a>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
