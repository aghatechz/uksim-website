"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, ArrowRight } from "lucide-react";

const faqs = [
  {
    num: "01",
    q: "Do I need a VPN to use this SIM card?",
    a: "No VPN is required. This is an original physical SIM card. Simply insert it into your phone and TikTok LIVE and global apps will work automatically.",
  },
  {
    num: "02",
    q: "Will this SIM card work on a Non-PTA mobile phone?",
    a: "Yes! Physical international SIM cards operate on global roaming in Pakistan and work smoothly on non-PTA phones during their valid roaming period.",
  },
  {
    num: "03",
    q: "Do I need to recharge or top-up every month?",
    a: "No monthly contracts or auto-debits required. To keep your SIM active lifetime, you only need to send one SMS or do a small top-up once every 6 months (180 days).",
  },
  {
    num: "04",
    q: "Can I receive OTP verification codes for Wise, PayPal & TikTok?",
    a: "Yes! Since these are genuine UK & USA phone numbers, all UK/US banking, PayPal, Wise, Stripe, Monzo, and TikTok Live verification SMS OTPs arrive 100% instantly.",
  },
  {
    num: "05",
    q: "How does Cash on Delivery (COD) work in Pakistan?",
    a: "We offer Free Cash on Delivery across all major cities in Pakistan. You pay cash to the rider only when your SIM card package arrives at your doorstep (takes 2-3 business days).",
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-16 sm:py-20 md:py-24 bg-[#F4F7FB]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Badge & Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-[44px] font-extrabold text-[#0F172A] tracking-tight leading-[1.18]">
            Frequently Asked Questions
          </h2>
        </motion.div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={faq.num}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className={`bg-white rounded-3xl transition-all duration-300 overflow-hidden border ${
                  isOpen
                    ? "border-red-200 shadow-lg shadow-red-500/5 ring-1 ring-red-100"
                    : "border-transparent shadow-xs hover:border-gray-200"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer"
                >
                  <div className="flex-1 pr-4">
                    <h3 className="text-base md:text-lg font-bold text-[#0F172A] leading-snug">
                      {faq.q}
                    </h3>
                  </div>

                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                      isOpen
                        ? "bg-gray-100 text-gray-800"
                        : "bg-[#0F172A] text-white hover:bg-[#E60000]"
                    }`}
                  >
                    {isOpen ? (
                      <X className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-0 text-sm md:text-base text-gray-600 leading-relaxed font-normal">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom WhatsApp CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-xs md:text-sm font-medium text-gray-500 mb-1">
            Have any other questions?
          </p>
          <a
            href="https://wa.me/923408219725?text=Hi!%20I%20have%20a%20question%20about%20SIM%20cards"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0F172A] hover:text-[#E60000] transition-colors group"
          >
            WhatsApp Support
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
