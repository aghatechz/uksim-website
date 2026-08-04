"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";

const photoReviews = [
  {
    src: "/reviews/WhatsApp Image 2026-08-01 at 10.00.15 AM (1).jpeg",
    title: "Vodafone UK SIM Delivered",
    location: "Karachi, Sindh",
  },
  {
    src: "/reviews/WhatsApp Image 2026-08-01 at 10.00.15 AM.jpeg",
    title: "Customer Unboxing Proof",
    location: "Lahore, Punjab",
  },
  {
    src: "/reviews/WhatsApp Image 2026-08-01 at 10.00.16 AM (1).jpeg",
    title: "T-Mobile USA SIM Package",
    location: "Islamabad, ICT",
  },
  {
    src: "/reviews/WhatsApp Image 2026-08-01 at 10.00.16 AM (2).jpeg",
    title: "Verified Delivery Received",
    location: "Rawalpindi, Punjab",
  },
  {
    src: "/reviews/WhatsApp Image 2026-08-01 at 10.00.16 AM.jpeg",
    title: "Physical Sealed UK SIM",
    location: "Peshawar, KPK",
  },
  {
    src: "/reviews/WhatsApp Image 2026-08-01 at 10.00.17 AM.jpeg",
    title: "TikTok Live Unlocked",
    location: "Multan, Punjab",
  },
  {
    src: "/reviews/WhatsApp Image 2026-08-01 at 10.01.27 AM.jpeg",
    title: "Cash on Delivery Success",
    location: "Rahim Yar Khan",
  },
  {
    src: "/reviews/WhatsApp Image 2026-08-01 at 10.03.28 AM.jpeg",
    title: "Original Vodafone Pack",
    location: "Quetta, Balochistan",
  },
];

export default function PhotoReviews() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragWidth, setDragWidth] = useState(0);

  useEffect(() => {
    const updateDragWidth = () => {
      if (trackRef.current && containerRef.current) {
        const scrollWidth = trackRef.current.scrollWidth;
        const offsetWidth = containerRef.current.offsetWidth;
        setDragWidth(Math.max(0, scrollWidth - offsetWidth));
      }
    };

    updateDragWidth();
    window.addEventListener("resize", updateDragWidth);
    return () => window.removeEventListener("resize", updateDragWidth);
  }, []);

  const handleArrowScroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-[#F1F3F7] text-slate-900 relative overflow-hidden border-y border-slate-200/70 font-sans select-none">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-red-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-8 sm:mb-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center sm:text-left"
          >
            <h2 className="text-2xl sm:text-4xl md:text-[40px] font-extrabold tracking-tight leading-tight text-[#0F172A] mb-2">
              Customer Delivery &amp; Unboxing Proofs
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-xl">
              Real photos sent by Pakistani creators and business owners receiving their official UK &amp; USA SIM cards via Cash on Delivery.
            </p>
          </motion.div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => handleArrowScroll("left")}
              className="w-11 h-11 rounded-2xl bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:bg-slate-900 hover:text-white transition-all cursor-pointer active:scale-95"
              aria-label="Previous Proof"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleArrowScroll("right")}
              className="w-11 h-11 rounded-2xl bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:bg-slate-900 hover:text-white transition-all cursor-pointer active:scale-95"
              aria-label="Next Proof"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Touch Pan / Native Touch Scroll Container */}
      <div className="relative w-full">
        <div
          ref={containerRef}
          className="w-full overflow-x-auto scrollbar-none touch-pan-x scroll-smooth cursor-grab active:cursor-grabbing px-4 sm:px-8 py-4"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <motion.div
            ref={trackRef}
            drag="x"
            dragConstraints={{ left: -dragWidth - 32, right: 0 }}
            dragElastic={0.1}
            className="flex gap-4 sm:gap-6 w-max touch-pan-x"
          >
            {photoReviews.map((item, idx) => (
              <div
                key={`${item.title}-${idx}`}
                className="flex-none w-[280px] sm:w-[340px] md:w-[380px] touch-pan-x"
              >
                <div className="group relative w-full h-[380px] sm:h-[440px] md:h-[480px] bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md transition-all duration-300 hover:shadow-xl hover:border-slate-300 pointer-events-none">
                  {/* Image */}
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out pointer-events-none"
                    sizes="(max-width: 768px) 340px, 380px"
                    draggable={false}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-70 transition-opacity pointer-events-none" />

                  {/* Top Badge */}
                  <div className="absolute top-4 left-4 z-10 pointer-events-none">
                    <div className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md border border-slate-200 px-3 py-1 rounded-full text-[11px] font-extrabold text-slate-900 shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified Delivery</span>
                    </div>
                  </div>

                  {/* Bottom Content overlay */}
                  <div className="absolute bottom-5 left-5 right-5 z-10 text-white space-y-1 pointer-events-none">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-red-600 text-white px-2.5 py-0.5 rounded-md inline-block shadow-xs">
                      {item.location}
                    </span>
                    <h3 className="text-base font-extrabold tracking-tight leading-snug text-white">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
