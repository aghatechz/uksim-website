"use client";

import { useState, useEffect, use } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Chatbot from "../../components/Chatbot";
import SalesToast from "../../components/SalesToast";
import CheckoutModal from "../../components/CheckoutModal";
import TiltContainer from "../../components/TiltContainer";
import ParticleCanvas from "../../components/ParticleCanvas";
import { useCart } from "../../components/CartProvider";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import {
  Star,
  Plus,
  Minus,
  Lock,
  ShoppingCart,
  Truck,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Share2,
  Heart,
  Zap,
  Globe,
  Smartphone,
  MessageCircle,
} from "lucide-react";

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

const defaultProducts: ProductItem[] = [
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

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const unwrappedParams = typeof (params as any)?.then === "function" ? use(params as Promise<{ slug: string }>) : (params as { slug: string });
  const rawSlug = unwrappedParams?.slug || "";
  const slug = decodeURIComponent(rawSlug);

  const [products, setProducts] = useState<ProductItem[]>(defaultProducts);
  const [quantity, setQuantity] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [copied, setCopied] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products && data.products.length > 0) {
          setProducts(data.products);
        }
      })
      .catch((err) => console.error("Failed to fetch products:", err));
  }, []);

  // Match product by ID or Slug string
  const normalizedSlug = slug.toLowerCase().trim();
  const product =
    products.find(
      (p) =>
        p.id.toLowerCase() === normalizedSlug ||
        p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === normalizedSlug ||
        (normalizedSlug.length > 3 && p.id.toLowerCase().includes(normalizedSlug)) ||
        (normalizedSlug.length > 3 && normalizedSlug.includes(p.id.toLowerCase()))
    ) ||
    defaultProducts.find(
      (p) =>
        p.id.toLowerCase() === normalizedSlug ||
        p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === normalizedSlug ||
        (normalizedSlug.length > 3 && p.id.toLowerCase().includes(normalizedSlug)) ||
        (normalizedSlug.length > 3 && normalizedSlug.includes(p.id.toLowerCase()))
    );

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-center p-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Product Not Found</h1>
          <p className="text-sm text-slate-500 mb-6">
            The SIM card product you are looking for does not exist or has been moved.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-brand-red text-white text-xs font-extrabold px-6 py-3 rounded-xl hover:bg-brand-red-dark transition-colors shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Products
          </Link>
        </div>
      </div>
    );
  }

  const currentPrice = product.price * quantity;
  const currentOriginal = product.originalPrice * quantity;
  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleOrder = () => {
    setSelectedPkg(`${product.name} (Qty: ${quantity})`);
    setSelectedPrice(currentPrice);
    setModalOpen(true);
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image,
      carrier: product.category,
    });
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: product.category },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "PKR",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating.toString(),
      reviewCount: product.reviewsCount.toString(),
    },
    image: product.image,
  };

  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <>
      <Script
        id="product-detail-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <HeaderWrapper onOrderClick={() => setModalOpen(true)} />

      <main className="min-h-screen bg-[#F8FAFC] pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Nav */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-8">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-slate-900 transition-colors">
              Products
            </Link>
            <span>/</span>
            <span className="text-slate-900 truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </span>
          </nav>

          {/* Product Detail Main Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden mb-16">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 p-6 sm:p-10">
              {/* Left Column (6 Cols) - 3D Tilt Gallery */}
              <div className="lg:col-span-6 flex flex-col items-center">
                <TiltContainer intensity={8} className="w-full">
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-xl group flex items-center justify-center">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority
                    />
                    {product.isBestSeller && (
                      <span className="absolute top-4 left-4 bg-brand-red text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg">
                        🔥 Best Seller
                      </span>
                    )}
                  </div>
                </TiltContainer>

                {/* Micro Features Bar */}
                <div className="grid grid-cols-3 gap-3 w-full mt-6">
                  <div className="bg-slate-50 p-3 rounded-xl text-center border border-slate-100">
                    <Truck className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
                    <span className="text-[11px] font-bold text-slate-700 block">Fast Shipping</span>
                    <span className="text-[9px] text-slate-400">2-3 Business Days</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl text-center border border-slate-100">
                    <ShieldCheck className="w-4 h-4 text-brand-red mx-auto mb-1" />
                    <span className="text-[11px] font-bold text-slate-700 block">100% Genuine</span>
                    <span className="text-[9px] text-slate-400">Official Carrier</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl text-center border border-slate-100">
                    <Zap className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                    <span className="text-[11px] font-bold text-slate-700 block">Instant OTP</span>
                    <span className="text-[9px] text-slate-400">Pre-Activated</span>
                  </div>
                </div>
              </div>

              {/* Right Column (6 Cols) - Product Purchasing Details */}
              <div className="lg:col-span-6 flex flex-col justify-between">
                <div>
                  {/* Category Badge & Share */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-slate-100 text-slate-700 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                      {product.category}
                    </span>
                    <button
                      onClick={handleCopyLink}
                      className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      {copied ? "Link Copied!" : "Share"}
                    </button>
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
                    {product.name}
                  </h1>

                  {/* Rating & Social Proof */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-800">
                      {product.rating} / 5.0
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-semibold text-slate-500">
                      {product.reviewsCount} Customer Reviews
                    </span>
                  </div>

                  {/* Pricing Box */}
                  <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/60 mb-6">
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="text-3xl sm:text-4xl font-black text-brand-red tracking-tight">
                        Rs. {currentPrice.toLocaleString()}
                      </span>
                      <span className="text-base sm:text-lg text-slate-400 line-through font-medium">
                        Rs. {currentOriginal.toLocaleString()}
                      </span>
                      <span className="bg-red-100 text-brand-red text-xs font-black px-2.5 py-1 rounded-md">
                        {discountPercent}% OFF
                      </span>
                    </div>
                    <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Free Cash on Delivery across Pakistan
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 font-normal leading-relaxed mb-6">
                    {product.description}
                  </p>

                  {/* Specs Highlights */}
                  <div className="space-y-2.5 mb-8">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>Pre-activated physical SIM card — ready for immediate use.</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>100% Free Incoming Verification SMS (Bank OTP, Wise, PayPal, TikTok).</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>No monthly contracts or hidden subscription fees.</span>
                    </div>
                  </div>

                  {/* Quantity Selector & Add To Cart */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">
                        Select Quantity
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="inline-flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white">
                          <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center text-sm font-extrabold text-slate-900">
                            {quantity}
                          </span>
                          <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={handleAddToCart}
                          className="flex-1 border-2 border-slate-900 hover:bg-slate-900 hover:text-white text-slate-900 py-3 px-6 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          ADD TO CART
                        </button>
                      </div>
                    </div>

                    {/* Primary Order Button */}
                    <button
                      onClick={handleOrder}
                      className="w-full btn-ripple bg-gradient-to-r from-brand-red to-brand-red-dark hover:from-brand-red-dark hover:to-red-800 text-white py-4 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider shadow-xl shadow-red-500/25 transition-all text-center cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      BUY NOW - CASH ON DELIVERY (Rs. {currentPrice.toLocaleString()})
                    </button>
                  </div>
                </div>

                <div className="text-center pt-4 border-t border-slate-100">
                  <span className="text-xs text-slate-500 font-semibold inline-flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    Pay when you receive your parcel • 100% Risk Free
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products Grid */}
          {relatedProducts.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">
                Other Popular SIM Cards
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/products/${rel.id}`}
                    className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 mb-4">
                      <Image
                        src={rel.image}
                        alt={rel.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                      {rel.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-2 mb-1 group-hover:text-brand-red transition-colors line-clamp-1">
                      {rel.name}
                    </h3>
                    <p className="text-sm font-extrabold text-brand-red">
                      Rs. {rel.price.toLocaleString()}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
      <Chatbot onOrderClick={() => setModalOpen(true)} />
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

function HeaderWrapper({ onOrderClick }: { onOrderClick: () => void }) {
  return (
    <header>
      <Navbar onOrderClick={onOrderClick} />
    </header>
  );
}
