"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

function getTimeLeft() {
  const now = new Date();
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const diff = Math.max(0, end.getTime() - now.getTime());
  return {
    hours: Math.floor(diff / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default function CountdownPromo({
  onOrderClick,
}: {
  onOrderClick: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setMounted(true);
    setTime(getTimeLeft());
    const interval = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-black text-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-2.png"
          alt="Workspace background"
          fill
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/80 to-black/90" />
      </div>

      {/* Giant Outlined Watermark "Vodafone" */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none select-none overflow-hidden">
        <span
          className="text-[18vw] font-black uppercase text-white/10 tracking-tighter leading-none whitespace-nowrap opacity-40 select-none"
          style={{
            WebkitTextStroke: "2.5px rgba(255, 255, 255, 0.75)",
          }}
        >
          Vodafone
        </span>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Title */}
          <h3 className="text-3xl md:text-5xl font-extrabold text-white mb-10 tracking-tight">
            Offer Ending Soon
          </h3>

          {/* Inline Timer (Matching Reference Image) */}
          <div className="flex items-center justify-center gap-4 md:gap-8 mb-10">
            {[
              { value: mounted ? time.hours : 0, label: "HOURS" },
              { value: mounted ? time.minutes : 0, label: "MINUTES" },
              { value: mounted ? time.seconds : 0, label: "SECONDS" },
            ].map((item, i) => (
              <div key={item.label} className="flex items-center gap-4 md:gap-8">
                <div className="flex flex-col items-center">
                  <span
                    suppressHydrationWarning
                    className="text-4xl md:text-6xl font-bold font-sans text-white tracking-tight leading-none"
                  >
                    {pad(item.value)}
                  </span>
                  <span className="text-[10px] md:text-xs font-semibold text-gray-400 mt-2 tracking-widest uppercase">
                    {item.label}
                  </span>
                </div>

                {i < 2 && (
                  <span className="text-3xl md:text-5xl font-light text-white/50 -mt-5">
                    :
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Solid White CTA Button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOrderClick}
            className="btn-ripple bg-white hover:bg-gray-100 text-[#0F172A] font-extrabold text-sm md:text-base px-10 py-4 rounded-xl shadow-2xl transition-all inline-flex items-center gap-2"
          >
            CLAIM YOUR SIM NOW
            <ArrowRight className="w-4 h-4 text-[#0F172A]" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
