"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, ArrowRight } from "lucide-react";

const faqs = [
  {
    num: "01",
    q: "Is SIM ko chalane ke liye VPN ki zaroorat hai?",
    a: "Bilkul nahi. Yeh original physical UK SIM card hai. Bas apne mobile mein insert karein aur TikTok open karein — native LIVE option automatically appear ho jayega.",
  },
  {
    num: "02",
    q: "Kya non–PTA mobile phone mein yeh SIM kaam karegi?",
    a: "Ji haan, physical SIM roaming par PTA block nahi hoti operational period tak. Aap non-PTA phone mein bhi initial period ke liye direct use kar sakte hain.",
  },
  {
    num: "03",
    q: "Kya har mahine balance daalna ya recharge karwana parega?",
    a: "SIM ko active rakhne ke liye har 6 mahine (180 days) mein sirf ek SMS ya small top-up zaroori hota hai taake number lifetime active rahe.",
  },
  {
    num: "04",
    q: "Is SIM se TikTok monetization aur UK OTPs mil jayein ge?",
    a: "Ji haan! Original UK number hai tou sabhi UK banking, PayPal, Wise, Stripe aur TikTok Live/Monetization verification OTPs 100% receive honge.",
  },
  {
    num: "05",
    q: "Delivery ka process aur payment mode kya hai?",
    a: "Pakistan ke tamam shahron mein Cash on Delivery (COD) available hai. Delivery 2-3 working days mein aap ke ghar tak pohnch jaye gi.",
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First FAQ expanded by default like screenshot

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
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <div className="flex items-center gap-5 flex-1 pr-4">
                    <span className="text-sm font-bold text-gray-400">
                      {faq.num}
                    </span>
                    <h3 className="text-base md:text-lg font-bold text-[#0F172A] leading-snug">
                      {faq.q}
                    </h3>
                  </div>

                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                      isOpen
                        ? "bg-gray-100 text-gray-800"
                        : "bg-[#0F172A] text-white hover:bg-brand-red"
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
                      <div className="px-6 pb-6 pt-0 ml-10 text-sm md:text-base text-gray-600 leading-relaxed font-normal">
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
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0F172A] hover:text-brand-red transition-colors group"
          >
            WhatsApp Support
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
