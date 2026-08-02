"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, CheckCircle2, X } from "lucide-react";

interface Notification {
  name: string;
  city: string;
  product: string;
  timeAgo: string;
  avatarBg: string;
}

const notifications: Notification[] = [
  { name: "Ali R.", city: "Lahore", product: "1x Vodafone UK SIM (COD)", timeAgo: "2 mins ago", avatarBg: "bg-red-600" },
  { name: "Ayesha K.", city: "Karachi", product: "2x Vodafone UK SIM Bundle", timeAgo: "4 mins ago", avatarBg: "bg-red-600" },
  { name: "Shahzaib M.", city: "Islamabad", product: "1x T-Mobile USA SIM", timeAgo: "6 mins ago", avatarBg: "bg-pink-600" },
  { name: "Tariq J.", city: "Rahim Yar Khan", product: "1x Vodafone UK SIM (COD)", timeAgo: "9 mins ago", avatarBg: "bg-red-600" },
  { name: "Usman G.", city: "Rawalpindi", product: "1x Vodafone UK SIM", timeAgo: "11 mins ago", avatarBg: "bg-red-600" },
  { name: "Fatima S.", city: "Multan", product: "1x T-Mobile USA SIM", timeAgo: "14 mins ago", avatarBg: "bg-pink-600" },
  { name: "Mir B.", city: "Quetta (Balochistan)", product: "1x Vodafone UK SIM (COD)", timeAgo: "17 mins ago", avatarBg: "bg-red-600" },
  { name: "Bilal K.", city: "Peshawar", product: "3x Vodafone Value Pack", timeAgo: "19 mins ago", avatarBg: "bg-red-600" },
  { name: "Zainab A.", city: "Faisalabad", product: "2x Vodafone UK SIM Bundle", timeAgo: "21 mins ago", avatarBg: "bg-red-600" },
  { name: "Haris M.", city: "Sialkot", product: "1x T-Mobile USA SIM", timeAgo: "24 mins ago", avatarBg: "bg-pink-600" },
  { name: "Maryam S.", city: "Hyderabad", product: "1x Vodafone UK SIM (COD)", timeAgo: "27 mins ago", avatarBg: "bg-red-600" },
  { name: "Waqas W.", city: "Gujranwala", product: "1x Vodafone UK SIM", timeAgo: "30 mins ago", avatarBg: "bg-red-600" },
  { name: "Adnan S.", city: "Sukkur", product: "1x T-Mobile USA SIM", timeAgo: "33 mins ago", avatarBg: "bg-pink-600" },
  { name: "Noman A.", city: "Abbottabad", product: "2x Vodafone UK SIM Bundle", timeAgo: "36 mins ago", avatarBg: "bg-red-600" },
  { name: "Kashif T.", city: "Thatta", product: "1x Vodafone UK SIM (COD)", timeAgo: "39 mins ago", avatarBg: "bg-red-600" },
  { name: "Hassan R.", city: "Mardan", product: "1x T-Mobile USA SIM", timeAgo: "42 mins ago", avatarBg: "bg-pink-600" },
  { name: "Sana U.", city: "Bahawalpur", product: "1x Vodafone UK SIM", timeAgo: "45 mins ago", avatarBg: "bg-red-600" },
  { name: "Hamza B.", city: "Sargodha", product: "3x Vodafone Value Pack", timeAgo: "48 mins ago", avatarBg: "bg-red-600" },
  { name: "Saad I.", city: "Larkana", product: "1x Vodafone UK SIM (COD)", timeAgo: "51 mins ago", avatarBg: "bg-red-600" },
  { name: "Farhan A.", city: "Sheikhupura", product: "1x T-Mobile USA SIM", timeAgo: "54 mins ago", avatarBg: "bg-pink-600" },
  { name: "Rehan K.", city: "Jhelum", product: "1x Vodafone UK SIM", timeAgo: "57 mins ago", avatarBg: "bg-red-600" },
  { name: "Shoaib P.", city: "Gujrat", product: "2x Vodafone UK SIM Bundle", timeAgo: "1 hour ago", avatarBg: "bg-red-600" },
  { name: "Zubair M.", city: "Sahiwal", product: "1x T-Mobile USA SIM", timeAgo: "1 hour ago", avatarBg: "bg-pink-600" },
  { name: "Ahsan T.", city: "Kasur", product: "1x Vodafone UK SIM (COD)", timeAgo: "1 hour ago", avatarBg: "bg-red-600" },
  { name: "Nabeel Q.", city: "Dera Ghazi Khan", product: "1x Vodafone UK SIM", timeAgo: "1 hour ago", avatarBg: "bg-red-600" },
];

export default function SalesToast() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    // Initial popup after 6 seconds
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 6000);

    return () => clearTimeout(initialTimer);
  }, [isDismissed]);

  useEffect(() => {
    if (isDismissed) return;

    if (isVisible) {
      // Hide after 5 seconds
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);

      return () => clearTimeout(hideTimer);
    } else {
      // Show next notification sequentially after 1 minute (60,000ms)
      const showTimer = setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % notifications.length);
        setIsVisible(true);
      }, 60000);

      return () => clearTimeout(showTimer);
    }
  }, [isVisible, isDismissed]);

  if (isDismissed) return null;

  const item = notifications[currentIdx];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.9 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-20 left-4 sm:left-6 z-40 max-w-[320px] sm:max-w-[360px] bg-white text-gray-900 border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.12)] rounded-2xl p-3.5 flex items-center gap-3.5 overflow-hidden"
        >
          {/* Avatar Icon */}
          <div
            className={`w-11 h-11 rounded-xl ${item.avatarBg} flex items-center justify-center text-white flex-shrink-0 shadow-md`}
          >
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>

          {/* Toast Details */}
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mb-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>Verified Purchase &bull; {item.timeAgo}</span>
            </div>
            <p className="text-xs font-extrabold text-[#0F172A] truncate">
              {item.name} <span className="font-medium text-gray-500">from {item.city}</span>
            </p>
            <p className="text-[11px] text-[#E60000] font-extrabold truncate mt-0.5">
              Purchased {item.product}
            </p>
          </div>

          {/* Dismiss Button */}
          <button
            onClick={() => setIsDismissed(true)}
            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
