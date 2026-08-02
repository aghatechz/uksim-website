"use client";

import { useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Chatbot from "../components/Chatbot";
import SalesToast from "../components/SalesToast";
import CheckoutModal from "../components/CheckoutModal";
import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "../../lib/blogData";
import {
  Search,
  Calendar,
  Clock,
  User,
  ArrowRight,
  ChevronRight,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BlogListingPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState("Vodafone UK 1 SIM Card");
  const [selectedPrice, setSelectedPrice] = useState(3500);

  // Search & Category Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState<boolean>(false);

  const openCheckout = (pkg?: string, price?: number) => {
    if (pkg) setSelectedPkg(pkg);
    if (price) setSelectedPrice(price);
    setModalOpen(true);
  };

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        activeCategory === "All" || post.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <>
      <header>
        <Navbar onOrderClick={() => openCheckout()} />
      </header>

      <main className="min-h-screen bg-white text-slate-900 pt-28 pb-20 font-sans">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* ================= SIMPLE CLEAN CONTROL BAR (MATCHING PRODUCTS PAGE) ================= */}
          <div className="flex flex-col sm:flex-row items-center justify-between py-6 border-b border-slate-200 gap-4 mb-10">
            {/* Left Side: Filter Button */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
                className="flex items-center gap-2 text-base font-semibold text-slate-800 hover:text-red-600 transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
                {activeCategory !== "All" && (
                  <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-bold">
                    Active
                  </span>
                )}
              </button>
            </div>

            {/* Middle: Clean Search Bar Input */}
            <div className="flex-1 max-w-md mx-4">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3" />
                <input
                  type="text"
                  placeholder="Search SIM guides, TikTok Live, Wise OTP..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-100 border border-slate-200 rounded-full pl-9 pr-8 py-2 text-xs font-medium focus:outline-none focus:bg-white focus:border-red-600 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Right Side: Total Articles Count */}
            <div className="text-xs font-bold text-slate-500">
              <span>{filteredPosts.length} SIM Guides</span>
            </div>
          </div>

          {/* Expandable Category Filter Drawer */}
          <AnimatePresence>
            {filterDrawerOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-8 border-b border-slate-200 pb-6"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">
                    Filter Category:
                  </span>
                  {["All", "TikTok Live", "UK Banking", "US Verification", "SIM Guide"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                        activeCategory === cat
                          ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                          : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ================= CLEAN BLOG POSTS GRID ================= */}
          {filteredPosts.length === 0 ? (
            <div className="bg-slate-50 rounded-2xl p-12 text-center border border-slate-200">
              <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-1">No articles found</h3>
              <p className="text-xs text-slate-500 mb-4">
                No guides matched "{searchQuery}". Try clearing your search query.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
                className="bg-slate-900 text-white text-xs font-bold px-5 py-2.5 rounded-full cursor-pointer hover:bg-black transition-all"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative aspect-[4/3] w-full bg-[#F6F7F9] overflow-hidden border-b border-slate-100">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 right-3 bg-slate-900 text-white text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">
                        {post.category}
                      </span>
                    </div>

                    <div className="p-5 space-y-2.5">
                      <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> {post.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {post.readTime}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 font-normal">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" /> {post.author}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 transition-all"
                    >
                      Read Article <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <Chatbot onOrderClick={() => openCheckout()} />
      <SalesToast />

      <CheckoutModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedPackage={selectedPkg}
        selectedPrice={selectedPrice}
      />
    </>
  );
}
