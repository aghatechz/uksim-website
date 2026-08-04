"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MessageCircle, Shield, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const slides = [
  "/hero/2836146903_d58d601414_b.jpg",
  "/hero/Iarchitects Web Gambling Gacor.jpg",
  "/hero/images.jpg",
];

const productTitles = [
  {
    name: "Vodafone UK",
    colorClass: "gradient-text",
  },
  {
    name: "T-Mobile USA",
    colorClass: "gradient-text-magenta",
  },
  {
    name: "USA TikTok RPM",
    colorClass: "bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent",
  },
];

export default function Hero({ onOrderClick }: { onOrderClick: () => void }) {
  const [current, setCurrent] = useState(0);
  const [productIndex, setProductIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 3000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  useEffect(() => {
    const productTimer = setInterval(() => {
      setProductIndex((prev) => (prev + 1) % productTitles.length);
    }, 2800);
    return () => clearInterval(productTimer);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-[650px] md:min-h-[720px] pt-32 md:pt-40 pb-20 flex items-center justify-center overflow-hidden"
    >
      {/* Background Slideshow */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={slides[current]}
            alt="SIM Card Hero Background"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80 z-10" />

      {/* Content */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Original Font Style Animated Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
            <span>Get Your </span>
            <span className="inline-block relative overflow-hidden align-bottom h-[1.2em] min-w-[210px] sm:min-w-[300px] md:min-w-[360px]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={productTitles[productIndex].name}
                  initial={{ y: 35, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -35, opacity: 0 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className={`inline-block font-bold ${productTitles[productIndex].colorClass}`}
                >
                  {productTitles[productIndex].name}
                </motion.span>
              </AnimatePresence>
            </span>
            <br />
            <span>SIM Card in Pakistan</span>
          </h1>

          {/* Subheading */}
          <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto mb-8 leading-relaxed">
            Enjoy hassle-free UK &amp; USA mobile access for banking, OTP verification,
            TikTok Live streaming, and global connectivity. Cash on delivery
            across Pakistan.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="btn-ripple bg-brand-red hover:bg-brand-red-dark text-white px-8 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 shadow-lg shadow-red-500/25 flex items-center gap-2 cursor-pointer"
              >
                View Products &amp; Order
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>

            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href="https://wa.me/923408219725?text=Hi!%20I%20want%20to%20order%20a%20SIM%20card"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white px-8 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Order via WhatsApp
            </motion.a>
          </div>

          {/* Trust Badges */}
          <div className="mt-10 flex items-center justify-center gap-6 text-white/50 text-xs">
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4" />
              Free Shipping
            </span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              100% Genuine
            </span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span>10,000+ Sold</span>
          </div>
        </motion.div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 z-20 flex items-center gap-2 left-1/2 -translate-x-1/2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current
                ? "w-8 bg-brand-red"
                : "w-3 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
