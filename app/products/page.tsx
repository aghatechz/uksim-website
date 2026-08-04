"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import CheckoutModal from "../components/CheckoutModal";
import { useCart } from "../components/CartProvider";
import Footer from "../components/Footer";
import Chatbot from "../components/Chatbot";
import SalesToast from "../components/SalesToast";
import Link from "next/link";
import Image from "next/image";
import {
  Star,
  Heart,
  Eye,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Search,
  ShoppingCart,
  Zap,
  RotateCcw,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductItem {
  id: string;
  name: string;
  category: "Vodafone UK" | "T-Mobile USA";
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  isBestSeller?: boolean;
}

const productsList: ProductItem[] = [
  {
    id: "vodafone-uk-official",
    name: "Official Vodafone UK Pay-As-You-Go SIM Card",
    category: "Vodafone UK",
    price: 3500,
    originalPrice: 6000,
    rating: 5.0,
    reviewsCount: 312,
    image: "/vodafone/WhatsApp Image 2026-08-04 at 3.18.06 AM.jpeg",
    description: "Factory sealed physical Vodafone UK SIM. Zero monthly contract. Guaranteed UK OTPs, Wise, Monzo, and PayPal UK accounts.",
    isBestSeller: true,
  },
  {
    id: "tmobile-usa-official",
    name: "Official T-Mobile USA Pay-As-You-Go SIM Card",
    category: "T-Mobile USA",
    price: 10500,
    originalPrice: 16000,
    rating: 4.9,
    reviewsCount: 189,
    image: "/t-mobile/WhatsApp Image 2026-08-04 at 3.28.45 AM.jpeg",
    description: "Genuine T-Mobile USA SIM with full US number (+1). Roaming in 210+ countries. Ideal for PayPal US & US TikTok Live.",
    isBestSeller: true,
  },
  {
    id: "usa-tiktok-rpm-sim",
    name: "USA SIM Card for Only TikTok Audience Target & Increase RPM",
    category: "T-Mobile USA",
    price: 2000,
    originalPrice: 4500,
    rating: 4.9,
    reviewsCount: 214,
    image: "/t-mobile/WhatsApp Image 2026-08-04 at 3.28.44 AM.jpeg",
    description: "Dedicated USA SIM Card designed exclusively for Pakistani TikTokers to unlock USA-only audience targeting, maximize your RPM earnings, and go LIVE on TikTok with a genuine US number (+1). No VPN needed — just insert and start earning higher CPM from US viewers.",
    isBestSeller: true,
  },
];

function ProductsContent() {
  const [products, setProducts] = useState<ProductItem[]>(productsList);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products) {
          setProducts(data.products);
        }
      })
      .catch((err) => console.error("Failed to fetch products:", err));
  }, []);

  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(0);

  // Search state
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  useEffect(() => {
    const s = searchParams.get("search");
    if (s !== null) setSearchQuery(s);
  }, [searchParams]);

  // Global Cart & Wishlist State (shared across the whole site)
  const { addToCart, toggleWishlist, wishlistItems } = useCart();

  const [gridCols, setGridCols] = useState<number>(3);
  const [sortBy, setSortBy] = useState<string>("best-selling");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [inStockOnly, setInStockOnly] = useState<boolean>(true);
  const [bestSellersOnly, setBestSellersOnly] = useState<boolean>(false);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>(20000);
  const [quickViewProduct, setQuickViewProduct] = useState<ProductItem | null>(null);

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setInStockOnly(true);
    setBestSellersOnly(false);
    setSelectedRating(0);
    setPriceMax(20000);
    setSortBy("best-selling");
  };

  const openCheckout = (pkg?: string, price?: number) => {
    if (pkg) setSelectedPkg(pkg);
    if (price) setSelectedPrice(price);
    setModalOpen(true);
  };

  const handleAddToCart = (product: ProductItem) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      carrier: product.category,
    });
  };

  const handleToggleWishlist = (product: ProductItem, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      carrier: product.category,
    });
  };

  const processedProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      if (selectedCategory === "USA TikTok RPM SIM") {
        result = result.filter((p) => p.id === "usa-tiktok-rpm-sim" || p.name.toLowerCase().includes("tiktok"));
      } else {
        result = result.filter((p) => p.category === selectedCategory);
      }
    }

    // Best sellers filter
    if (bestSellersOnly) {
      result = result.filter((p) => p.isBestSeller);
    }

    // Rating filter
    if (selectedRating > 0) {
      result = result.filter((p) => p.rating >= selectedRating);
    }

    // Price max filter
    if (priceMax < 20000) {
      result = result.filter((p) => p.price <= priceMax);
    }

    // Sorting
    if (sortBy === "best-selling") {
      result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    } else if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, searchQuery, selectedCategory, bestSellersOnly, selectedRating, priceMax, sortBy]);

  const gridClass =
    gridCols === 1
      ? "grid-cols-1"
      : gridCols === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <>
      <main className="min-h-screen bg-[#F8FAFC] text-slate-900 pt-28 pb-20 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Workspace Layout: Left Filter Options Sidebar + Right Product Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* ================= LEFT SIDEBAR: FILTER OPTIONS ================= */}
            <aside className="lg:col-span-3 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-6 sticky top-28 font-sans">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#E60000]" />
                  Filter Options
                </h3>
                {(selectedCategory !== "all" || searchQuery || bestSellersOnly || selectedRating > 0 || priceMax < 20000) && (
                  <button
                    onClick={clearAllFilters}
                    className="text-[11px] font-extrabold text-amber-700 hover:text-amber-800 underline cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Clear All
                  </button>
                )}
              </div>

              {/* Search Box */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                  Search Products
                </label>
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3" />
                  <input
                    type="text"
                    placeholder="Search SIM packages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs font-medium focus:outline-none focus:bg-white focus:border-red-600 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* By Categories */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                  By Categories
                </h4>
                <div className="space-y-1">
                  {[
                    { id: "all", label: "All Categories" },
                    { id: "Vodafone UK", label: "Vodafone UK" },
                    { id: "T-Mobile USA", label: "T-Mobile USA" },
                    { id: "USA TikTok RPM SIM", label: "USA SIM Card for Only TikTok" },
                  ].map((cat) => {
                    const count =
                      cat.id === "all"
                        ? products.length
                        : cat.id === "USA TikTok RPM SIM"
                        ? products.filter(p => p.id === "usa-tiktok-rpm-sim" || p.name.toLowerCase().includes("tiktok")).length
                        : products.filter(p => p.category === cat.id).length;
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <div
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`flex items-center justify-between text-xs font-medium px-3 py-2 rounded-xl transition-all cursor-pointer ${
                          isSelected
                            ? "bg-red-50 text-[#E60000] font-extrabold border border-red-200 shadow-2xs"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                            isSelected ? "bg-[#E60000] border-[#E60000] text-white" : "border-slate-300 bg-white"
                          }`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span>{cat.label}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded-full">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    Price Range
                  </h4>
                  <span className="text-xs font-extrabold text-[#E60000] bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                    Rs. 2,000 - Rs. {priceMax.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="20000"
                  step="500"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-[#E60000] cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                  <span>Rs. 2,000</span>
                  <span>Rs. 20,000</span>
                </div>
              </div>

              {/* Review Filter */}
              <div className="space-y-2.5 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                  Review
                </h4>
                <div className="space-y-1">
                  {[
                    { rating: 0, label: "All Ratings" },
                    { rating: 5, label: "5 Star Only" },
                    { rating: 4, label: "4 Star & Above" },
                  ].map((r) => (
                    <div
                      key={r.rating}
                      onClick={() => setSelectedRating(r.rating)}
                      className={`flex items-center justify-between text-xs px-3 py-2 rounded-xl cursor-pointer transition-all ${
                        selectedRating === r.rating ? "bg-amber-50 text-amber-900 font-bold border border-amber-200" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                          selectedRating === r.rating ? "border-amber-500 bg-amber-500" : "border-slate-300"
                        }`}>
                          {selectedRating === r.rating && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span>{r.label}</span>
                      </div>
                      {r.rating > 0 && (
                        <div className="flex items-center text-amber-400">
                          {[...Array(r.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Promotions */}
              <div className="space-y-2.5 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                  By Promotions
                </h4>
                <div
                  onClick={() => setBestSellersOnly(!bestSellersOnly)}
                  className="flex items-center gap-2.5 text-xs text-slate-700 font-semibold cursor-pointer px-1 py-1"
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                    bestSellersOnly ? "bg-[#E60000] border-[#E60000] text-white" : "border-slate-300"
                  }`}>
                    {bestSellersOnly && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>Best Sellers Only</span>
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-2.5 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                  Availability
                </h4>
                <div
                  onClick={() => setInStockOnly(!inStockOnly)}
                  className="flex items-center gap-2.5 text-xs text-slate-700 font-semibold cursor-pointer px-1 py-1"
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                    inStockOnly ? "bg-[#E60000] border-[#E60000] text-white" : "border-slate-300"
                  }`}>
                    {inStockOnly && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>In Stock</span>
                </div>
              </div>
            </aside>

            {/* ================= RIGHT MAIN WORKSPACE ================= */}
            <div className="lg:col-span-9 space-y-6">

              {/* Top Control Bar & Active Filter Pills */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
                  <span>Showing <strong className="text-slate-900 font-extrabold">{processedProducts.length}</strong> of <strong className="text-slate-900 font-extrabold">{products.length}</strong> results</span>

                  {/* Active Filter Pills (matching design in mockup image) */}
                  {selectedCategory !== "all" && (
                    <span className="bg-[#E60000] text-white px-3 py-1 rounded-md text-[11px] font-extrabold flex items-center gap-1.5 shadow-2xs">
                      Category: {selectedCategory}
                      <X className="w-3 h-3 cursor-pointer hover:opacity-80" onClick={() => setSelectedCategory("all")} />
                    </span>
                  )}
                  {bestSellersOnly && (
                    <span className="bg-[#E60000] text-white px-3 py-1 rounded-md text-[11px] font-extrabold flex items-center gap-1.5 shadow-2xs">
                      Best Seller
                      <X className="w-3 h-3 cursor-pointer hover:opacity-80" onClick={() => setBestSellersOnly(false)} />
                    </span>
                  )}
                  {inStockOnly && (
                    <span className="bg-[#E60000] text-white px-3 py-1 rounded-md text-[11px] font-extrabold flex items-center gap-1.5 shadow-2xs">
                      In Stock
                      <X className="w-3 h-3 cursor-pointer hover:opacity-80" onClick={() => setInStockOnly(false)} />
                    </span>
                  )}
                  {priceMax < 20000 && (
                    <span className="bg-[#E60000] text-white px-3 py-1 rounded-md text-[11px] font-extrabold flex items-center gap-1.5 shadow-2xs">
                      Price: ≤ Rs.{priceMax.toLocaleString()}
                      <X className="w-3 h-3 cursor-pointer hover:opacity-80" onClick={() => setPriceMax(20000)} />
                    </span>
                  )}
                  {(selectedCategory !== "all" || bestSellersOnly || priceMax < 20000 || !inStockOnly) && (
                    <button onClick={clearAllFilters} className="text-amber-700 hover:underline font-extrabold text-xs ml-2 cursor-pointer">
                      Clear All
                    </button>
                  )}
                </div>

                {/* Sort dropdown */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-semibold text-slate-500">Sort by :</span>
                  <div className="relative inline-block">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-slate-50 border border-slate-200 text-xs font-extrabold text-slate-800 pr-8 pl-3 py-2 rounded-xl focus:outline-none focus:border-slate-400 cursor-pointer shadow-2xs"
                    >
                      <option value="best-selling">Default Sorting</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Product Cards Grid (3 Columns) */}
              {processedProducts.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-2xs">
                  <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-900 mb-1">No SIM products found</h3>
                  <p className="text-xs text-slate-500 mb-4">
                    No items matched your selected filter options.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="bg-slate-900 text-white text-xs font-bold px-5 py-2.5 rounded-full cursor-pointer hover:bg-black transition-all"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {processedProducts.map((product) => {
                    const isWishlisted = wishlistItems.some((item) => item.id === product.id);
                    const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

                    return (
                      <div
                        key={product.id}
                        className="bg-white border border-slate-200/80 rounded-3xl p-4 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col justify-between group"
                      >
                        <div>
                          {/* Card Image Container */}
                          <div className="relative aspect-square w-full rounded-2xl bg-[#F8FAFC] overflow-hidden mb-3 border border-slate-100 flex items-center justify-center">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />

                            {/* Top-Left Discount Pill Badge (Matches design in mockup image) */}
                            {discountPercent > 0 && (
                              <div className="absolute top-3 left-3 z-10">
                                <span className="bg-[#E60000] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                  {discountPercent}% OFF
                                </span>
                              </div>
                            )}

                            {/* Top-Right Action Floating Icons */}
                            <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                              <button
                                onClick={(e) => handleToggleWishlist(product, e)}
                                title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                                className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-slate-200 flex items-center justify-center text-slate-700 hover:text-red-500 transition-all cursor-pointer"
                              >
                                <Heart
                                  className={`w-4 h-4 transition-colors ${
                                    isWishlisted ? "text-red-600 fill-red-600" : "text-slate-700"
                                  }`}
                                />
                              </button>

                              <button
                                onClick={() => setQuickViewProduct(product)}
                                title="Quick View"
                                className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-slate-200 flex items-center justify-center text-slate-700 hover:text-red-600 transition-colors cursor-pointer"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleAddToCart(product)}
                                title="Quick Add to Cart"
                                className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-slate-200 flex items-center justify-center text-slate-700 hover:text-red-600 transition-colors cursor-pointer"
                              >
                                <ShoppingCart className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Category Subtitle & Rating Pill */}
                          <div className="flex items-center justify-between mb-1.5 text-xs">
                            <span className="text-[11px] font-bold text-slate-400">
                              {product.category}
                            </span>
                            <div className="flex items-center gap-1 text-[11px] font-extrabold text-slate-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span>{product.rating.toFixed(1)}</span>
                            </div>
                          </div>

                          {/* Product Title */}
                          <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug mb-2 line-clamp-2 group-hover:text-[#E60000] transition-colors">
                            {product.name}
                          </h3>

                          {/* Prices */}
                          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold mb-4">
                            <span className="text-[#E60000] font-black text-sm sm:text-base">
                              Rs.{product.price.toLocaleString()}.00
                            </span>
                            <span className="text-slate-400 line-through font-medium text-xs">
                              Rs.{product.originalPrice.toLocaleString()}.00
                            </span>
                          </div>

                          {/* Action Buttons: Add to Cart & Buy Now */}
                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold py-2 px-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-slate-200/80 shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
                            >
                              <ShoppingCart className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                              <span className="truncate">Add to Cart</span>
                            </button>

                            <button
                              onClick={() => openCheckout(product.name, product.price)}
                              className="w-full bg-[#E60000] hover:bg-[#CC0000] text-white text-xs font-extrabold py-2 px-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                            >
                              <Zap className="w-3.5 h-3.5 fill-current shrink-0" />
                              <span className="truncate">Buy Now</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Bottom Pagination Bar (Matches design in mockup image) */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-4 flex items-center justify-center gap-2 font-sans shadow-2xs">
                <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 rounded-full bg-[#E60000] text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                  1
                </button>
                <button className="w-8 h-8 rounded-full border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center hover:bg-slate-50 cursor-pointer">
                  2
                </button>
                <button className="w-8 h-8 rounded-full border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center hover:bg-slate-50 cursor-pointer">
                  3
                </button>
                <span className="text-slate-400 font-bold text-xs">...</span>
                <button className="w-8 h-8 rounded-full border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center hover:bg-slate-50 cursor-pointer">
                  10
                </button>
                <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* QUICK VIEW MODAL */}
      <AnimatePresence>
        {quickViewProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 relative shadow-2xl border border-slate-200"
            >
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-100 mb-4 border border-slate-200">
                <Image
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  fill
                  className="object-cover"
                />
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-2">
                {quickViewProduct.name}
              </h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                {quickViewProduct.description}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Price</span>
                  <span className="text-xl font-bold text-[#E60000]">
                    Rs. {quickViewProduct.price.toLocaleString()}.00
                  </span>
                </div>
                <button
                  onClick={() => {
                    const prod = quickViewProduct;
                    setQuickViewProduct(null);
                    handleAddToCart(prod);
                  }}
                  className="bg-slate-900 hover:bg-black text-white text-xs font-bold px-6 py-3 rounded-full cursor-pointer transition-all shadow-md"
                >
                  Add to Cart
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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

export default function ProductsPage() {
  return (
    <>
      <header>
        <Navbar onOrderClick={() => {}} />
      </header>
      <Suspense fallback={<div className="min-h-screen pt-32 text-center text-xs font-bold">Loading SIM Store...</div>}>
        <ProductsContent />
      </Suspense>
    </>
  );
}
