"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle2, ShieldCheck } from "lucide-react";

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
  const duplicatedPhotos = [...photoReviews, ...photoReviews];

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-[#F1F3F7] text-slate-900 relative overflow-hidden border-y border-slate-200/70 font-sans">
      {/* Decent Soft Radial Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-red-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-14">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          {/* Heading */}
          <h2 className="text-2xl sm:text-4xl md:text-[40px] font-extrabold tracking-tight max-w-3xl mx-auto leading-tight text-[#0F172A] mb-3">
            Customer Delivery &amp; Unboxing Proofs
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-xl mx-auto">
            Real photos sent by Pakistani creators and business owners receiving their official UK &amp; USA SIM cards via Cash on Delivery.
          </p>
        </motion.div>
      </div>

      {/* Large Cards Continuous Marquee Slider */}
      <div className="relative w-full overflow-hidden">
        {/* Fading Side Gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-36 bg-gradient-to-r from-[#F1F3F7] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-36 bg-gradient-to-l from-[#F1F3F7] to-transparent z-20 pointer-events-none" />

        <div className="flex animate-marquee hover:[animation-play-state:paused] whitespace-nowrap py-4">
          {duplicatedPhotos.map((item, idx) => (
            <div
              key={`${item.title}-${idx}`}
              className="inline-block w-[280px] sm:w-[360px] md:w-[400px] mx-3 flex-shrink-0 whitespace-normal"
            >
              <div className="group relative w-full h-[400px] sm:h-[460px] md:h-[500px] bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md transition-all duration-300 hover:shadow-xl hover:border-slate-300">
                {/* Image */}
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  sizes="(max-width: 768px) 360px, 400px"
                />

                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-70 transition-opacity" />

                {/* Top Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md border border-slate-200 px-3 py-1 rounded-full text-[11px] font-extrabold text-slate-900 shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified Delivery</span>
                  </div>
                </div>

                {/* Bottom Content overlay */}
                <div className="absolute bottom-5 left-5 right-5 z-10 text-white space-y-1">
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
        </div>
      </div>
    </section>
  );
}
