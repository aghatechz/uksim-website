"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#050505] text-white pt-16 pb-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Top 3-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 pb-12">
          {/* Column 1: Brand Info */}
          <div>
            <h3 className="text-xl font-bold text-[#E60000] mb-4">
              Vodafone UK
            </h3>
            <p className="text-white/60 text-sm max-w-xs mb-6 leading-relaxed">
              The leading provider of original UK SIM cards in Pakistan. Helping
              content creators and entrepreneurs stay connected globally.
            </p>
            {/* Social Buttons */}
            <div className="flex items-center gap-3 mt-5">
              <a
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-slate-400 hover:bg-[#E60000] hover:border-[#E60000] hover:text-white hover:-translate-y-[1px] transition-all duration-300 group social-btn"
                href="#"
                aria-label="Instagram"
              >
                <svg
                  className="w-5 h-5 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                </svg>
              </a>
              <a
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-slate-400 hover:bg-[#E60000] hover:border-[#E60000] hover:text-white hover:-translate-y-[1px] transition-all duration-300 group social-btn"
                href="#"
                aria-label="Facebook"
              >
                <svg
                  className="w-5 h-5 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"></path>
                </svg>
              </a>
              <a
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-slate-400 hover:bg-[#E60000] hover:border-[#E60000] hover:text-white hover:-translate-y-[1px] transition-all duration-300 group social-btn"
                href="#"
                aria-label="X Twitter"
              >
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Support & Help */}
          <div>
            <h4 className="font-bold text-white mb-6">Support &amp; Help</h4>
            <ul className="space-y-3 text-white/60 text-sm">
              <li>
                <Link className="hover:text-brand-red transition-colors" href="/blog/how-to-start-tiktok-live-in-pakistan-with-uk-sim">
                  How to Activate SIM
                </Link>
              </li>
              <li>
                <Link className="hover:text-brand-red transition-colors" href="/blog/how-to-start-tiktok-live-in-pakistan-with-uk-sim">
                  Setup TikTok Live
                </Link>
              </li>
              <li>
                <Link className="hover:text-brand-red transition-colors" href="/blog">
                  Top-up Guide
                </Link>
              </li>
              <li>
                <Link className="hover:text-brand-red transition-colors" href="/checkout">
                  Order Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Official Policies */}
          <div>
            <h4 className="font-bold text-white mb-6">Official Policies</h4>
            <ul className="space-y-3 text-white/60 text-sm">
              <li>
                <Link className="hover:text-brand-red transition-colors" href="/privacy-policy">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link className="hover:text-brand-red transition-colors" href="/terms-of-service">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a className="hover:text-brand-red transition-colors" href="#">
                  Warranty Info
                </a>
              </li>
              <li>
                <a className="hover:text-brand-red transition-colors" href="#">
                  Affiliate Program
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* GIANT CENTER RED VODAFONE WATERMARK TEXT (MATCHING SCREENSHOT) */}
        <div className="py-8 my-4 text-center overflow-hidden select-none">
          <h2 className="text-6xl sm:text-8xl md:text-[140px] lg:text-[160px] font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#E60000] via-[#CC0000]/80 to-[#880000]/40 opacity-90 leading-none drop-shadow-2xl">
            VODAFONE
          </h2>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© 2026 Vodafone UK Pakistan. All rights reserved.</p>
          <Link href="/admin" className="hover:text-white/80 transition-colors flex items-center gap-1">
            <span>🔒 Admin Portal</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
