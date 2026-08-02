"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  PhoneCall,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  quickReplies?: string[];
}

const KNOWLEDGE_BASE: { keywords: string[]; answer: string; quickReplies?: string[] }[] = [
  {
    keywords: ["price", "cost", "pkg", "package", "kitnay", "rate", "kitne"],
    answer: "Our Vodafone UK Pay-As-You-Go SIM starts at Rs. 2,500 with FREE Cash on Delivery across Pakistan!\n\n• 1 SIM: Rs. 2,500\n• 2 SIMs Bundle: Rs. 4,800\n• 3 SIMs Value Pack: Rs. 6,900",
    quickReplies: ["Order SIM Now", "Setup TikTok Live", "Talk on WhatsApp"],
  },
  {
    keywords: ["tiktok", "live", "stream", "monetization"],
    answer: "Yes! Our Vodafone UK & T-Mobile USA SIM cards are 100% genuine physical SIMs. Simply insert into your unlocked phone to unblock native TikTok LIVE & monetization options without needing any VPN!",
    quickReplies: ["SIM Packages", "How to Activate", "Talk on WhatsApp"],
  },
  {
    keywords: ["activate", "activation", "chalayein", "chale gi", "setup"],
    answer: "SIM cards are pre-activated! Simply insert the SIM card into your unlocked phone, restart your device, and enable Roaming in your phone settings. It will connect to network automatically.",
    quickReplies: ["Delivery Time", "OTP Verification", "Talk on WhatsApp"],
  },
  {
    keywords: ["delivery", "cod", "pakistan", "shipping", "days", "dino"],
    answer: "We offer FREE Cash on Delivery (COD) all over Pakistan! Orders usually deliver in 2-3 working days in major cities (Karachi, Lahore, Islamabad, Rawalpindi, Peshawar, Multan, etc.).",
    quickReplies: ["Order SIM Now", "SIM Packages", "Talk on WhatsApp"],
  },
  {
    keywords: ["otp", "bank", "paypal", "wise", "stripe", "verification"],
    answer: "Our SIMs receive 100% free incoming SMS OTPs in Pakistan for UK Banking apps, PayPal, Wise, Stripe, Telegram, and WhatsApp verification.",
    quickReplies: ["SIM Packages", "Talk on WhatsApp"],
  },
  {
    keywords: ["whatsapp", "contact", "call", "agent", "human", "number"],
    answer: "You can chat directly with our official customer support on WhatsApp:\n\n📱 +92 340 8219725",
    quickReplies: ["Open WhatsApp"],
  },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: "welcome-1",
    sender: "bot",
    text: "Assalam-o-Alaikum! 👋 Welcome to Vodafone SIM Hub Pakistan. I am your 24/7 Vodafone Virtual Assistant.",
    timestamp: "Just now",
  },
  {
    id: "welcome-2",
    sender: "bot",
    text: "How can I help you today? Pick a quick question below or type your inquiry:",
    timestamp: "Just now",
    quickReplies: [
      "SIM Packages & Prices",
      "TikTok Live Setup",
      "How to Activate SIM",
      "Delivery & COD Info",
      "Talk on WhatsApp",
    ],
  },
];

export default function Chatbot({ onOrderClick }: { onOrderClick?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
    const queryText = (textToSend || input).trim();
    if (!queryText) return;

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    // Process Bot Response
    setTimeout(() => {
      let botResponse = "Thank you for reaching out! For custom inquiries or instant assistance, you can chat with our team on WhatsApp: +92 340 8219725";
      let matchedReplies: string[] | undefined = ["SIM Packages", "Delivery & COD", "Open WhatsApp"];

      const lower = queryText.toLowerCase();

      if (lower.includes("order") || lower.includes("buy")) {
        if (onOrderClick) {
          onOrderClick();
          botResponse = "Opening checkout modal for you! Fill in your delivery address for Cash on Delivery.";
          matchedReplies = undefined;
        }
      } else if (lower.includes("open whatsapp") || lower.includes("talk on whatsapp")) {
        window.open("https://wa.me/923408219725", "_blank");
        botResponse = "Opening WhatsApp chat with +92 340 8219725...";
        matchedReplies = undefined;
      } else {
        const match = KNOWLEDGE_BASE.find((kb) =>
          kb.keywords.some((kw) => lower.includes(kw))
        );
        if (match) {
          botResponse = match.answer;
          matchedReplies = match.quickReplies;
        }
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        quickReplies: matchedReplies,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleQuickReply = (reply: string) => {
    if (reply === "Open WhatsApp" || reply === "Talk on WhatsApp") {
      window.open("https://wa.me/923408219725", "_blank");
      return;
    }
    if (reply === "Order SIM Now") {
      if (onOrderClick) onOrderClick();
      setIsOpen(false);
      return;
    }
    handleSend(reply);
  };

  return (
    <>
      {/* Floating WhatsApp Button (Positioned at bottom-left corner) */}
      <a
        href="https://wa.me/923408219725"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-brand-green hover:scale-110 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 transition-transform group"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp (+92 340 8219725)"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 text-white fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

      {/* Floating Chatbot Trigger Button (At exact bottom-right position where WhatsApp originally was) */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full flex items-center justify-center shadow-xl shadow-red-600/30 transition-all border border-white/20"
        aria-label="Open AI Chatbot"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Bot className="w-7 h-7" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chatbot Dialog Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[380px] h-[520px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#E60000] via-[#CC0000] to-[#990000] text-white p-4 flex items-center justify-between border-b border-red-800 shadow-md">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/25 shadow-inner">
                  <Bot className="w-5 h-5 text-white" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#CC0000] rounded-full shadow-xs" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-sm text-white tracking-tight">Vodafone Virtual Assistant</h3>
                  </div>
                  <p className="text-[11px] font-medium text-red-100/90">Vodafone UK • 24/7 AI Support</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMessages(INITIAL_MESSAGES)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-300 hover:text-white"
                  title="Reset Chat"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-300 hover:text-white"
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/60">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`flex items-start gap-2 max-w-[85%] ${
                      msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${
                        msg.sender === "user"
                          ? "bg-slate-800 text-white"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {msg.sender === "user" ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>

                    <div
                      className={`p-3 rounded-2xl text-xs md:text-sm whitespace-pre-line leading-relaxed shadow-xs ${
                        msg.sender === "user"
                          ? "bg-red-600 text-white rounded-tr-none"
                          : "bg-white text-gray-800 border border-gray-200/80 rounded-tl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>

                  <span className="text-[10px] text-gray-400 mt-1 px-9">
                    {msg.timestamp}
                  </span>

                  {/* Quick Replies Chips */}
                  {msg.quickReplies && msg.quickReplies.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5 pl-9 pr-2">
                      {msg.quickReplies.map((reply) => (
                        <button
                          key={reply}
                          onClick={() => handleQuickReply(reply)}
                          className="text-xs bg-white hover:bg-red-50 hover:text-red-600 text-gray-700 font-medium px-3 py-1.5 rounded-full border border-gray-200 shadow-2xs transition-all flex items-center gap-1 group"
                        >
                          {reply}
                          <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-red-600 transition-colors" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white px-3 py-2 rounded-xl border border-gray-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask about SIMs, price, TikTok..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 bg-gray-100 text-gray-800 text-xs md:text-sm px-3.5 py-2.5 rounded-xl border border-transparent focus:border-red-500 focus:bg-white focus:outline-none transition-all"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="w-10 h-10 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-colors shadow-sm"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Contact Footer */}
            <div className="bg-slate-100 px-3 py-1.5 text-center text-[10px] text-gray-500 flex items-center justify-center gap-1 border-t border-gray-200">
              <PhoneCall className="w-3 h-3 text-green-600" />
              <span>Need human agent? Chat on WhatsApp: +92 340 8219725</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
