"use client";

import { useState, use } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Chatbot from "../../components/Chatbot";
import SalesToast from "../../components/SalesToast";
import CheckoutModal from "../../components/CheckoutModal";
import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "../../../lib/blogData";
import {
  Calendar,
  Clock,
  ArrowLeft,
  ShoppingCart,
  ShieldCheck,
  Sparkles,
  Copy,
  MessageCircle,
  Search,
  ThumbsUp,
  Home,
  FileText,
  Smartphone,
  Flame,
} from "lucide-react";
import Script from "next/script";

export default function BlogPostDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const post = blogPosts.find((p) => p.slug === resolvedParams.slug);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState("Vodafone UK 1 SIM Card");
  const [selectedPrice, setSelectedPrice] = useState(3500);

  const [likesCount, setLikesCount] = useState(148);
  const [isLiked, setIsLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-center p-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 mb-2">Article Not Found</h1>
          <p className="text-xs text-slate-500 mb-4">The guide you are looking for does not exist.</p>
          <Link href="/blog" className="bg-slate-900 text-white text-xs font-bold px-6 py-2.5 rounded-full">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const openCheckout = (pkg?: string, price?: number) => {
    if (pkg) setSelectedPkg(pkg);
    if (price) setSelectedPrice(price);
    setModalOpen(true);
  };

  const handleLike = () => {
    if (isLiked) {
      setLikesCount((prev) => prev - 1);
      setIsLiked(false);
    } else {
      setLikesCount((prev) => prev + 1);
      setIsLiked(true);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  // Related Articles
  const relatedPosts = blogPosts.filter((p) => p.slug !== post.slug);

  // Article JSON-LD Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: "Vodafone Pakistan SIM Hub" },
    datePublished: "2026-08-01",
  };

  return (
    <>
      <Script
        id={`schema-article-${post.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <header>
        <Navbar onOrderClick={() => openCheckout()} />
      </header>

      <main className="min-h-screen bg-white text-slate-900 pt-28 pb-20 font-sans">
        {/* Full-width container */}
        <div className="w-full px-4 sm:px-6 lg:px-10">
          
          {/* Top Control Bar */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200">
            <Link
              href="/blog"
              className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-red-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Guides</span>
            </Link>

            <div className="relative w-72 hidden sm:block">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search SIM guides..."
                className="w-full bg-slate-100 border border-slate-200 rounded-full pl-9 pr-4 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-red-600 transition-all font-sans"
              />
            </div>
          </div>

          {/* 3-Column Edge-to-Edge Grid */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* ================= LEFT SIDEBAR (2.5 COLS) ================= */}
            <aside className="lg:col-span-2 space-y-6 hidden lg:block lg:sticky lg:top-28">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-2 font-sans">
                  Navigation
                </span>
                <nav className="space-y-1 pt-1 font-sans">
                  <Link
                    href="/"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all"
                  >
                    <Home className="w-4 h-4 text-slate-500" />
                    <span>Home</span>
                  </Link>
                  <Link
                    href="/blog"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 border border-red-200/60"
                  >
                    <FileText className="w-4 h-4 text-red-600" />
                    <span>All Articles</span>
                  </Link>
                  <Link
                    href="/products"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all"
                  >
                    <Smartphone className="w-4 h-4 text-slate-500" />
                    <span>Products</span>
                  </Link>
                </nav>
              </div>

              <div className="space-y-1 pt-4 border-t border-slate-200 font-sans">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-2">
                  Categories
                </span>
                <nav className="space-y-1 pt-1">
                  <Link
                    href="/blog?cat=TikTok+Live"
                    className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-all"
                  >
                    <span>TikTok Live</span>
                    <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">3</span>
                  </Link>
                  <Link
                    href="/blog?cat=UK+Banking"
                    className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-all"
                  >
                    <span>UK Banking</span>
                    <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">2</span>
                  </Link>
                  <Link
                    href="/blog?cat=US+Verification"
                    className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-all"
                  >
                    <span>US Verification</span>
                    <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">2</span>
                  </Link>
                </nav>
              </div>

              {/* Express Delivery Box */}
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200/80 text-slate-900 space-y-2 shadow-xs font-sans">
                <span className="text-[10px] font-black uppercase tracking-wider text-red-600">
                  FREE COD SHIPPING
                </span>
                <h4 className="text-xs font-black text-slate-900 leading-snug">
                  Vodafone UK &amp; T-Mobile USA SIMs
                </h4>
                <button
                  onClick={() => openCheckout("Vodafone UK 1 SIM Card", 3500)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white text-[11px] font-black py-2 rounded-xl transition-all cursor-pointer shadow-xs mt-2"
                >
                  Order SIM Now
                </button>
              </div>
            </aside>

            {/* ================= MIDDLE MAIN READING ARTICLE COLUMN (7 COLS) ================= */}
            <div className="lg:col-span-7 bg-white space-y-6 font-sans">
              
              {/* Article Header */}
              <div className="space-y-4">
                <h1 className="text-2xl sm:text-4xl md:text-[40px] font-extrabold text-[#0F172A] tracking-tight leading-[1.18]">
                  {post.title}
                </h1>

                {/* Author Avatar & Meta Line */}
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-9 h-9 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                    {post.author.charAt(0)}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <span className="text-slate-900 font-bold">{post.author}</span>
                    <span>•</span>
                    <span className="bg-red-50 text-red-600 border border-red-200/60 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase">
                      {post.category}
                    </span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>
                </div>
              </div>

              {/* Main Featured Cover Image */}
              <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-md">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Structured Editorial Body Content */}
              <article className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-sm sm:text-base space-y-6 pt-2 font-sans">
                {post.content.split("\n\n").map((paragraph, pIdx) => {
                  const trimmed = paragraph.trim();

                  if (trimmed === "---") {
                    return <hr key={pIdx} className="my-6 border-slate-200" />;
                  }

                  if (trimmed.startsWith("## ")) {
                    return (
                      <h2 key={pIdx} className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight pt-6 pb-2 border-b border-slate-200 font-sans">
                        {trimmed.replace("## ", "")}
                      </h2>
                    );
                  }

                  if (trimmed.startsWith("### ")) {
                    return (
                      <h3 key={pIdx} className="text-base sm:text-lg font-extrabold text-[#0F172A] pt-4 pb-1 font-sans">
                        {trimmed.replace("### ", "")}
                      </h3>
                    );
                  }

                  if (trimmed.startsWith("- ")) {
                    const bulletItems = trimmed.split("\n- ").map((item) => item.replace("- ", ""));
                    return (
                      <ul key={pIdx} className="space-y-2.5 my-4 pl-5 list-disc text-slate-700 text-sm sm:text-base font-normal">
                        {bulletItems.map((bItem, bIdx) => (
                          <li key={bIdx} className="leading-relaxed">
                            {bItem}
                          </li>
                        ))}
                      </ul>
                    );
                  }

                  return (
                    <p key={pIdx} className="text-slate-700 text-sm sm:text-base leading-[1.85] font-normal">
                      {trimmed}
                    </p>
                  );
                })}

                {/* In-Article Callout Box (MATCHING BRAND THEME) */}
                <div className="bg-gradient-to-br from-red-50/90 via-white to-red-50/40 p-6 sm:p-8 rounded-3xl border border-red-200/80 space-y-4 my-10 shadow-md not-prose font-sans">
                  <div className="flex items-center gap-2 text-xs font-black uppercase text-red-600 tracking-wider">
                    <Sparkles className="w-4 h-4 text-red-600" /> Need an Official Physical SIM Card in Pakistan?
                  </div>
                  <h4 className="text-lg sm:text-2xl font-black text-[#0F172A] leading-snug">
                    Get Your Vodafone UK or T-Mobile USA SIM Delivered via COD
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    100% Factory sealed genuine physical SIM card shipped directly to your doorstep in Karachi, Lahore, Islamabad, or any city in Pakistan.
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => openCheckout("Vodafone UK 1 SIM Card", 3500)}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold px-6 py-3.5 rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-2 uppercase tracking-wider"
                    >
                      <ShoppingCart className="w-4 h-4" /> ORDER SIM VIA CASH ON DELIVERY
                    </button>
                    <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" /> Free 2-3 Days Delivery
                    </span>
                  </div>
                </div>
              </article>

              {/* Engagement Bar */}
              <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 font-sans">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                      isLiked
                        ? "bg-red-50 text-red-600 border-red-200"
                        : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{likesCount} Likes</span>
                  </button>

                  <button
                    onClick={() => openCheckout("Vodafone UK 1 SIM Card", 3500)}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-extrabold bg-red-600 text-white hover:bg-red-700 transition-all cursor-pointer shadow-xs"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Order SIM (COD)</span>
                  </button>
                </div>

                <button
                  onClick={handleCopyLink}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? "Link Copied!" : "Copy Link"}</span>
                </button>
              </div>
            </div>

            {/* ================= RIGHT SIDEBAR (3 COLS) ================= */}
            <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-28 font-sans">
              
              {/* Quick SIM Order Cards */}
              <div className="bg-slate-50/70 p-5 rounded-3xl border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5">
                  <Flame className="w-4 h-4 text-red-600" />
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Quick SIM Order
                  </h3>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-slate-900">Vodafone UK SIM</h4>
                      <span className="text-[11px] font-bold text-red-600">Rs. 3,500</span>
                    </div>
                    <button
                      onClick={() => openCheckout("Vodafone UK 1 SIM Card", 3500)}
                      className="bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                    >
                      Order
                    </button>
                  </div>

                  <div className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-slate-900">T-Mobile USA SIM</h4>
                      <span className="text-[11px] font-bold text-pink-600">Rs. 10,500</span>
                    </div>
                    <button
                      onClick={() => openCheckout("T-Mobile USA 1 SIM Card", 10500)}
                      className="bg-brand-magenta hover:bg-pink-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                    >
                      Order
                    </button>
                  </div>
                </div>
              </div>

              {/* Share To Social Icons */}
              <div className="bg-slate-50/70 p-5 rounded-3xl border border-slate-200/80 space-y-3">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">
                  Share Article
                </h3>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(post.title)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center hover:scale-105 transition-transform"
                    title="Share on WhatsApp"
                  >
                    <MessageCircle className="w-4.5 h-4.5" />
                  </a>
                  <button
                    onClick={handleCopyLink}
                    className="w-9 h-9 rounded-full bg-white text-slate-700 border border-slate-200 flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                    title="Copy Link"
                  >
                    <Copy className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>

              {/* Related Articles List */}
              <div className="bg-slate-50/70 p-5 rounded-3xl border border-slate-200/80 space-y-3">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">
                  Related Articles
                </h3>

                <div className="space-y-3">
                  {relatedPosts.map((rPost) => (
                    <Link
                      key={rPost.id}
                      href={`/blog/${rPost.slug}`}
                      className="flex items-start gap-3 group"
                    >
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        <Image src={rPost.coverImage} alt={rPost.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
                          {rPost.title}
                        </h4>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {rPost.category}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

            </aside>

          </div>
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
