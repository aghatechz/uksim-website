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
              className="card-hover text-center p-6 rounded-2xl bg-surface-light border border-transparent hover:border-gray-200 transition-all"
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-red-50 rounded-xl flex items-center justify-center">
                <f.icon className="w-6 h-6 text-brand-red" />
              </div>
              <h3 className="text-base font-extrabold text-[#0F172A] tracking-tight mb-1.5">
                {f.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
