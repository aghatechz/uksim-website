"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ShoppingCart,
  Phone,
  Wifi,
  Globe,
  Heart,
  Search,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "./CartProvider";

const topBarAnnouncements = [
  { icon: Phone, text: "WhatsApp & Call Support: +92 340 8219725", highlight: "24/7 Active" },
  { icon: Globe, text: "Official Vodafone UK & T-Mobile USA SIM Distributor in Pakistan", highlight: "100% Genuine" },
  { icon: CheckCircle2, text: "Free Cash on Delivery (COD) All Over Pakistan", highlight: "Zero Shipping Fee" },
  { icon: Sparkles, text: "TikTok Live & Monetization Guaranteed Unblock", highlight: "No VPN Needed" },
  { icon: ShieldCheck, text: "Instant OTP SMS Verification for Wise, PayPal, Monzo & Banks", highlight: "Verified" },
  { icon: Truck, text: "Same-Day Dispatch • 2 to 3 Working Days Delivery", highlight: "Fast Shipping" },
];

const navLinks = [
  { label: "Home", href: "/", isSection: false },
  { label: "Vodafone UK", href: "/#vodafone", isSection: true, sectionId: "vodafone" },
  { label: "T-Mobile USA", href: "/#tmobile", isSection: true, sectionId: "tmobile" },
  { label: "Track Order", href: "/track", isSection: false },
  { label: "Reviews", href: "/#reviews", isSection: true, sectionId: "reviews" },
  { label: "FAQs", href: "/#faq", isSection: true, sectionId: "faq" },
  { label: "Blog", href: "/blog", isSection: false },
];

const searchableProducts = [
  {
    id: "vodafone-uk-official",
    name: "Official Vodafone UK Pay-As-You-Go SIM Card",
    price: 3500,
    image: "/product pictures/Vodafone_img1_202304.jpg",
    carrier: "Vodafone UK",
  },
  {
    id: "tmobile-usa-official",
    name: "Official T-Mobile USA Pay-As-You-Go SIM Card",
    price: 10500,
    image: "/t mobile/images (1).jpg",
    carrier: "T-Mobile USA",
  },
  {
    id: "giffgaff-uk-sim",
    name: "Giffgaff UK SIM Card in Pakistan",
    price: 2000,
    image: "/product pictures/vodafone-sim.png",
    carrier: "Giffgaff UK",
  },
  {
    id: "ee-uk-sim",
    name: "EE UK Pay-As-You-Go SIM Card in Pakistan",
    price: 4000,
    image: "/ee/ee-sim-card.svg",
    carrier: "EE UK",
  },
  {
    id: "lebara-uk-sim",
    name: "Lebara UK Pay-As-You-Go SIM Card in Pakistan",
    price: 2500,
    image: "/lebara/lebara-sim-card.svg",
    carrier: "Lebara UK",
  },
];

export default function Navbar({
  onOrderClick,
}: {
  onOrderClick?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isHomePage = pathname === "/";
  const isTransparentTheme = isHomePage && !scrolled;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Global Cart & Wishlist State (shared across the whole site)
  const { cartCount, wishlistItems, openCart, openWishlist } = useCart();

  const searchResults = searchableProducts.filter(
    (p) =>
      searchQuery.trim() !== "" &&
      (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.carrier.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleNavClick = (link: typeof navLinks[0]) => {
    if (link.isSection && isHomePage && link.sectionId) {
      const el = document.getElementById(link.sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Navigates directly to /products page when clicking Order SIM
  const handleOrderSimClick = () => {
    if (pathname === "/products") {
      onOrderClick?.();
    } else {
      router.push("/products");
    }
  };



  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300">
        {/* Top Continuous Marquee Ticker Bar */}
        <AnimatePresence>
          {!scrolled && (
            <motion.div
              initial={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-r from-[#B30000] via-[#E60000] to-[#990000] text-white text-[11.5px] py-2 overflow-hidden border-b border-red-700/60 shadow-xs relative"
            >
              <div className="flex animate-marquee whitespace-nowrap items-center hover:[animation-play-state:paused] cursor-pointer">
                {[...topBarAnnouncements, ...topBarAnnouncements].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-center gap-2 mx-6 shrink-0">
                      <span className="bg-white/15 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-red-100 border border-white/20">
                        {item.highlight}
                      </span>
                      <Icon className="w-3.5 h-3.5 text-white shrink-0" />
                      <span className="text-white font-bold">{item.text}</span>
                      <span className="text-white/40 ml-4 font-bold">•</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Navbar */}
        <div
          className={`transition-all duration-300 ${
            isTransparentTheme
              ? "bg-transparent py-4"
              : "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3"
          }`}
        >
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              
              {/* Left Brand Logo */}
              <Link href="/" className="flex items-center gap-2.5 group">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-105 transition-all shadow-xs ${
                    isTransparentTheme
                      ? "bg-white/20 backdrop-blur-md text-white"
                      : "bg-[#E60000] text-white"
                  }`}
                >
                  <Wifi className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span
                    className={`text-lg font-black leading-tight tracking-tight transition-colors ${
                      isTransparentTheme ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Vodafone
                  </span>
                  <span
                    className={`text-[10px] font-bold leading-none -mt-0.5 transition-colors ${
                      isTransparentTheme ? "text-white/80" : "text-slate-500"
                    }`}
                  >
                    Pakistan SIM Hub
                  </span>
                </div>
              </Link>

              {/* Center Navigation Links */}
              <div className="hidden lg:flex items-center gap-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;

                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => handleNavClick(link)}
                      className={`px-3.5 py-2 text-xs font-black transition-all rounded-xl ${
                        isTransparentTheme
                          ? isActive
                            ? "text-white font-black"
                            : "text-white/90 hover:text-white hover:bg-white/10"
                          : isActive
                          ? "bg-red-50 text-[#E60000]"
                          : "text-slate-700 hover:text-[#E60000] hover:bg-slate-100"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              {/* Right Utility Icons & CTA */}
              <div className="hidden lg:flex items-center gap-2.5">
                {/* Search Icon */}
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  title="Search SIM Packages"
                  className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                    searchOpen
                      ? "bg-[#E60000] text-white"
                      : isTransparentTheme
                      ? "text-white hover:bg-white/15"
                      : "text-slate-700 hover:text-[#E60000] hover:bg-slate-100"
                  }`}
                >
                  <Search className="w-4.5 h-4.5" />
                </button>

                {/* Wishlist Heart Icon */}
                <button
                  onClick={openWishlist}
                  title="Open Wishlist"
                  className={`relative p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                    isTransparentTheme
                      ? "text-white hover:bg-white/15"
                      : "text-slate-700 hover:text-[#E60000] hover:bg-slate-100"
                  }`}
                >
                  <Heart className="w-4.5 h-4.5" />
                  {wishlistItems.length > 0 && (
                    <span className="absolute top-1 right-1 bg-[#E60000] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-xs">
                      {wishlistItems.length}
                    </span>
                  )}
                </button>

                {/* Shopping Cart Drawer Icon */}
                <button
                  onClick={openCart}
                  title="Open Shopping Cart"
                  className={`relative p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                    isTransparentTheme
                      ? "text-white hover:bg-white/15"
                      : "text-slate-700 hover:text-[#E60000] hover:bg-slate-100"
                  }`}
                >
                  <ShoppingCart className="w-4.5 h-4.5" />
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-1 bg-slate-900 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-xs">
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* Order SIM Button -> Routes to /products */}
                <button
                  onClick={handleOrderSimClick}
                  className="bg-[#E60000] hover:bg-[#CC0000] text-white px-4.5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-md cursor-pointer ml-1 tracking-wider uppercase"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Order SIM
                </button>
              </div>

              {/* Mobile Actions & Menu Toggle */}
              <div className="flex items-center gap-1.5 lg:hidden">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className={`p-2 rounded-xl ${isTransparentTheme ? "text-white" : "text-slate-800"}`}
                >
                  <Search className="w-5 h-5" />
                </button>
                <button
                  onClick={openCart}
                  className={`p-2 rounded-xl relative ${isTransparentTheme ? "text-white" : "text-slate-800"}`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-1 bg-[#E60000] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className={`p-2 rounded-xl ${isTransparentTheme ? "text-white hover:bg-white/10" : "text-slate-800 hover:bg-slate-100"}`}
                >
                  {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>

            </div>

            {/* Live Search Drawer */}
            <AnimatePresence>
              {searchOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="pt-3 pb-2"
                >
                  <div className="max-w-2xl mx-auto bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xl space-y-2">
                    <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                      <Search className="w-4.5 h-4.5 text-[#E60000] ml-3 shrink-0" />
                      <input
                        type="text"
                        placeholder="Search Vodafone, T-Mobile, EE, Lebara, or Giffgaff SIMs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent border-none text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none px-2 py-2 font-semibold"
                        autoFocus
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery("")}
                          className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        type="submit"
                        className="bg-[#E60000] text-white text-xs font-black px-5 py-2 rounded-xl cursor-pointer hover:bg-red-700 transition-all shrink-0 uppercase"
                      >
                        Search
                      </button>
                    </form>

                    {searchQuery.trim() !== "" && (
                      <div className="border-t border-slate-100 pt-2 space-y-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-3">
                          Found {searchResults.length} {searchResults.length === 1 ? "result" : "results"}
                        </span>
                        {searchResults.length === 0 ? (
                          <div className="p-3 text-xs text-slate-500 text-center">
                            No SIM packages matched "{searchQuery}".
                          </div>
                        ) : (
                          searchResults.map((item) => (
                            <Link
                              key={item.id}
                              href={`/products?search=${encodeURIComponent(item.name)}`}
                              onClick={() => setSearchOpen(false)}
                              className="flex items-center justify-between p-2.5 hover:bg-red-50/60 rounded-xl transition-all group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                                </div>
                                <div>
                                  <h4 className="text-xs font-black text-slate-900 group-hover:text-[#E60000] transition-colors line-clamp-1">
                                    {item.name}
                                  </h4>
                                  <span className="text-[10px] font-bold text-[#E60000] uppercase">{item.carrier}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-slate-900">
                                  Rs. {item.price.toLocaleString()}
                                </span>
                                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#E60000] group-hover:translate-x-1 transition-all" />
                              </div>
                            </Link>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </nav>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-[56px] left-0 right-0 z-30 bg-white border-b border-slate-200 shadow-2xl lg:hidden p-5 space-y-4"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => {
                    setMobileOpen(false);
                    handleNavClick(link);
                  }}
                  className="px-4 py-2.5 text-sm font-extrabold text-slate-800 hover:text-[#E60000] hover:bg-red-50 rounded-xl transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleOrderSimClick();
                }}
                className="w-full bg-[#E60000] text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider shadow-md flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" /> Order SIM Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}
