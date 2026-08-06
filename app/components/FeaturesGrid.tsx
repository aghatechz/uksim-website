"use client";

import { motion } from "framer-motion";
import { Truck, ShieldCheck, Headphones, Lock } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Fast Shipping",
    desc: "Free delivery across all major cities in Pakistan within 2-3 business days.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Quality",
    desc: "100% genuine, factory-sealed SIM cards sourced directly from official carriers.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "Round-the-clock WhatsApp and phone support for setup, troubleshooting, and queries.",
  },
  {
    icon: Lock,
    title: "Secure Delivery",
    desc: "Tamper-proof packaging with live tracking. Cash on delivery with no hidden fees.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function FeaturesGrid() {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={itemVariants}
              className="group relative overflow-hidden text-center p-6 sm:p-7 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:border-red-200/60 hover:shadow-lg hover:shadow-slate-900/5 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              {/* Bottom Red Ambient Gradient (Fades in on Hover) */}
              <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#E60000]/6 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-b-2xl" />

              {/* Bottom Red Accent Stroke Line */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E60000]/80 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center rounded-b-2xl" />

              <div className="relative z-10">
                <div className="w-12 h-12 mx-auto mb-4 bg-red-50 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-[#E60000] transition-all duration-300 border border-red-100">
                  <f.icon className="w-6 h-6 text-[#E60000] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-base font-extrabold text-[#0F172A] tracking-tight mb-1.5 group-hover:text-[#E60000] transition-colors">
                  {f.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
