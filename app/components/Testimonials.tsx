"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const reviews = [
  {
    name: "AYESHA KHAN",
    location: "KARACHI",
    text: "Giffgaff aur baki SIMs try ki thin lekin Vodafone UK SIM se TikTok Live baghair kisi lag ya VPN ke direct phone mein chalti hai. Delivery bhi 2 din mein Karachi agayi!",
    image: "/testimonals%20ppic/1st.png",
    verified: "VERIFIED CUSTOMER",
  },
  {
    name: "HAMZA MALIK",
    location: "LAHORE",
    text: "UK bank account aur PayPal verification ke liye OTP milna bohot bara masla tha. Is SIM ko insert karte hi international SMS instant receive hone lag gaye. Best decision!",
    image: "/testimonals%20ppic/2nd.png",
    verified: "VERIFIED CUSTOMER",
  },
  {
    name: "SHAHZAIB RAZA",
    location: "ISLAMABAD",
    text: "Cash on delivery par order kiya tha, package check karke payment ki. TikTok pe Live streaming option instantly unlock ho gaya. Zero monthly bills!",
    image: "/testimonals%20ppic/3rd.png",
    verified: "VERIFIED CUSTOMER",
  },
  {
    name: "TARIQ JAMEEL",
    location: "RAHIM YAR KHAN",
    text: "Rahim Yar Khan mein 2 din me parcel mil gaya. Wise aur Telegram activation code foran agaya. Highly recommended service!",
    image: "/testimonals%20ppic/4rth.png",
    verified: "VERIFIED CUSTOMER",
  },
  {
    name: "FATIMA SULTAN",
    location: "THATTA",
    text: "Thatta jaise small city me bhi Cash on delivery delivery mili. Physical original UK SIM bilkul new sealed thi.",
    image: "/testimonals%20ppic/5th.png",
    verified: "VERIFIED CUSTOMER",
  },
  {
    name: "MIR BALOCH",
    location: "QUETTA (BALOCHISTAN)",
    text: "Balochistan Quetta me fast delivery hui. SIM insert karte hi Vodafone network signal agaye. TikTok Live smooth chal raha hai.",
    image: "/testimonals%20ppic/6th.png",
    verified: "VERIFIED CUSTOMER",
  },
  {
    name: "USMAN GHAFI",
    location: "RAWALPINDI",
    text: "WhatsApp support bohot cooperative hai. Activation guide step-by-step samjhaya. 100% original SIM card!",
    image: "/testimonals%20ppic/7th.png",
    verified: "VERIFIED CUSTOMER",
  },
  {
    name: "BILAL KHAN",
    location: "PESHAWAR",
    text: "Peshawar me delivery just 48 hours me hui. Stripe verification and UK bank OTP bilkul smooth working hain.",
    image: "/testimonals%20ppic/8th.png",
    verified: "VERIFIED CUSTOMER",
  },
  {
    name: "SAAD AHMED",
    location: "MULTAN",
    text: "Multan me Cash on Delivery mil gaya. T-Mobile US SIM se US region content upload ho raha hai effortlessly.",
    image: "/testimonals%20ppic/9th.png",
    verified: "VERIFIED CUSTOMER",
  },
  {
    name: "ZAINAB ALI",
    location: "FAISALABAD",
    text: "E-commerce agency ke liye 3 SIMs order ki thin. Teeno pre-activated receive hui. Fantastic experience!",
    image: "/testimonals%20ppic/10th.png",
    verified: "VERIFIED CUSTOMER",
  },
  {
    name: "HARIS MEHMOOD",
    location: "SIALKOT",
    text: "Sialkot exporters ke liye Amazon UK & PayPal verification issue resolve ho gaya. Very authentic provider.",
    image: "/testimonals%20ppic/11th.png",
    verified: "VERIFIED CUSTOMER",
  },
  {
    name: "MARYAM SHAH",
    location: "HYDERABAD",
    text: "Hyderabad me rider ne parcel pehle check karwaya phr payment li. Trustworthy team & genuine original SIMs.",
    image: "/testimonals%20ppic/12th.png",
    verified: "VERIFIED CUSTOMER",
  },
  {
    name: "WAQAS WARSIS",
    location: "GUJRANWALA",
    text: "TikTok Live monetization button activate ho gaya bilkul asani se. Zero VPN hassle. Best investment!",
    image: "/testimonals%20ppic/13th.png",
    verified: "VERIFIED CUSTOMER",
  },
  {
    name: "ADNAN SHAIKH",
    location: "SUKKUR",
    text: "Sukkur me 2 days delivery complete. Vodafone UK SIM roaming automatically detect kar leti hai.",
    image: "/testimonals%20ppic/14th.png",
    verified: "VERIFIED CUSTOMER",
  },
  {
    name: "NOMAN ABBASI",
    location: "ABBOTTABAD",
    text: "Abbottabad me parcel safe and sound mil gaya. Free incoming SMS for OTPs is completely free forever!",
    image: "/testimonals%20ppic/15th.png",
    verified: "VERIFIED CUSTOMER",
  },
  {
    name: "KAMRAN AKMAL",
    location: "MIRPUR (AJK)",
    text: "Mirpur Azad Kashmir me Cash on Delivery mili. Vodafone UK SIM pe signal coverage and OTP verification 100% working hai.",
    image: "/testimonals%20ppic/16th.png",
    verified: "VERIFIED CUSTOMER",
  },
  {
    name: "SANA JAVED",
    location: "SARGODHA",
    text: "Sargodha me 2 din me parcel receive ho gaya. TikTok Live target audience option unlocked successfully!",
    image: "/testimonals%20ppic/17th.png",
    verified: "VERIFIED CUSTOMER",
  },
  {
    name: "OMAIR RIZVI",
    location: "LARKANA",
    text: "Larkana me COD par order recieve hua. Wise and PayPal activation code instant mil gaya.",
    image: "/testimonals%20ppic/18th.png",
    verified: "VERIFIED CUSTOMER",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-rotate every 2 seconds (2000ms)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % reviews.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % reviews.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const activeReview = reviews[current];

  return (
    <section id="reviews" className="py-16 sm:py-20 md:py-24 bg-[#F8FAFC] border-t border-slate-200/60 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-[44px] font-extrabold text-[#0F172A] tracking-tight leading-[1.18] max-w-2xl mx-auto">
            Loved by 10,000+ Pakistani
            <br />
            Creators
          </h2>
        </div>

        {/* Testimonial Carousel Container */}
        <div
          className="relative max-w-2xl mx-auto flex items-center justify-center"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Left Arrow Button */}
          <button
            onClick={prevSlide}
            className="absolute left-0 -ml-3 sm:-ml-8 md:-ml-12 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white shadow-md border border-slate-200/70 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:scale-105 transition-all"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={nextSlide}
            className="absolute right-0 -mr-3 sm:-mr-8 md:-mr-12 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white shadow-md border border-slate-200/70 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:scale-105 transition-all"
            aria-label="Next review"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Main Card Viewport */}
          <div className="w-full relative min-h-[340px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="relative z-20 bg-white rounded-[32px] p-8 sm:p-12 md:p-14 text-center shadow-[0_25px_60px_-15px_rgba(0,0,0,0.06)] border border-slate-100"
              >
                {/* Floating Profile Avatar Over Top Border */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                  <div className="w-20 h-20 rounded-full p-0.5 bg-white border-2 border-[#E60000] shadow-[0_0_20px_rgba(230,0,0,0.35)] overflow-hidden">
                    <img
                      src={activeReview.image}
                      alt={activeReview.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>

                {/* Double Quote Mark Icon */}
                <div className="mt-3 mb-2 flex justify-center">
                  <span className="text-[#E60000]/25 text-3xl font-serif leading-none select-none">
                    &ldquo;&ldquo;
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-base sm:text-lg font-medium text-slate-700 leading-relaxed mb-8 max-w-xl mx-auto px-2">
                  &ldquo;{activeReview.text}&rdquo;
                </p>

                {/* Reviewer Name */}
                <h3 className="text-sm sm:text-base font-extrabold text-[#0F172A] tracking-wider uppercase mb-1.5">
                  {activeReview.name}
                </h3>

                {/* Verified Customer Badge */}
                <div className="inline-flex items-center justify-center gap-1.5 text-[11px] font-extrabold text-[#E60000] tracking-widest uppercase">
                  {/* Scalloped Red Verified Badge SVG */}
                  <svg viewBox="0 0 512 512" className="w-4 h-4 flex-shrink-0">
                    <path
                      fill="#E60000"
                      d="M512 256c0 30.1-13.6 57-35 75.1 7.2 28.7 1 59.8-17.1 82.2s-46.6 33-75.3 28.6c-18.1 21.4-45 35-75.1 35s-57-13.6-75.1-35c-28.7 4.4-57.2-6.2-75.3-28.6s-24.3-53.5-17.1-82.2c-21.4-18.1-35-45-35-75.1s13.6-57 35-75.1c-7.2-28.7-1-59.8 17.1-82.2s46.6-33 75.3-28.6c18.1-21.4 45-35 75.1-35s57 13.6 75.1 35c28.7-4.4 57.2 6.2 75.3 28.6s24.3 53.5 17.1 82.2c21.4 18.1 35 45 35 75.1z"
                    />
                    <path
                      fill="#FFFFFF"
                      d="M370.7 186.7c7.8 7.8 7.8 20.5 0 28.3l-144 144c-7.8 7.8-20.5 7.8-28.3 0l-72-72c-7.8-7.8-7.8-20.5 0-28.3s20.5-7.8 28.3 0l57.9 57.9 129.9-129.9c7.8-7.8 20.5-7.8 28.2 0z"
                    />
                  </svg>
                  <span>
                    {activeReview.location} &bull; {activeReview.verified}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Stacked Card Layer Effect Behind Main Card */}
            <div className="absolute inset-x-4 sm:inset-x-6 bottom-0 top-10 bg-white/60 rounded-[32px] scale-[0.96] translate-y-3 blur-[0.5px] border border-slate-100 -z-10 shadow-2xs" />
          </div>
        </div>

        {/* Pagination Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-8 max-w-md mx-auto">
          {reviews.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`transition-all duration-300 rounded-full ${
                current === idx
                  ? "w-6 h-2 bg-[#E60000]"
                  : "w-2 h-2 bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
