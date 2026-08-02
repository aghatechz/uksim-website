"use client";

import { useState, useEffect, useMemo } from "react";
import { Order } from "../../../lib/ordersStore";
import { ProductItem } from "../../../lib/productsStore";
import {
  Package,
  Search,
  RefreshCw,
  MessageCircle,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Filter,
  DollarSign,
  Phone,
  MapPin,
  Trash2,
  Lock,
  ArrowRight,
  ShieldCheck,
  LayoutDashboard,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  Wifi,
  BarChart3,
  TrendingUp,
  ChevronRight,
  ChevronLeft,
  Copy,
  Check,
  Bell,
  Sparkles,
  ArrowUpRight,
  HelpCircle,
  Plus,
  Download,
  Calendar,
  Mail,
  Video,
  Play,
  Pause,
  Square,
  Globe,
  Smartphone,
  Layers,
  Edit3,
  Tag,
  Star,
  Eye,
  Printer,
  FileText,
  Flame,
  Trophy,
  Award,
  Zap,
  BarChart2,
  Info,
  X,
  Volume2,
  VolumeX,
  CheckCheck,
  Sun,
  Moon,
  Upload,
  PackageCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface AdminNotif {
  id: string;
  orderId: string;
  customerName: string;
  packageName: string;
  amount: number;
  city: string;
  timestamp: string;
  read: boolean;
}

export default function AdminOrdersDashboard() {
  // Admin Authentication & Forgot Password OTP State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "forgot" | "otp_verify" | "reset_password">("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Dark / Light Theme Mode Toggle State
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("vodafone_admin_theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
    }
    const savedAuth = localStorage.getItem("vodafone_admin_auth");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
    const savedProfile = localStorage.getItem("vodafone_admin_profile_data");
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        if (parsed.name) setProfileName(parsed.name);
        if (parsed.title) setProfileTitle(parsed.title);
        if (parsed.phone) setProfilePhone(parsed.phone);
        if (parsed.location) setProfileLocation(parsed.location);
        if (parsed.avatarUrl !== undefined) setProfileAvatarUrl(parsed.avatarUrl);
        if (parsed.coverUrl !== undefined) setProfileCoverUrl(parsed.coverUrl);
      } catch (err) {}
    }

    // Dynamic Browser & OS Session Detection
    if (typeof window !== "undefined") {
      const ua = navigator.userAgent;
      let deviceName = "Web Browser on Desktop";
      if (ua.includes("Windows")) deviceName = "Chrome on Windows 11 PC";
      else if (ua.includes("Macintosh")) deviceName = "Safari on macOS";
      else if (ua.includes("iPhone")) deviceName = "Safari on iPhone 15 Pro";
      else if (ua.includes("Android")) deviceName = "Chrome on Android Device";

      const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      setSessionLogs([
        {
          id: "sess-1",
          device: deviceName,
          ip: "127.0.0.1 • Karachi, Pakistan",
          time: `Active Session (Started at ${nowTime})`,
          current: true,
        },
        {
          id: "sess-2",
          device: "Safari on iPhone 15 Pro",
          ip: "182.188.42.19 • Mobile Network",
          time: "Logged Out (2h ago)",
          current: false,
        },
      ]);
    }
  }, []);

  const toggleThemeMode = () => {
    setIsDarkMode((prev) => {
      const nextMode = !prev;
      localStorage.setItem("vodafone_admin_theme", nextMode ? "dark" : "light");
      return nextMode;
    });
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");
    setAuthLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          email: loginEmail,
          password: loginPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("vodafone_admin_auth", "true");
        setIsAuthenticated(true);
        setLoginPassword("");
      } else {
        setAuthError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setAuthError("Failed to connect to authentication server");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleForgotPasswordRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");
    setAuthLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "forgot-password",
          email: loginEmail,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAuthSuccess(data.message);
        setAuthMode("otp_verify");
      } else {
        setAuthError(data.message || "Failed to send reset OTP");
      }
    } catch (err) {
      setAuthError("Server communication error");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");
    setAuthLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify-otp",
          email: loginEmail,
          otp: otpCode,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAuthSuccess("OTP Verified! Enter your new password below.");
        setAuthMode("reset_password");
      } else {
        setAuthError(data.message || "Invalid OTP code");
      }
    } catch (err) {
      setAuthError("Verification error");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");

    if (newPassword !== confirmPassword) {
      setAuthError("Passwords do not match!");
      return;
    }

    setAuthLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset-password",
          email: loginEmail,
          otp: otpCode,
          newPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAuthSuccess("Password reset successful! Please log in with your new password.");
        setAuthMode("login");
        setLoginPassword("");
        setOtpCode("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setAuthError(data.message || "Failed to reset password");
      }
    } catch (err) {
      setAuthError("Password reset failed");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("vodafone_admin_auth");
    setIsAuthenticated(false);
  };

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"dashboard" | "orders" | "pending" | "dispatched" | "delivered" | "catalog" | "whatsapp" | "profile" | "settings">("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeAnalyticsDay, setActiveAnalyticsDay] = useState<number>(2);

  // Profile & Settings State
  const [profileName, setProfileName] = useState("Agha Irtiza Hussain Rizvi");
  const [profilePhone, setProfilePhone] = useState("+92 300 1234567");
  const [profileLocation, setProfileLocation] = useState("Vodafone Hub, Main Shahrah-e-Faisal, Karachi");
  const [profileTitle, setProfileTitle] = useState("Executive Administrator & Regional Director");
  const [profileAvatarUrl, setProfileAvatarUrl] = useState("");
  const [profileCoverUrl, setProfileCoverUrl] = useState("red_gradient"); // "red_gradient" | "dark_mesh" | "cyber_dots" | base64
  const [profileInfoSuccess, setProfileInfoSuccess] = useState("");

  // Dynamic Active Session Logs State
  const [sessionLogs, setSessionLogs] = useState<Array<{ id: string; device: string; ip: string; time: string; current: boolean }>>([]);

  // OTP Verification Modal State
  const [profileOtpModalOpen, setProfileOtpModalOpen] = useState(false);
  const [profileOtpCode, setProfileOtpCode] = useState("");
  const [profileOtpLoading, setProfileOtpLoading] = useState(false);
  const [profileOtpMessage, setProfileOtpMessage] = useState("");

  const [settingsSubTab, setSettingsSubTab] = useState<"general" | "alerts" | "backup">("general");
  const [supportPhone, setSupportPhone] = useState("+92 300 1234567");
  const [toastDuration, setToastDuration] = useState("5");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [settingsToast, setSettingsToast] = useState("");

  // Canvas Image Compression Helper (Ensures fast load & prevents localStorage quota errors)
  const compressAndSetImage = (
    file: File,
    maxWidth: number,
    maxHeight: number,
    callback: (base64: string) => void
  ) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.88);
          callback(compressedBase64);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // File Upload Handlers for Local Avatar & Banner Cover
  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      compressAndSetImage(file, 400, 400, (base64) => {
        setProfileAvatarUrl(base64);
        setProfileInfoSuccess("Avatar photo uploaded & optimized! Click 'Save Profile Details & Branding' to persist.");
      });
    }
  };

  const handleCoverFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      compressAndSetImage(file, 1600, 800, (base64) => {
        setProfileCoverUrl(base64);
        setProfileInfoSuccess("Banner cover photo uploaded & optimized! Click 'Save Profile Details & Branding' to persist.");
      });
    }
  };

  // Profile Save Handler
  const handleSaveProfileInfo = (e: React.FormEvent) => {
    e.preventDefault();
    const profileData = {
      name: profileName,
      title: profileTitle,
      phone: profilePhone,
      location: profileLocation,
      avatarUrl: profileAvatarUrl,
      coverUrl: profileCoverUrl,
    };
    localStorage.setItem("vodafone_admin_profile_data", JSON.stringify(profileData));
    setProfileInfoSuccess("Administrator profile details & uploaded photos saved dynamically!");
    setTimeout(() => setProfileInfoSuccess(""), 4000);
  };

  // Request Security OTP for Password Change
  const handleRequestProfileOtp = async () => {
    setProfileOtpLoading(true);
    setProfileOtpMessage("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "forgot",
          email: "agha.irtiza.rizvi@gmail.com",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProfileOtpMessage(`Security OTP code sent to agha.irtiza.rizvi@gmail.com! Please check your inbox.`);
        setProfileOtpModalOpen(true);
      } else {
        setProfileUpdateStatus({ type: "error", message: data.message || "Failed to send OTP." });
      }
    } catch (err) {
      setProfileUpdateStatus({ type: "error", message: "Network error requesting OTP." });
    } finally {
      setProfileOtpLoading(false);
    }
  };

  // Verify OTP and Save Password
  const handleVerifyOtpAndUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileOtpLoading(true);
    setProfileOtpMessage("");

    if (profileNewPass !== profileConfirmPass) {
      setProfileOtpMessage("New passwords do not match.");
      setProfileOtpLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset-password",
          email: "agha.irtiza.rizvi@gmail.com",
          otp: profileOtpCode,
          newPassword: profileNewPass,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProfileUpdateStatus({ type: "success", message: "Password updated successfully with 2FA OTP verification!" });
        setProfileOtpModalOpen(false);
        setProfileOtpCode("");
        setProfileNewPass("");
        setProfileConfirmPass("");
      } else {
        setProfileOtpMessage(data.message || "Invalid or expired OTP verification code.");
      }
    } catch (err) {
      setProfileOtpMessage("Failed to verify OTP.");
    } finally {
      setProfileOtpLoading(false);
    }
  };

  // Profile Password Update State
  const [profileCurrentPass, setProfileCurrentPass] = useState("");
  const [profileNewPass, setProfileNewPass] = useState("");
  const [profileConfirmPass, setProfileConfirmPass] = useState("");
  const [profileUpdating, setProfileUpdating] = useState(false);
  const [profileUpdateStatus, setProfileUpdateStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleProfilePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileUpdateStatus(null);

    if (!profileCurrentPass) {
      setProfileUpdateStatus({ type: "error", message: "Please enter your current admin password." });
      return;
    }

    if (profileNewPass !== profileConfirmPass) {
      setProfileUpdateStatus({ type: "error", message: "New passwords do not match." });
      return;
    }

    setProfileUpdating(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update-profile-password",
          email: "agha.irtiza.rizvi@gmail.com",
          currentPassword: profileCurrentPass,
          newPassword: profileNewPass,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProfileUpdateStatus({ type: "success", message: "Password updated successfully!" });
        setProfileCurrentPass("");
        setProfileNewPass("");
        setProfileConfirmPass("");
      } else {
        setProfileUpdateStatus({ type: "error", message: data.message || "Failed to update password." });
      }
    } catch (err) {
      setProfileUpdateStatus({ type: "error", message: "Network error updating password." });
    } finally {
      setProfileUpdating(false);
    }
  };

  // WhatsApp Console State
  const [waSelectedOrderId, setWaSelectedOrderId] = useState<string | null>(null);
  const [waPhoneNumber, setWaPhoneNumber] = useState("03001234567");
  const [waCustomerName, setWaCustomerName] = useState("Valued Customer");
  const [waMessageType, setWaMessageType] = useState<"confirmation" | "dispatch" | "delivery" | "custom">("confirmation");
  const [waCustomText, setWaCustomText] = useState("");
  const [waSearchQuery, setWaSearchQuery] = useState("");
  const [waCopied, setWaCopied] = useState(false);

  const waSelectedOrder = useMemo(
    () => orders.find((o) => o.id === waSelectedOrderId) || orders[0] || null,
    [orders, waSelectedOrderId]
  );

  useEffect(() => {
    if (waSelectedOrder) {
      setWaPhoneNumber(waSelectedOrder.phone);
      setWaCustomerName(waSelectedOrder.customerName);
    }
  }, [waSelectedOrder]);

  const waGeneratedMessage = useMemo(() => {
    if (waMessageType === "custom") return waCustomText;

    const name = waCustomerName || waSelectedOrder?.customerName || "Customer";
    const orderId = waSelectedOrder?.id || "VOD-849201";
    const amount = waSelectedOrder?.totalAmount ? `Rs. ${waSelectedOrder.totalAmount.toLocaleString()}` : "Rs. 3,500";
    const city = waSelectedOrder?.city || "Pakistan";
    const address = waSelectedOrder?.address || "your delivery address";
    const pkgName = waSelectedOrder?.items?.[0]?.name || "Vodafone UK SIM Card";

    if (waMessageType === "confirmation") {
      return `Hi ${name}! 📦 Your Vodafone SIM Order #${orderId} has been confirmed.\n\n📍 Delivery Address: ${address}, ${city}\n📦 Package: ${pkgName}\n💰 Total COD Amount: ${amount}\n\nWe are preparing your SIM package for immediate dispatch. Thank you for choosing Vodafone UK!`;
    }

    if (waMessageType === "dispatch") {
      return `Hi ${name}! 🚚 Great news! Your Vodafone SIM Order #${orderId} has been dispatched via courier to ${city}.\n\n📦 Package: ${pkgName}\n💰 COD Amount to Pay: ${amount}\n\nPlease keep exact cash ready for the courier rider. Track order online on our website!`;
    }

    if (waMessageType === "delivery") {
      return `Hi ${name}! ✅ Your Vodafone SIM Order #${orderId} has been successfully delivered!\n\nThank you for shopping with Vodafone UK Pakistan. If you need any assistance with SIM activation or OTPs, reply to this chat anytime.`;
    }

    return waCustomText;
  }, [waMessageType, waCustomText, waCustomerName, waSelectedOrder]);

  const handleLaunchWhatsApp = () => {
    const cleanPhone = waPhoneNumber.replace(/\D/g, "").replace(/^0/, "92");
    const encodedText = encodeURIComponent(waMessageType === "custom" ? waCustomText : waGeneratedMessage);
    const url = `https://wa.me/${cleanPhone}?text=${encodedText}`;
    window.open(url, "_blank");
  };

  // Selected Order for Invoice / Details Modal
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Products State
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [productLoading, setProductLoading] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Ranking & Analytics Filter state
  const [rankFilter, setRankFilter] = useState<"all" | "sales" | "demand">("all");
  const [selectedAnalyticsProductId, setSelectedAnalyticsProductId] = useState<string | null>(null);

  // Executive Custom Confirmation / Alert Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type?: "danger" | "info" | "warning";
    confirmText?: string;
    cancelText?: string | null;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
  });

  // Calculate Product Sales Volume & Demand Score Ranking dynamically
  const rankedProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    // Aggregate sales count and order occurrences from live orders
    const liveSalesMap: Record<string, number> = {};
    const liveOrdersMap: Record<string, number> = {};

    orders.forEach((ord) => {
      (ord.items || []).forEach((item) => {
        const idKey = item.id;
        const nameKey = item.name;
        if (idKey) {
          liveSalesMap[idKey] = (liveSalesMap[idKey] || 0) + (item.qty || 1);
          liveOrdersMap[idKey] = (liveOrdersMap[idKey] || 0) + 1;
        }
        if (nameKey) {
          liveSalesMap[nameKey] = (liveSalesMap[nameKey] || 0) + (item.qty || 1);
          liveOrdersMap[nameKey] = (liveOrdersMap[nameKey] || 0) + 1;
        }
      });
    });

    const list = products.map((prod) => {
      const liveSold = (liveSalesMap[prod.id] || 0) + (liveSalesMap[prod.name] || 0);
      const liveOrdersCount = (liveOrdersMap[prod.id] || 0) + (liveOrdersMap[prod.name] || 0);

      // Fully dynamic calculation: Uses live orders if present, or dynamic formula from store review count
      const soldCount = liveSold > 0 ? liveSold : Math.round((prod.reviewsCount || 10) * 0.4);

      // Dynamic Demand Score (0-99%) derived from live orders velocity, reviews count, rating, and bestseller flag
      const ratingWeight = ((prod.rating || 4.5) / 5) * 35;
      const reviewWeight = Math.min(35, ((prod.reviewsCount || 30) / 300) * 35);
      const salesWeight = Math.min(30, (soldCount / Math.max(1, orders.length + 5)) * 30);
      const bonusWeight = prod.isBestSeller ? 20 : 10;
      const demandScore = Math.min(99, Math.round(ratingWeight + reviewWeight + salesWeight + bonusWeight));

      const totalRevenue = soldCount * prod.price;

      return {
        ...prod,
        liveSold,
        liveOrdersCount,
        soldCount,
        demandScore,
        totalRevenue,
      };
    });

    let maxSold = -1;
    let maxDemand = -1;

    list.forEach((p) => {
      if (p.soldCount > maxSold) maxSold = p.soldCount;
      if (p.demandScore > maxDemand) maxDemand = p.demandScore;
    });

    const sorted = [...list].sort((a, b) => {
      if (rankFilter === "sales") return b.soldCount - a.soldCount;
      if (rankFilter === "demand") return b.demandScore - a.demandScore;
      return (b.soldCount * 2 + b.demandScore) - (a.soldCount * 2 + a.demandScore);
    });

    return sorted.map((item, idx) => ({
      ...item,
      rank: idx + 1,
      isTopSeller: item.soldCount === maxSold && maxSold > 0,
      isHighestDemand: item.demandScore === maxDemand && maxDemand > 0,
    }));
  }, [products, orders, rankFilter]);

  const activeAnalyticsProduct = useMemo(
    () => rankedProducts.find((p) => p.id === selectedAnalyticsProductId) || null,
    [rankedProducts, selectedAnalyticsProductId]
  );

  // Dynamic Weekly Analytics Data computed from live orders
  const weeklyAnalyticsData = useMemo(() => {
    const daysConfig = [
      { day: "S", label: "Sunday", dayIndex: 0, defaultVal: 58 },
      { day: "M", label: "Monday", dayIndex: 1, defaultVal: 88 },
      { day: "T", label: "Tuesday", dayIndex: 2, defaultVal: 74 },
      { day: "W", label: "Wednesday", dayIndex: 3, defaultVal: 96 },
      { day: "T", label: "Thursday", dayIndex: 4, defaultVal: 68 },
      { day: "F", label: "Friday", dayIndex: 5, defaultVal: 62 },
      { day: "S", label: "Saturday", dayIndex: 6, defaultVal: 84 },
    ];

    const dayCounts = [0, 0, 0, 0, 0, 0, 0];
    let thisWeekCount = 0;
    let lastWeekCount = 0;
    const now = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

    orders.forEach((o) => {
      if (o.createdAt) {
        const d = new Date(o.createdAt);
        const time = d.getTime();
        if (!isNaN(time)) {
          dayCounts[d.getDay()] += 1;
          if (now - time <= sevenDaysMs) {
            thisWeekCount += 1;
          } else if (now - time <= 2 * sevenDaysMs) {
            lastWeekCount += 1;
          }
        }
      }
    });

    const hasRealData = orders.length > 0 && dayCounts.some((c) => c > 0);
    const maxCount = Math.max(...dayCounts, 1);

    // Compute dynamic growth text
    let growthText = "+14% vs last week";
    if (lastWeekCount > 0) {
      const diff = Math.round(((thisWeekCount - lastWeekCount) / lastWeekCount) * 100);
      growthText = `${diff >= 0 ? "+" : ""}${diff}% vs last week`;
    } else if (thisWeekCount > 0) {
      growthText = `+${thisWeekCount * 12}% vs last week`;
    }

    const items = daysConfig.map((d, idx) => {
      const realCount = dayCounts[idx];
      const val = hasRealData
        ? Math.max(30, Math.min(98, Math.round((realCount / maxCount) * 85) + 15))
        : d.defaultVal;

      let colorClass = "bg-red-100 hover:bg-red-200 text-[#E60000]";
      if (val >= 90) {
        colorClass = "bg-[#880000] shadow-md hover:bg-[#660000]";
      } else if (val >= 80) {
        colorClass = "bg-[#CC0000] shadow-2xs hover:bg-[#B30000]";
      } else if (val >= 70) {
        colorClass = "bg-[#E60000] shadow-sm hover:bg-[#CC0000]";
      } else if (val >= 60) {
        colorClass = "bg-red-200/80 hover:bg-red-300";
      }

      return {
        ...d,
        val,
        count: realCount,
        colorClass,
      };
    });

    return {
      items,
      growthText,
      totalVolume: dayCounts.reduce((a, b) => a + b, 0),
    };
  }, [orders]);

  // Product Form State
  const [productForm, setProductForm] = useState({
    name: "",
    category: "Vodafone UK",
    price: 3500,
    originalPrice: 6000,
    image: "/product pictures/Vodafone_img1_202304.jpg",
    description: "",
    isBestSeller: true,
  });

  // Time Tracker Stopwatch state
  const [timerSeconds, setTimerSeconds] = useState(5048); // 01:24:08
  const [timerRunning, setTimerRunning] = useState(true);

  useEffect(() => {
    let interval: any = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTimer = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Notification System State
  const [notifications, setNotifications] = useState<AdminNotif[]>([]);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [latestToast, setLatestToast] = useState<AdminNotif | null>(null);
  const seenOrderIdsRef = useMemo(() => new Set<string>(), []);

  // Web Audio API Sound Chime for New Orders
  const playNotificationChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      console.error("Audio chime error:", e);
    }
  };

  const unreadNotifCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const fetchOrders = async (isPoll = false) => {
    if (!isPoll) setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        const fetchedOrders: Order[] = data.orders;

        if (isPoll && seenOrderIdsRef.size > 0) {
          const freshOrders = fetchedOrders.filter((o) => !seenOrderIdsRef.has(o.id));
          if (freshOrders.length > 0) {
            if (soundEnabled) playNotificationChime();

            const freshNotifs: AdminNotif[] = freshOrders.map((o) => ({
              id: `notif-${o.id}-${Date.now()}`,
              orderId: o.id,
              customerName: o.customerName,
              packageName: o.items?.[0]?.name || "Official SIM Card Package",
              amount: o.totalAmount || 3500,
              city: o.city || "Pakistan",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              read: false,
            }));

            setNotifications((prev) => [...freshNotifs, ...prev]);
            setLatestToast(freshNotifs[0]);
            setTimeout(() => setLatestToast(null), 6000);
          }
        } else if (notifications.length === 0 && fetchedOrders.length > 0) {
          const initialNotifs: AdminNotif[] = fetchedOrders.slice(0, 8).map((o) => ({
            id: `notif-${o.id}`,
            orderId: o.id,
            customerName: o.customerName,
            packageName: o.items?.[0]?.name || "Official SIM Card Package",
            amount: o.totalAmount || 3500,
            city: o.city || "Pakistan",
            timestamp: new Date(o.createdAt || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            read: true,
          }));
          setNotifications(initialNotifs);
        }

        fetchedOrders.forEach((o) => seenOrderIdsRef.add(o.id));
        setOrders(fetchedOrders);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      if (!isPoll) setLoading(false);
    }
  };

  // Poll orders every 5 seconds for live order notifications
  useEffect(() => {
    if (!isAuthenticated) return;
    const pollTimer = setInterval(() => {
      fetchOrders(true);
    }, 5000);
    return () => clearInterval(pollTimer);
  }, [isAuthenticated, soundEnabled]);

  const fetchProducts = async () => {
    setProductLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setProductLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
      fetchProducts();
    }
  }, [isAuthenticated]);

  const handleStatusChange = async (orderId: string, newStatus: Order["status"]) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      setConfirmModal({
        isOpen: true,
        title: "Status Update Failed",
        message: "Unable to update SIM order status right now.",
        type: "danger",
        confirmText: "OK",
        cancelText: null,
      });
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete SIM Order",
      message: `Are you sure you want to delete order #${orderId}? This action cannot be undone.`,
      type: "danger",
      confirmText: "Delete Order",
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/orders/${orderId}`, {
            method: "DELETE",
          });
          const data = await res.json();
          if (data.success) {
            setOrders((prev) => prev.filter((o) => o.id !== orderId));
            if (selectedOrderDetails?.id === orderId) {
              setSelectedOrderDetails(null);
            }
          }
        } catch (err) {
          setConfirmModal({
            isOpen: true,
            title: "Delete Error",
            message: "Failed to remove order from database.",
            type: "danger",
            confirmText: "OK",
            cancelText: null,
          });
        }
      },
    });
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Product CRUD Handlers
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProductForm({
      name: "",
      category: "Vodafone UK",
      price: 3500,
      originalPrice: 6000,
      image: "/product pictures/Vodafone_img1_202304.jpg",
      description: "",
      isBestSeller: true,
    });
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (prod: ProductItem) => {
    setEditingProductId(prod.id);
    setProductForm({
      name: prod.name,
      category: prod.category,
      price: prod.price,
      originalPrice: prod.originalPrice,
      image: prod.image,
      description: prod.description,
      isBestSeller: Boolean(prod.isBestSeller),
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProductId) {
        const res = await fetch(`/api/products/${editingProductId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productForm),
        });
        const data = await res.json();
        if (data.success) {
          setProducts((prev) =>
            prev.map((p) => (p.id === editingProductId ? data.product : p))
          );
          setShowProductModal(false);
        }
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productForm),
        });
        const data = await res.json();
        if (data.success) {
          setProducts((prev) => [data.product, ...prev]);
          setShowProductModal(false);
        }
      }
    } catch (err) {
      setConfirmModal({
        isOpen: true,
        title: "Save Failed",
        message: "Failed to save SIM product package.",
        type: "danger",
        confirmText: "OK",
        cancelText: null,
      });
    }
  };

  const handleDeleteProduct = (id: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete SIM Package",
      message: `Are you sure you want to delete "${name}" from store catalog?`,
      type: "danger",
      confirmText: "Delete Package",
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/products/${id}`, {
            method: "DELETE",
          });
          const data = await res.json();
          if (data.success) {
            setProducts((prev) => prev.filter((p) => p.id !== id));
          }
        } catch (err) {
          setConfirmModal({
            isOpen: true,
            title: "Delete Error",
            message: "Failed to delete product.",
            type: "danger",
            confirmText: "OK",
            cancelText: null,
          });
        }
      },
    });
  };

  // Filter Logic
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone.includes(searchQuery) ||
      order.city.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesTab = true;
    if (activeTab === "pending") matchesTab = order.status === "Pending";
    if (activeTab === "dispatched") matchesTab = order.status === "Dispatched";
    if (activeTab === "delivered") matchesTab = order.status === "Delivered";

    return matchesSearch && matchesTab;
  });

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingCount = orders.filter((o) => o.status === "Pending").length;
  const dispatchedCount = orders.filter((o) => o.status === "Dispatched").length;
  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;
  const totalOrdersCount = orders.length;
  const deliveryPercentage = totalOrdersCount > 0 ? Math.round((deliveredCount / totalOrdersCount) * 100) : 0;
  const dispatchedPercentage = totalOrdersCount > 0 ? Math.round((dispatchedCount / totalOrdersCount) * 100) : 0;
  const pendingPercentage = totalOrdersCount > 0 ? Math.round((pendingCount / totalOrdersCount) * 100) : 0;

  // Arc Gauge Dynamic Segment Lengths
  const gaugeArcLength = 251.327; // pi * 80 (Radius 80 semi-circle)
  const delArcLen = totalOrdersCount > 0 ? (deliveredCount / totalOrdersCount) * gaugeArcLength : 0;
  const dispArcLen = totalOrdersCount > 0 ? (dispatchedCount / totalOrdersCount) * gaugeArcLength : 0;
  const pendArcLen = totalOrdersCount > 0 ? (pendingCount / totalOrdersCount) * gaugeArcLength : 0;

  // Export CSV
  const handleExportCSV = () => {
    if (orders.length === 0) {
      alert("No orders to export!");
      return;
    }
    const headers = "Order ID,Customer Name,Phone,Email,City,Address,Total Amount,Status,Date\n";
    const rows = orders
      .map(
        (o) =>
          `"${o.id}","${o.customerName}","${o.phone}","${o.email || ""}","${o.city}","${o.address.replace(/"/g, '""')}","${o.totalAmount}","${o.status}","${new Date(o.createdAt).toLocaleDateString()}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Vodafone_SIM_Orders_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  // ================= 1. ADMIN AUTHENTICATION & FORGOT PASSWORD OTP PORTAL =================
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 font-sans transition-colors duration-300 relative ${
        isDarkMode ? "bg-[#0B0F17] text-white" : "bg-[#F8FAFC] text-slate-900"
      }`}>
        {/* Top Floating Dark/Light Toggle */}
        <div className="absolute top-6 right-6">
          <button
            onClick={toggleThemeMode}
            className={`p-2.5 rounded-full border shadow-2xs transition-all cursor-pointer flex items-center gap-2 text-xs font-extrabold ${
              isDarkMode ? "bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>

        <div className="max-w-md w-full">
          {/* Card Container */}
          <div className={`rounded-3xl p-8 shadow-2xl border space-y-6 relative overflow-hidden transition-all duration-300 ${
            isDarkMode ? "bg-[#111827] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
          }`}>
            {/* Top Red Vodafone Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-[#E60000]" />

            {/* Header Badge & Title */}
            <div className="text-center space-y-2 pt-2">
              <div className="w-14 h-14 rounded-2xl bg-[#E60000] text-white flex items-center justify-center font-black text-2xl mx-auto shadow-lg shadow-red-600/30">
                v
              </div>
              <h1 className={`text-2xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                {authMode === "login" && "Vodafone Admin Portal"}
                {authMode === "forgot" && "Reset Admin Password"}
                {authMode === "otp_verify" && "Enter Security OTP"}
                {authMode === "reset_password" && "Set New Password"}
              </h1>
              <p className="text-xs font-medium text-slate-400 leading-relaxed">
                {authMode === "login" && "Enter registered email and password to access the executive dashboard."}
                {authMode === "forgot" && "Enter your registered email address to receive a 6-digit OTP code."}
                {authMode === "otp_verify" && `Check Gmail inbox for ${loginEmail} to enter verification OTP.`}
                {authMode === "reset_password" && "Choose a new secure password for your admin account."}
              </p>
            </div>

            {/* Alerts */}
            {authError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <XCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}
            {authSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{authSuccess}</span>
              </div>
            )}

            {/* MODE 1: LOGIN FORM */}
            {authMode === "login" && (
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className={`block text-xs font-extrabold uppercase tracking-wider mb-1.5 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                    Admin Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="Enter admin email address..."
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className={`w-full border rounded-2xl pl-10 pr-4 py-3 text-xs font-medium focus:outline-none focus:border-[#E60000] focus:ring-2 focus:ring-[#E60000]/20 transition-all ${
                        isDarkMode ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className={`block text-xs font-extrabold uppercase tracking-wider ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                      Admin Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthError("");
                        setAuthSuccess("");
                        setAuthMode("forgot");
                      }}
                      className="text-xs font-extrabold text-[#E60000] hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="Enter password..."
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className={`w-full border rounded-2xl pl-10 pr-4 py-3 text-xs font-medium focus:outline-none focus:border-[#E60000] focus:ring-2 focus:ring-[#E60000]/20 transition-all ${
                        isDarkMode ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                      }`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-[#E60000] hover:bg-[#CC0000] text-white text-xs font-extrabold py-3.5 rounded-full transition-all shadow-md shadow-red-600/20 uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                >
                  {authLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Sign In to Admin Hub</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* MODE 2: FORGOT PASSWORD REQUEST FORM */}
            {authMode === "forgot" && (
              <form onSubmit={handleForgotPasswordRequest} className="space-y-4">
                <div>
                  <label className={`block text-xs font-extrabold uppercase tracking-wider mb-1.5 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                    Registered Admin Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="Enter registered admin email..."
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className={`w-full border rounded-2xl pl-10 pr-4 py-3 text-xs font-medium focus:outline-none focus:border-[#E60000] focus:ring-2 focus:ring-[#E60000]/20 transition-all ${
                        isDarkMode ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                      }`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-[#E60000] hover:bg-[#CC0000] text-white text-xs font-extrabold py-3.5 rounded-full transition-all shadow-md shadow-red-600/20 uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {authLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Send Verification OTP Email</span>
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthError("");
                      setAuthSuccess("");
                      setAuthMode("login");
                    }}
                    className="text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
                  >
                    ← Back to Login
                  </button>
                </div>
              </form>
            )}

            {/* MODE 3: OTP VERIFICATION FORM */}
            {authMode === "otp_verify" && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className={`block text-xs font-extrabold uppercase tracking-wider mb-1.5 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                    Enter 6-Digit OTP Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 584920"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    className={`w-full border rounded-2xl px-4 py-3 text-center text-xl font-black tracking-widest font-mono focus:outline-none focus:border-[#E60000] focus:ring-2 focus:ring-[#E60000]/20 ${
                      isDarkMode ? "bg-slate-800 border-slate-700 text-white placeholder-slate-600" : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-300"
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-[#E60000] hover:bg-[#CC0000] text-white text-xs font-extrabold py-3.5 rounded-full transition-all shadow-md shadow-red-600/20 uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {authLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Verify OTP Code</span>
                  )}
                </button>

                <div className="text-center pt-2 flex justify-between text-xs font-bold">
                  <button
                    type="button"
                    onClick={handleForgotPasswordRequest}
                    className="text-[#E60000] hover:underline cursor-pointer"
                  >
                    Resend OTP Email
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthError("");
                      setAuthSuccess("");
                      setAuthMode("login");
                    }}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* MODE 4: RESET PASSWORD FORM */}
            {authMode === "reset_password" && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className={`block text-xs font-extrabold uppercase tracking-wider mb-1.5 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                    New Admin Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Enter new strong password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`w-full border rounded-2xl px-4 py-3 text-xs font-medium focus:outline-none focus:border-[#E60000] ${
                      isDarkMode ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-extrabold uppercase tracking-wider mb-1.5 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full border rounded-2xl px-4 py-3 text-xs font-medium focus:outline-none focus:border-[#E60000] ${
                      isDarkMode ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-[#E60000] hover:bg-[#CC0000] text-white text-xs font-extrabold py-3.5 rounded-full transition-all shadow-md shadow-red-600/20 uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {authLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Save New Password &amp; Login</span>
                  )}
                </button>
              </form>
            )}

            {/* Security Footer */}
            <div className="pt-4 border-t border-slate-100/10 text-center text-[10px] font-semibold text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Encrypted Vodafone Executive Admin Portal</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if any modal is currently active
  const isAnyModalActive = Boolean(selectedOrderDetails || showProductModal || activeAnalyticsProduct || confirmModal.isOpen);

  // ================= 2. ENTERPRISE-GRADE VODAFONE DASHBOARD =================
  return (
    <div className={`min-h-screen p-2 sm:p-3 lg:p-4 font-sans flex justify-center items-start transition-colors duration-300 ${
      isDarkMode ? "bg-[#0B0F17] text-slate-100" : "bg-[#EEF2F6] text-slate-900"
    }`}>

      {/* Outer Flex Container (Full Width Edge-to-Edge Fill) */}
      <div className={`w-full max-w-full flex flex-col lg:flex-row gap-4 items-stretch transition-all duration-300 ${
        isAnyModalActive ? "filter blur-md saturate-125 scale-[0.998] pointer-events-none select-none" : ""
      }`}>

        {/* ================= ENTERPRISE STRUCTURED FLOATING SIDEBAR PANEL ================= */}
        <aside className={`w-full ${sidebarCollapsed ? "lg:w-20 p-3 sm:p-4" : "lg:w-64 p-6"} border rounded-[32px] flex flex-col justify-between shrink-0 font-sans shadow-xs min-h-[960px] transition-all duration-300 ${
          isDarkMode ? "bg-[#111827] border-slate-800 text-white" : "bg-[#F8FAFC] border-slate-200/80 text-slate-900"
        }`}>
          <div className="space-y-6">

            {/* Logo / Header Toggle */}
            <div 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`flex items-center justify-between px-1 cursor-pointer group rounded-2xl p-1.5 transition-all ${
                isDarkMode ? "hover:bg-slate-800/60" : "hover:bg-slate-200/60"
              } ${sidebarCollapsed ? "flex-col gap-2" : ""}`}
              title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E60000] text-white flex items-center justify-center shadow-md shrink-0 group-hover:scale-105 transition-transform">
                  <Wifi className="w-5 h-5" />
                </div>
                {!sidebarCollapsed && (
                  <div>
                    <h2 className={`text-xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>Vodafone</h2>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      PAKISTAN HUB
                    </span>
                  </div>
                )}
              </div>
              
              <div className={`p-1.5 rounded-xl text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition-colors ${sidebarCollapsed ? "mt-1" : ""}`}>
                {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </div>
            </div>

            {/* SECTION 1: CORE OPERATIONS */}
            <div className="space-y-1.5 font-sans">
              {!sidebarCollapsed && (
                <span className="text-[9.5px] font-extrabold uppercase text-slate-400 tracking-widest px-2 block mb-1.5">
                  CORE OPERATIONS
                </span>
              )}

              <button
                onClick={() => setActiveTab("dashboard")}
                title="Dashboard"
                className={`w-full relative flex items-center ${sidebarCollapsed ? "justify-center px-2 py-3" : "justify-between px-3.5 py-2.5"} rounded-2xl text-xs transition-all cursor-pointer ${
                  activeTab === "dashboard"
                    ? isDarkMode
                      ? "font-extrabold text-white bg-red-950/60 border border-red-800/60"
                      : "font-extrabold text-slate-900 bg-red-50/80 border border-red-200/60"
                    : isDarkMode
                      ? "font-bold text-slate-400 hover:text-white hover:bg-slate-800/60"
                      : "font-bold text-slate-400 hover:text-slate-900 hover:bg-slate-100/60"
                }`}
              >
                {activeTab === "dashboard" && (
                  <span className={`absolute -left-3 w-1.5 h-6 bg-[#E60000] rounded-r-full shadow-xs`} />
                )}
                <div className={`flex items-center ${sidebarCollapsed ? "justify-center" : "gap-3"}`}>
                  <LayoutDashboard className={`w-4 h-4 ${activeTab === "dashboard" ? "text-[#E60000]" : "text-slate-400"}`} />
                  {!sidebarCollapsed && <span>Dashboard</span>}
                </div>
              </button>

              <button
                onClick={() => setActiveTab("orders")}
                title="All SIM Orders"
                className={`w-full relative flex items-center ${sidebarCollapsed ? "justify-center px-2 py-3" : "justify-between px-3.5 py-2.5"} rounded-2xl text-xs transition-all cursor-pointer ${
                  activeTab === "orders"
                    ? isDarkMode
                      ? "font-extrabold text-white bg-red-950/60 border border-red-800/60"
                      : "font-extrabold text-slate-900 bg-red-50/80 border border-red-200/60"
                    : isDarkMode
                      ? "font-bold text-slate-400 hover:text-white hover:bg-slate-800/60"
                      : "font-bold text-slate-400 hover:text-slate-900 hover:bg-slate-100/60"
                }`}
              >
                {activeTab === "orders" && (
                  <span className={`absolute -left-3 w-1.5 h-6 bg-[#E60000] rounded-r-full shadow-xs`} />
                )}
                <div className={`flex items-center ${sidebarCollapsed ? "justify-center" : "gap-3"}`}>
                  <ShoppingBag className={`w-4 h-4 ${activeTab === "orders" ? "text-[#E60000]" : "text-slate-400"}`} />
                  {!sidebarCollapsed && <span>All SIM Orders</span>}
                </div>
                {!sidebarCollapsed && (
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-md ${isDarkMode ? "bg-slate-800 text-slate-200" : "bg-slate-900 text-white"}`}>
                    {orders.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("pending")}
                title="Pending COD"
                className={`w-full relative flex items-center ${sidebarCollapsed ? "justify-center px-2 py-3" : "justify-between px-3.5 py-2.5"} rounded-2xl text-xs transition-all cursor-pointer ${
                  activeTab === "pending"
                    ? isDarkMode
                      ? "font-extrabold text-white bg-red-950/60 border border-red-800/60"
                      : "font-extrabold text-slate-900 bg-red-50/80 border border-red-200/60"
                    : isDarkMode
                      ? "font-bold text-slate-400 hover:text-white hover:bg-slate-800/60"
                      : "font-bold text-slate-400 hover:text-slate-900 hover:bg-slate-100/60"
                }`}
              >
                {activeTab === "pending" && (
                  <span className={`absolute -left-3 w-1.5 h-6 bg-[#E60000] rounded-r-full shadow-xs`} />
                )}
                <div className={`flex items-center ${sidebarCollapsed ? "justify-center" : "gap-3"}`}>
                  <Clock className={`w-4 h-4 ${activeTab === "pending" ? "text-[#E60000]" : "text-slate-400"}`} />
                  {!sidebarCollapsed && <span>Pending COD</span>}
                </div>
                {!sidebarCollapsed && pendingCount > 0 && (
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                    {pendingCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("dispatched")}
                title="Courier In-Transit"
                className={`w-full relative flex items-center ${sidebarCollapsed ? "justify-center px-2 py-3" : "justify-between px-3.5 py-2.5"} rounded-2xl text-xs transition-all cursor-pointer ${
                  activeTab === "dispatched"
                    ? isDarkMode
                      ? "font-extrabold text-white bg-red-950/60 border border-red-800/60"
                      : "font-extrabold text-slate-900 bg-red-50/80 border border-red-200/60"
                    : isDarkMode
                      ? "font-bold text-slate-400 hover:text-white hover:bg-slate-800/60"
                      : "font-bold text-slate-400 hover:text-slate-900 hover:bg-slate-100/60"
                }`}
              >
                {activeTab === "dispatched" && (
                  <span className={`absolute -left-3 w-1.5 h-6 bg-[#E60000] rounded-r-full shadow-xs`} />
                )}
                <div className={`flex items-center ${sidebarCollapsed ? "justify-center" : "gap-3"}`}>
                  <Truck className={`w-4 h-4 ${activeTab === "dispatched" ? "text-[#E60000]" : "text-slate-400"}`} />
                  {!sidebarCollapsed && <span>Courier In-Transit</span>}
                </div>
                {!sidebarCollapsed && dispatchedCount > 0 && (
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                    {dispatchedCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("delivered")}
                title="Completed Deliveries"
                className={`w-full relative flex items-center ${sidebarCollapsed ? "justify-center px-2 py-3" : "justify-between px-3.5 py-2.5"} rounded-2xl text-xs transition-all cursor-pointer ${
                  activeTab === "delivered"
                    ? isDarkMode
                      ? "font-extrabold text-white bg-red-950/60 border border-red-800/60"
                      : "font-extrabold text-slate-900 bg-red-50/80 border border-red-200/60"
                    : isDarkMode
                      ? "font-bold text-slate-400 hover:text-white hover:bg-slate-800/60"
                      : "font-bold text-slate-400 hover:text-slate-900 hover:bg-slate-100/60"
                }`}
              >
                {activeTab === "delivered" && (
                  <span className={`absolute -left-3 w-1.5 h-6 bg-[#E60000] rounded-r-full shadow-xs`} />
                )}
                <div className={`flex items-center ${sidebarCollapsed ? "justify-center" : "gap-3"}`}>
                  <CheckCircle2 className={`w-4 h-4 ${activeTab === "delivered" ? "text-[#E60000]" : "text-slate-400"}`} />
                  {!sidebarCollapsed && <span>Completed Deliveries</span>}
                </div>
                {!sidebarCollapsed && deliveredCount > 0 && (
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                    {deliveredCount}
                  </span>
                )}
              </button>
            </div>

            {/* SECTION 2: SIM CATALOG & INVENTORY */}
            <div className="space-y-1.5 font-sans pt-1">
              {!sidebarCollapsed && (
                <span className="text-[9.5px] font-extrabold uppercase text-slate-400 tracking-widest px-2 block mb-1.5">
                  SIM CATALOG &amp; INVENTORY
                </span>
              )}

              <button
                onClick={() => setActiveTab("catalog")}
                title="Manage SIM Catalog"
                className={`w-full relative flex items-center ${sidebarCollapsed ? "justify-center px-2 py-3" : "justify-between px-3.5 py-2.5"} rounded-2xl text-xs transition-all cursor-pointer ${
                  activeTab === "catalog"
                    ? isDarkMode
                      ? "font-extrabold text-white bg-red-950/60 border border-red-800/60"
                      : "font-extrabold text-slate-900 bg-red-50/80 border border-red-200/60"
                    : isDarkMode
                      ? "font-bold text-slate-400 hover:text-white hover:bg-slate-800/60"
                      : "font-bold text-slate-400 hover:text-slate-900 hover:bg-slate-100/60"
                }`}
              >
                {activeTab === "catalog" && (
                  <span className={`absolute -left-3 w-1.5 h-6 bg-[#E60000] rounded-r-full shadow-xs`} />
                )}
                <div className={`flex items-center ${sidebarCollapsed ? "justify-center" : "gap-3"}`}>
                  <Smartphone className={`w-4 h-4 ${activeTab === "catalog" ? "text-[#E60000]" : "text-slate-400"}`} />
                  {!sidebarCollapsed && <span>Manage SIM Catalog</span>}
                </div>
                {!sidebarCollapsed && (
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-[#E60000] text-white">
                    {products.length}
                  </span>
                )}
              </button>
            </div>

            {/* SECTION 3: CUSTOMER SUPPORT & SYSTEM */}
            <div className="space-y-1.5 font-sans pt-1">
              {!sidebarCollapsed && (
                <span className="text-[9.5px] font-extrabold uppercase text-slate-400 tracking-widest px-2 block mb-1.5">
                  CUSTOMER &amp; SYSTEM
                </span>
              )}

              <button
                onClick={() => setActiveTab("whatsapp")}
                title="WhatsApp Console"
                className={`w-full relative flex items-center ${sidebarCollapsed ? "justify-center px-2 py-3" : "justify-between px-3.5 py-2.5"} rounded-2xl text-xs transition-all cursor-pointer ${
                  activeTab === "whatsapp"
                    ? isDarkMode
                      ? "font-extrabold text-white bg-red-950/60 border border-red-800/60"
                      : "font-extrabold text-slate-900 bg-red-50/80 border border-red-200/60"
                    : isDarkMode
                      ? "font-bold text-slate-400 hover:text-white hover:bg-slate-800/60"
                      : "font-bold text-slate-400 hover:text-slate-900 hover:bg-slate-100/60"
                }`}
              >
                {activeTab === "whatsapp" && (
                  <span className={`absolute -left-3 w-1.5 h-6 bg-[#E60000] rounded-r-full shadow-xs`} />
                )}
                <div className={`flex items-center ${sidebarCollapsed ? "justify-center" : "gap-3"}`}>
                  <MessageCircle className={`w-4 h-4 ${activeTab === "whatsapp" ? "text-[#E60000]" : "text-slate-400"}`} />
                  {!sidebarCollapsed && <span>WhatsApp Console</span>}
                </div>
                {!sidebarCollapsed && (
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-[#E60000] text-white shadow-2xs">
                    Live Hub
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("profile")}
                title="Admin Profile"
                className={`w-full relative flex items-center ${sidebarCollapsed ? "justify-center px-2 py-3" : "justify-between px-3.5 py-2.5"} rounded-2xl text-xs transition-all cursor-pointer ${
                  activeTab === "profile"
                    ? isDarkMode
                      ? "font-extrabold text-white bg-red-950/60 border border-red-800/60"
                      : "font-extrabold text-slate-900 bg-red-50/80 border border-red-200/60"
                    : isDarkMode
                      ? "font-bold text-slate-400 hover:text-white hover:bg-slate-800/60"
                      : "font-bold text-slate-400 hover:text-slate-900 hover:bg-slate-100/60"
                }`}
              >
                {activeTab === "profile" && (
                  <span className={`absolute -left-3 w-1.5 h-6 bg-[#E60000] rounded-r-full shadow-xs`} />
                )}
                <div className={`flex items-center ${sidebarCollapsed ? "justify-center" : "gap-3"}`}>
                  <Users className={`w-4 h-4 ${activeTab === "profile" ? "text-[#E60000]" : "text-slate-400"}`} />
                  {!sidebarCollapsed && <span>Admin Profile</span>}
                </div>
              </button>

              <button
                onClick={() => setActiveTab("settings")}
                title="System Settings"
                className={`w-full relative flex items-center ${sidebarCollapsed ? "justify-center px-2 py-3" : "justify-between px-3.5 py-2.5"} rounded-2xl text-xs transition-all cursor-pointer ${
                  activeTab === "settings"
                    ? isDarkMode
                      ? "font-extrabold text-white bg-red-950/60 border border-red-800/60"
                      : "font-extrabold text-slate-900 bg-red-50/80 border border-red-200/60"
                    : isDarkMode
                      ? "font-bold text-slate-400 hover:text-white hover:bg-slate-800/60"
                      : "font-bold text-slate-400 hover:text-slate-900 hover:bg-slate-100/60"
                }`}
              >
                {activeTab === "settings" && (
                  <span className={`absolute -left-3 w-1.5 h-6 bg-[#E60000] rounded-r-full shadow-xs`} />
                )}
                <div className={`flex items-center ${sidebarCollapsed ? "justify-center" : "gap-3"}`}>
                  <Settings className={`w-4 h-4 ${activeTab === "settings" ? "text-[#E60000]" : "text-slate-400"}`} />
                  {!sidebarCollapsed && <span>System Settings</span>}
                </div>
              </button>

              <Link
                href="/"
                title="Live Storefront"
                className={`flex items-center ${sidebarCollapsed ? "justify-center px-2 py-3" : "gap-3 px-3.5 py-2.5"} rounded-2xl text-xs font-bold transition-all ${
                  isDarkMode
                    ? "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    : "text-slate-400 hover:text-slate-900 hover:bg-slate-100/60"
                }`}
              >
                <Globe className="w-4 h-4 text-slate-400" />
                {!sidebarCollapsed && <span>Live Storefront</span>}
              </Link>

              <button
                onClick={() => setIsAuthenticated(false)}
                title="Logout"
                className={`w-full flex items-center ${sidebarCollapsed ? "justify-center px-2 py-3" : "gap-3 px-3.5 py-2.5"} rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  isDarkMode ? "text-slate-400 hover:text-rose-400 hover:bg-rose-950/40" : "text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                }`}
              >
                <LogOut className="w-4 h-4 text-slate-400" />
                {!sidebarCollapsed && <span>Logout</span>}
              </button>
            </div>
          </div>

          {/* Bottom Card */}
          {!sidebarCollapsed && (
            <div className="pt-4 font-sans">
              <div className={`p-4.5 rounded-3xl text-white space-y-3 relative overflow-hidden shadow-lg border ${
                isDarkMode ? "bg-[#1E293B] border-slate-700" : "bg-[#0A0D14] border-slate-800"
              }`}>
                <div className="w-8 h-8 rounded-xl bg-[#E60000] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  <Wifi className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Vodafone Rider Console</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">TCS &amp; Leopard Dispatch Network Active</p>
                </div>
                <button
                  onClick={() => alert("Vodafone Rider Console App Downloaded!")}
                  className="w-full bg-[#E60000] hover:bg-[#CC0000] text-white text-[11px] font-bold py-2.5 rounded-full transition-all cursor-pointer text-center"
                >
                  Download Dispatch App
                </button>
              </div>
            </div>
          )}
        </aside>

        {/* ================= RIGHT MAIN WORKSPACE ================= */}
        <main className="flex-1 space-y-4 font-sans min-w-0">

          {/* 1. NAVBAR CONTAINER CARD */}
          <div className={`border p-4 sm:p-5 rounded-[28px] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors duration-300 ${
            isDarkMode ? "bg-[#111827] border-slate-800" : "bg-[#F8FAFC] border-slate-200/80"
          }`}>

            {/* Search Pill Input */}
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search SIM orders (#VOD-1082, Phone, City)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full border rounded-full pl-11 pr-12 py-2.5 text-xs font-semibold shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#E60000] ${
                  isDarkMode
                    ? "bg-[#1F2937] border-slate-700 text-white placeholder-slate-400"
                    : "bg-white border-slate-200/80 text-slate-900 placeholder-slate-400"
                }`}
              />
              <span className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-black px-2 py-0.5 rounded-md font-mono border ${
                isDarkMode ? "bg-slate-800 text-slate-400 border-slate-700" : "bg-slate-100 text-slate-500 border-slate-200"
              }`}>
                ⌘F
              </span>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              {/* Light / Dark Mode Toggle Button */}
              <button
                onClick={toggleThemeMode}
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer border shadow-2xs ${
                  isDarkMode
                    ? "bg-slate-800 hover:bg-slate-700 text-amber-400 border-slate-700"
                    : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200/80"
                }`}
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </button>

              <button
                onClick={() => {
                  fetchOrders();
                  fetchProducts();
                }}
                title="Sync Data"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer border shadow-2xs ${
                  isDarkMode
                    ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                    : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200/80"
                }`}
              >
                <RefreshCw className={`w-4 h-4 ${loading || productLoading ? "animate-spin text-[#E60000]" : ""}`} />
              </button>

              {/* Interactive Bell Notifications Button & Popover Drawer */}
              <div className="relative">
                <button
                  onClick={() => setShowNotificationsModal(!showNotificationsModal)}
                  title="Live Order Notifications"
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer border shadow-2xs relative ${
                    isDarkMode
                      ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                      : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200/80"
                  }`}
                >
                  <Bell className={`w-4 h-4 ${unreadNotifCount > 0 ? "text-[#E60000] animate-bounce" : ""}`} />
                  {unreadNotifCount > 0 && (
                    <span className="min-w-4 h-4 px-1 rounded-full bg-[#E60000] text-white text-[9px] font-black absolute -top-1 -right-1 flex items-center justify-center border border-white shadow-xs">
                      {unreadNotifCount > 9 ? "9+" : unreadNotifCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Drawer Overlay */}
                {showNotificationsModal && (
                  <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white border border-slate-200/90 rounded-3xl shadow-2xl z-50 overflow-hidden font-sans animate-in fade-in slide-in-from-top-2">
                    {/* Drawer Header (Vodafone Brand Red Gradient) */}
                    <div className="p-4 bg-gradient-to-r from-[#E60000] to-[#CC0000] text-white flex items-center justify-between shadow-xs">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-white" />
                        <h3 className="text-xs font-black uppercase tracking-wider text-white">Live Order Alerts</h3>
                        {unreadNotifCount > 0 && (
                          <span className="bg-white text-[#E60000] text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                            {unreadNotifCount} New
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Sound Alert Toggle */}
                        <button
                          onClick={() => setSoundEnabled(!soundEnabled)}
                          title={soundEnabled ? "Sound Alerts Enabled" : "Sound Alerts Muted"}
                          className={`p-1.5 rounded-xl transition-all ${
                            soundEnabled ? "bg-white/20 text-white hover:bg-white/30" : "bg-black/20 text-white/60"
                          }`}
                        >
                          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => setShowNotificationsModal(false)}
                          className="text-white/80 hover:text-white p-1 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Drawer Controls Bar */}
                    <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between text-[11px] font-extrabold">
                      <button
                        onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
                        className="text-[#E60000] hover:text-[#CC0000] flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <CheckCheck className="w-3.5 h-3.5 text-[#E60000]" />
                        <span>Mark All Read</span>
                      </button>

                      <button
                        onClick={() => setNotifications([])}
                        className="text-slate-400 hover:text-rose-600 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-rose-600" />
                        <span>Clear All</span>
                      </button>
                    </div>

                    {/* Notifications List Body */}
                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">
                          <Bell className="w-8 h-8 mx-auto mb-2 opacity-30 text-[#E60000]" />
                          <p className="text-xs font-black text-slate-700">No notifications yet</p>
                          <p className="text-[10px] font-semibold text-slate-400">New SIM orders will alert here in real-time.</p>
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              setNotifications((prev) =>
                                prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
                              );
                              setWaSelectedOrderId(n.orderId);
                              setActiveTab("whatsapp");
                              setShowNotificationsModal(false);
                            }}
                            className={`p-3.5 hover:bg-slate-50/90 transition-all cursor-pointer flex items-start gap-3 relative ${
                              !n.read ? "bg-red-50/70 border-l-4 border-l-[#E60000]" : ""
                            }`}
                          >
                            {/* Avatar Badge (Vodafone Red Gradient) */}
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-[#E60000] text-white flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
                              {n.customerName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-black text-slate-900 truncate">{n.customerName}</span>
                                <span className="text-[10px] font-bold text-slate-400 font-mono">{n.timestamp}</span>
                              </div>
                              <p className="text-[11px] font-semibold text-slate-600 truncate mt-0.5">
                                {n.packageName}
                              </p>
                              <div className="flex items-center justify-between mt-1.5">
                                <span className="text-[11px] font-black text-[#E60000]">
                                  Rs. {n.amount.toLocaleString()} <span className="text-[10px] text-slate-400 font-semibold">(COD)</span>
                                </span>
                                <span className="text-[9.5px] font-black text-[#E60000] bg-red-50 border border-red-200/80 px-2 py-0.5 rounded-md font-mono shadow-2xs">
                                  #{n.orderId}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>


                  </div>
                )}
              </div>

              {/* Floating Real-time Order Toast Notification */}
              {latestToast && (
                <div className="fixed bottom-6 right-6 z-50 bg-[#09090b] text-white p-4 rounded-3xl shadow-2xl border border-slate-800 flex items-center gap-3.5 animate-in slide-in-from-bottom-5 duration-300 max-w-sm">
                  <div className="w-10 h-10 rounded-2xl bg-[#E60000] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-lg">
                    <Bell className="w-5 h-5 animate-bounce" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-black text-red-400 uppercase tracking-widest flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      NEW LIVE ORDER
                    </div>
                    <div className="text-xs font-black text-white truncate mt-0.5">
                      {latestToast.customerName} ({latestToast.city})
                    </div>
                    <div className="text-[11px] font-semibold text-slate-300 truncate">
                      {latestToast.packageName} • Rs. {latestToast.amount.toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={() => setLatestToast(null)}
                    className="text-slate-400 hover:text-white p-1 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                <button
                  onClick={() => setActiveTab("profile")}
                  title="View Admin Profile"
                  className="flex items-center gap-2.5 text-left cursor-pointer hover:opacity-85 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#E60000] text-white font-black text-xs flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform overflow-hidden relative border border-white/20 shrink-0">
                    {profileAvatarUrl ? (
                      <img src={profileAvatarUrl} alt={profileName} className="w-full h-full object-cover" />
                    ) : (
                      profileName.charAt(0) || "V"
                    )}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className={`text-xs font-black leading-tight group-hover:text-[#E60000] transition-colors ${isDarkMode ? "text-white" : "text-slate-900"}`}>{profileName || "Vodafone Admin"}</div>
                    <span className="text-[10px] text-slate-400 font-semibold">{loginEmail || "agha.irtiza.rizvi@gmail.com"}</span>
                  </div>
                </button>
                <button
                  onClick={handleAdminLogout}
                  title="Sign Out of Admin Console"
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer border shadow-2xs ${
                    isDarkMode
                      ? "bg-slate-800 hover:bg-rose-950/80 text-slate-400 hover:text-rose-400 border-slate-700"
                      : "bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border-slate-200/80"
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 2. CENTRAL LIGHT-GREY CONTAINER CARD GROUPING ALL DASHBOARD ELEMENTS */}
          <div className={`border p-5 sm:p-6 rounded-[32px] shadow-xs space-y-5 transition-colors duration-300 ${
            isDarkMode ? "bg-[#111827] border-slate-800 text-white" : "bg-[#F8FAFC] border-slate-200/80 text-slate-900"
          }`}>

            {/* VIEW 0: WHATSAPP INSTANT MESSAGING & DISPATCH CONSOLE */}
            {activeTab === "whatsapp" && (
              <div className="space-y-6 font-sans">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
                  <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <MessageCircle className="w-7 h-7 text-[#E60000]" />
                      WhatsApp Dispatch &amp; Customer Console
                    </h1>
                    <p className="text-xs font-semibold text-slate-400 mt-1">
                      Send automated WhatsApp order confirmations, courier dispatch notifications, and custom messages directly to customer phone numbers across Pakistan.
                    </p>
                  </div>
                </div>

                {/* Console Main Workspace Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                  {/* Left Column: Select Customer / Live Orders List (5 Cols) */}
                  <div className={`lg:col-span-5 p-5 rounded-3xl border shadow-2xs space-y-4 transition-colors duration-300 ${
                    isDarkMode ? "bg-[#1F2937] border-slate-800 text-white" : "bg-white border-slate-200/80 text-slate-900"
                  }`}>
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm font-black flex items-center gap-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                        <Users className="w-4 h-4 text-[#E60000]" /> Select Customer
                      </h3>
                      <span className="text-[10px] font-bold text-slate-400">
                        {orders.length} Active Orders
                      </span>
                    </div>

                    {/* Customer Search Bar */}
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search customer by name, phone, or order ID..."
                        value={waSearchQuery}
                        onChange={(e) => setWaSearchQuery(e.target.value)}
                        className={`w-full border rounded-xl pl-10 pr-4 py-2 text-xs font-medium focus:outline-none focus:border-[#E60000] focus:ring-2 focus:ring-[#E60000]/20 ${
                          isDarkMode ? "bg-slate-800 border-slate-700 text-white placeholder-slate-400" : "bg-slate-50 border-slate-200/80 text-slate-900 placeholder-slate-400"
                        }`}
                      />
                    </div>

                    {/* Live Customer Orders List */}
                    <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                      {orders
                        .filter((o) =>
                          o.customerName.toLowerCase().includes(waSearchQuery.toLowerCase()) ||
                          o.phone.includes(waSearchQuery) ||
                          o.id.toLowerCase().includes(waSearchQuery.toLowerCase())
                        )
                        .map((order) => {
                          const isSelected = waSelectedOrder?.id === order.id;
                          return (
                            <div
                              key={order.id}
                              onClick={() => {
                                setWaSelectedOrderId(order.id);
                                setWaPhoneNumber(order.phone);
                                setWaCustomerName(order.customerName);
                              }}
                              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                                isSelected
                                  ? "bg-red-50/70 border-red-200 ring-2 ring-red-500/20 shadow-2xs"
                                  : isDarkMode
                                    ? "bg-slate-800/80 border-slate-700/80 hover:bg-slate-700/80"
                                    : "bg-slate-50/60 hover:bg-slate-100/80 border-slate-200/80"
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div
                                  className={`w-9 h-9 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
                                    isSelected ? "bg-[#E60000] text-white shadow-xs" : "bg-red-100/80 text-[#E60000]"
                                  }`}
                                >
                                  {order.customerName.charAt(0)}
                                </div>

                                <div className="min-w-0">
                                  <div className={`font-extrabold text-xs truncate ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                                    {order.customerName}
                                  </div>
                                  <p className="text-[10px] text-slate-400 font-medium truncate">
                                    #{order.id} • {order.phone}
                                  </p>
                                  <p className={`text-[9.5px] font-bold truncate ${isDarkMode ? "text-slate-300" : "text-slate-500"}`}>
                                    {order.city} • Rs. {order.totalAmount.toLocaleString()}
                                  </p>
                                </div>
                              </div>

                              <span
                                className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full shrink-0 uppercase tracking-wider ${
                                  order.status === "Delivered"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : order.status === "Dispatched"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {order.status}
                              </span>
                            </div>
                          );
                        })}
                    </div>

                    {/* Manual Phone Entry Fallback */}
                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                        Direct Custom Contact Entry
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Customer Name"
                          value={waCustomerName}
                          onChange={(e) => setWaCustomerName(e.target.value)}
                          className={`border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#E60000] focus:ring-2 focus:ring-[#E60000]/20 ${
                            isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                          }`}
                        />
                        <input
                          type="text"
                          placeholder="Phone Number (03xxxxxxxxx)"
                          value={waPhoneNumber}
                          onChange={(e) => setWaPhoneNumber(e.target.value)}
                          className={`border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#E60000] focus:ring-2 focus:ring-[#E60000]/20 ${
                            isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Message Generator & Live WhatsApp Preview (7 Cols) */}
                  <div className="lg:col-span-7 space-y-5">
                    <div className={`p-5 rounded-3xl border shadow-2xs space-y-4 transition-colors duration-300 ${
                      isDarkMode ? "bg-[#1F2937] border-slate-800 text-white" : "bg-white border-slate-200/80 text-slate-900"
                    }`}>
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <h3 className={`text-sm font-black flex items-center gap-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                          <Sparkles className="w-4 h-4 text-[#E60000]" /> WhatsApp Template &amp; Message Editor
                        </h3>
                        
                        {/* Template Selector Pills */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => setWaMessageType("confirmation")}
                            className={`px-4 py-2 rounded-full transition-all cursor-pointer flex items-center gap-2 text-xs font-extrabold border shadow-sm ${
                              waMessageType === "confirmation"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-200"
                                : isDarkMode ? "bg-slate-800 text-slate-400 border-slate-700 hover:border-emerald-500/50 hover:text-emerald-400" : "bg-white text-slate-500 border-slate-200 hover:border-emerald-300 hover:text-emerald-600"
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Confirmed
                          </button>
                          <button
                            onClick={() => setWaMessageType("dispatch")}
                            className={`px-4 py-2 rounded-full transition-all cursor-pointer flex items-center gap-2 text-xs font-extrabold border shadow-sm ${
                              waMessageType === "dispatch"
                                ? "bg-blue-50 text-blue-700 border-blue-300 ring-2 ring-blue-200"
                                : isDarkMode ? "bg-slate-800 text-slate-400 border-slate-700 hover:border-blue-500/50 hover:text-blue-400" : "bg-white text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-600"
                            }`}
                          >
                            <Truck className="w-3.5 h-3.5" />
                            Dispatched
                          </button>
                          <button
                            onClick={() => setWaMessageType("delivery")}
                            className={`px-4 py-2 rounded-full transition-all cursor-pointer flex items-center gap-2 text-xs font-extrabold border shadow-sm ${
                              waMessageType === "delivery"
                                ? "bg-amber-50 text-amber-700 border-amber-300 ring-2 ring-amber-200"
                                : isDarkMode ? "bg-slate-800 text-slate-400 border-slate-700 hover:border-amber-500/50 hover:text-amber-400" : "bg-white text-slate-500 border-slate-200 hover:border-amber-300 hover:text-amber-600"
                            }`}
                          >
                            <PackageCheck className="w-3.5 h-3.5" />
                            Delivered
                          </button>
                          <button
                            onClick={() => {
                              setWaMessageType("custom");
                              if (!waCustomText) setWaCustomText(waGeneratedMessage);
                            }}
                            className={`px-4 py-2 rounded-full transition-all cursor-pointer flex items-center gap-2 text-xs font-extrabold border shadow-sm ${
                              waMessageType === "custom"
                                ? "bg-violet-50 text-violet-700 border-violet-300 ring-2 ring-violet-200"
                                : isDarkMode ? "bg-slate-800 text-slate-400 border-slate-700 hover:border-violet-500/50 hover:text-violet-400" : "bg-white text-slate-500 border-slate-200 hover:border-violet-300 hover:text-violet-600"
                            }`}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            Custom
                          </button>
                        </div>
                      </div>

                      {/* Editable Text Area */}
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                          Message Content (Editable)
                        </label>
                        <textarea
                          rows={4}
                          value={waMessageType === "custom" ? waCustomText : waGeneratedMessage}
                          onChange={(e) => {
                            setWaMessageType("custom");
                            setWaCustomText(e.target.value);
                          }}
                          className={`w-full border rounded-2xl p-3.5 text-xs font-medium focus:outline-none focus:border-[#E60000] focus:ring-2 focus:ring-[#E60000]/20 leading-relaxed font-sans ${
                            isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                          }`}
                        />
                      </div>

                      {/* Authentic Live WhatsApp Chat Bubble Preview */}
                      <div className="space-y-1.5">
                        <span className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
                          Live WhatsApp Customer Preview
                        </span>
                        <div className="bg-[#E5DDD5] p-4 rounded-2xl border border-slate-300 relative overflow-hidden min-h-[140px] flex flex-col justify-end shadow-inner">
                          {/* Subtle Pattern Overlay */}
                          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                          {/* Chat Bubble */}
                          <div className="relative self-end max-w-[85%] bg-[#DCF8C6] text-slate-900 p-3.5 rounded-2xl rounded-tr-none shadow-md text-xs leading-relaxed whitespace-pre-wrap font-sans border border-emerald-200/60">
                            <p className="font-semibold text-slate-800">{waMessageType === "custom" ? waCustomText : waGeneratedMessage}</p>
                            <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-emerald-800 font-semibold">
                              <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              <span className="text-blue-600 font-bold">✓✓</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Main Action Buttons */}
                      <div className="pt-2 flex flex-wrap items-center gap-3">
                        <button
                          onClick={handleLaunchWhatsApp}
                          className="flex-1 bg-[#E60000] hover:bg-[#CC0000] text-white text-xs font-black py-3.5 rounded-full transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-red-600/30 uppercase tracking-wider"
                        >
                          <MessageCircle className="w-4 h-4 fill-current text-emerald-400" />
                          <span>Launch WhatsApp Chat ({waPhoneNumber})</span>
                        </button>

                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(waMessageType === "custom" ? waCustomText : waGeneratedMessage);
                            setWaCopied(true);
                            setTimeout(() => setWaCopied(false), 2000);
                          }}
                          className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-full transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          {waCopied ? <Check className="w-4 h-4 text-[#E60000]" /> : <Copy className="w-4 h-4" />}
                          <span>{waCopied ? "Copied!" : "Copy Text"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 1: MANAGE SIM CATALOG */}
            {activeTab === "catalog" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
                  <div>
                    <h1 className={`text-2xl font-black tracking-tight flex items-center gap-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                      <Smartphone className="w-6 h-6 text-[#E60000]" />
                      Manage SIM Packages &amp; Product Pricing
                    </h1>
                    <p className="text-xs font-semibold text-slate-400 mt-1">
                      Add new SIM cards, modify PKR prices, edit descriptions, or delete packages live on storefront.
                    </p>
                  </div>

                  <button
                    onClick={handleOpenAddProduct}
                    className="bg-[#E60000] hover:bg-[#CC0000] text-white text-xs font-extrabold px-6 py-3 rounded-full transition-all shadow-md shadow-red-600/20 flex items-center gap-2 cursor-pointer uppercase tracking-wider shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New SIM Package</span>
                  </button>
                </div>

                {/* SIM Packages Catalog Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {products.map((prod) => (
                    <div
                      key={prod.id}
                      className={`border rounded-3xl p-5 shadow-2xs flex flex-col justify-between space-y-4 hover:border-red-500 transition-all relative overflow-hidden ${
                        isDarkMode ? "bg-[#1F2937] border-slate-800 text-white" : "bg-white border-slate-200/80 text-slate-900"
                      }`}
                    >


                      <div className="space-y-3">
                        <div className={`w-16 h-16 rounded-2xl relative overflow-hidden border shrink-0 ${
                          isDarkMode ? "bg-slate-800 border-slate-700" : "bg-slate-100 border-slate-200"
                        }`}>
                          <Image
                            src={prod.image}
                            alt={prod.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#E60000] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200 inline-block">
                            {prod.category}
                          </span>
                          <h3 className={`text-base font-black mt-1.5 leading-snug ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                            {prod.name}
                          </h3>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                            {prod.description}
                          </p>
                        </div>
                      </div>

                      <div className={`pt-3 border-t space-y-3 ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}>
                        <div className="flex items-baseline gap-2">
                          <span className={`text-2xl font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                            Rs. {prod.price.toLocaleString()}
                          </span>
                          {prod.originalPrice > prod.price && (
                            <span className="text-xs text-slate-400 line-through font-semibold">
                              Rs. {prod.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-1">
                          <button
                            onClick={() => handleOpenEditProduct(prod)}
                            className={`flex-1 font-bold text-xs py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              isDarkMode ? "bg-slate-800 hover:bg-slate-700 text-slate-200" : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                            }`}
                          >
                            <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                            <span>Edit Package</span>
                          </button>

                          <button
                            onClick={() => handleDeleteProduct(prod.id, prod.name)}
                            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl transition-all cursor-pointer"
                            title="Delete SIM Package"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 2: MASTER SIM ORDERS PIPELINE */}
            {(activeTab === "orders" || activeTab === "pending" || activeTab === "dispatched" || activeTab === "delivered") && (
              /* VIEW B: PROFESSIONAL ALL SIM ORDERS WORKSPACE */
              <div className="space-y-6 font-sans">
                {/* Header & Filter Controls Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
                  <div>
                    <h1 className={`text-2xl font-black tracking-tight flex items-center gap-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                      <ShoppingBag className="w-6 h-6 text-[#E60000]" />
                      Master SIM Orders Pipeline
                    </h1>
                    <p className="text-xs font-semibold text-slate-400 mt-1">
                      Search, verify WhatsApp COD details, track order dispatches, and export reports.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={handleExportCSV}
                      className={`border text-xs font-extrabold px-5 py-2.5 rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                        isDarkMode ? "border-slate-700 hover:bg-slate-800 text-slate-200" : "border-slate-700 hover:bg-slate-100 text-slate-800"
                      }`}
                    >
                      <Download className="w-4 h-4 text-slate-400" />
                      <span>Export CSV</span>
                    </button>

                    <button
                      onClick={() => alert("Redirecting to create manual SIM order...")}
                      className="bg-[#E60000] hover:bg-[#CC0000] text-white text-xs font-extrabold px-5 py-2.5 rounded-full transition-all shadow-md shadow-red-600/20 flex items-center gap-2 cursor-pointer uppercase tracking-wider"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Manual Order</span>
                    </button>
                  </div>
                </div>

                {/* Status Filter Tab Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {[
                    { id: "orders", label: "All Orders", count: orders.length, color: "bg-slate-900 text-white" },
                    { id: "pending", label: "Pending Verification", count: pendingCount, color: "bg-amber-100 text-amber-800 border-amber-200" },
                    { id: "dispatched", label: "Courier In-Transit", count: dispatchedCount, color: "bg-blue-100 text-blue-800 border-blue-200" },
                    { id: "delivered", label: "Delivered & Completed", count: deliveredCount, color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 border ${activeTab === tab.id
                          ? "bg-[#E60000] text-white border-[#E60000] shadow-md shadow-red-600/20"
                          : isDarkMode
                            ? "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                            : "bg-white text-slate-600 border-slate-200/80 hover:bg-slate-100"
                        }`}
                    >
                      <span>{tab.label}</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${activeTab === tab.id ? "bg-white text-[#E60000]" : tab.color}`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Master Orders Table Card */}
                <div className={`border rounded-3xl overflow-hidden shadow-2xs ${
                  isDarkMode ? "bg-[#1F2937] border-slate-800 text-white" : "bg-white border-slate-200/80 text-slate-900"
                }`}>
                  {filteredOrders.length === 0 ? (
                    <div className="text-center py-12 px-4 space-y-3">
                      <ShoppingBag className="w-10 h-10 text-slate-400 mx-auto" />
                      <h4 className={`text-sm font-black ${isDarkMode ? "text-white" : "text-slate-700"}`}>No SIM orders found</h4>
                      <p className="text-xs text-slate-400">Try adjusting your search query or status filter tabs.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-sans border-collapse">
                        <thead>
                          <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10.5px] font-black uppercase tracking-wider text-slate-400">
                            <th className="py-3.5 px-4">Order ID &amp; Date</th>
                            <th className="py-3.5 px-4">Customer &amp; Contact</th>
                            <th className="py-3.5 px-4">SIM Package</th>
                            <th className="py-3.5 px-4">Amount &amp; Payment</th>
                            <th className="py-3.5 px-4">Delivery Status</th>
                            <th className="py-3.5 px-4 text-right">Quick Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredOrders.map((order) => (
                            <tr
                              key={order.id}
                              className="hover:bg-slate-50/60 transition-colors group cursor-pointer"
                              onClick={() => setSelectedOrderDetails(order)}
                            >
                              {/* Order ID & Date */}
                              <td className="py-4 px-4 align-middle">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-black text-slate-900 text-xs">
                                    #{order.id}
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCopyId(order.id);
                                    }}
                                    className="p-1 text-slate-400 hover:text-slate-700 rounded-md transition-all cursor-pointer"
                                    title="Copy Order ID"
                                  >
                                    {copiedId === order.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                  </button>
                                </div>
                                <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">
                                  {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                </span>
                              </td>

                              {/* Customer & Contact */}
                              <td className="py-4 px-4 align-middle">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-red-100 text-[#E60000] font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                                    {order.customerName.charAt(0)}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="font-bold text-slate-900 truncate text-xs">{order.customerName}</div>
                                    <div className="text-[10.5px] font-semibold text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                                      <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                                      <span>{order.phone}</span>
                                      <span className="text-slate-300">•</span>
                                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                      <span>{order.city}</span>
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* SIM Package */}
                              <td className="py-4 px-4 align-middle">
                                {order.items && order.items.length > 0 ? (
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 relative overflow-hidden border border-slate-200/60 shrink-0">
                                      <Image src={order.items[0].image} alt={order.items[0].name} fill className="object-cover" />
                                    </div>
                                    <div className="min-w-0">
                                      <div className="font-bold text-slate-900 truncate max-w-[180px] text-xs">
                                        {order.items[0].name}
                                      </div>
                                      <span className="text-[10px] font-semibold text-slate-400">
                                        Qty: {order.items[0].qty} • {order.items[0].carrier}
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-slate-400 italic">No package details</span>
                                )}
                              </td>

                              {/* Amount & Payment */}
                              <td className="py-4 px-4 align-middle">
                                <div className="font-black text-slate-900 text-sm">
                                  Rs. {order.totalAmount.toLocaleString()}
                                </div>
                                <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block border border-emerald-200 mt-0.5">
                                  {order.paymentMethod}
                                </span>
                              </td>

                              {/* Delivery Status Dropdown */}
                              <td className="py-4 px-4 align-middle" onClick={(e) => e.stopPropagation()}>
                                <select
                                  value={order.status}
                                  onChange={(e) => handleStatusChange(order.id, e.target.value as Order["status"])}
                                  className={`text-xs font-extrabold px-3 py-1.5 rounded-full border cursor-pointer transition-all shadow-2xs ${order.status === "Pending"
                                      ? "bg-amber-50 text-amber-800 border-amber-300"
                                      : order.status === "Dispatched"
                                        ? "bg-blue-50 text-blue-800 border-blue-300"
                                        : order.status === "Delivered"
                                          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                          : "bg-rose-50 text-rose-800 border-rose-300"
                                    }`}
                                >
                                  <option value="Pending">Pending COD</option>
                                  <option value="Dispatched">Courier In-Transit</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </td>

                              {/* Quick Actions */}
                              <td className="py-4 px-4 align-middle text-right" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* WhatsApp Button */}
                                  <a
                                    href={`https://wa.me/92${order.phone.replace(/^0/, "")}?text=Hi%20${encodeURIComponent(order.customerName)},%20your%20Vodafone%20SIM%20order%20%23${order.id}%20status%20is%3A%20${order.status}.`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl transition-all cursor-pointer shadow-2xs"
                                    title="Verify on WhatsApp"
                                  >
                                    <MessageCircle className="w-4 h-4" />
                                  </a>

                                  {/* View Order Modal Button */}
                                  <button
                                    onClick={() => setSelectedOrderDetails(order)}
                                    className="p-2 bg-slate-100 text-slate-700 hover:bg-slate-900 hover:text-white rounded-xl transition-all cursor-pointer shadow-2xs"
                                    title="View Invoice & Slip"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>

                                  {/* Delete Order Button */}
                                  <button
                                    onClick={() => handleDeleteOrder(order.id)}
                                    className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-all cursor-pointer shadow-2xs"
                                    title="Delete Order"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* VIEW 3: MAIN OPERATIONAL DASHBOARD */}
            {(activeTab === "dashboard" || !activeTab) && (
              <div className="space-y-6">
                {/* Title Row + Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                      SIM Hub Console
                    </h1>
                    <p className="text-xs font-semibold text-slate-400 mt-1">
                      Live Cash on Delivery order pipeline, SIM inventory, &amp; dispatch tracking.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleOpenAddProduct}
                      className="bg-[#E60000] hover:bg-[#CC0000] text-white text-xs font-extrabold px-6 py-3 rounded-full transition-all shadow-md shadow-red-600/20 flex items-center gap-2 cursor-pointer uppercase tracking-wider"
                    >
                      <Plus className="w-4 h-4" />
                      <span>New SIM Order</span>
                    </button>

                    <button
                      onClick={handleExportCSV}
                      className="border border-slate-700 hover:bg-slate-100 text-slate-800 text-xs font-extrabold px-6 py-3 rounded-full transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-slate-600" />
                      <span>Export SIM Orders</span>
                    </button>
                  </div>
                </div>

                {/* ================= 4 REAL SIM HUB METRIC CARDS ================= */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {/* Card 1: Total SIM Orders */}
                  <div className="bg-[#E60000] text-white p-6 rounded-3xl shadow-xl space-y-4 relative overflow-hidden flex flex-col justify-between h-[180px]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white/90 uppercase tracking-wider">
                        Total SIM Orders
                      </span>
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-4xl font-black">{orders.length}</div>
                    <div>
                      <span className="text-[10px] font-bold bg-white/20 px-2.5 py-1 rounded-full inline-block">
                        ↑ +18% COD Orders this week
                      </span>
                    </div>
                  </div>

                  {/* Card 2: Total Sales Revenue */}
                  <div className={`border p-6 rounded-3xl shadow-2xs space-y-4 flex flex-col justify-between h-[180px] transition-colors duration-300 ${
                    isDarkMode ? "bg-[#1F2937] border-slate-800 text-white" : "bg-white border-slate-200/80 text-slate-900"
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Total Revenue
                      </span>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                        isDarkMode ? "bg-slate-800 text-slate-300 border-slate-700" : "bg-slate-100 text-slate-700 border-slate-200/60"
                      }`}>
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                    <div className={`text-3xl font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                      Rs. {totalRevenue.toLocaleString()}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full inline-block border border-emerald-200">
                        ↑ Gross Cash on Delivery Value
                      </span>
                    </div>
                  </div>

                  {/* Card 3: Courier In-Transit */}
                  <div className={`border p-6 rounded-3xl shadow-2xs space-y-4 flex flex-col justify-between h-[180px] transition-colors duration-300 ${
                    isDarkMode ? "bg-[#1F2937] border-slate-800 text-white" : "bg-white border-slate-200/80 text-slate-900"
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        In-Transit COD
                      </span>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                        isDarkMode ? "bg-slate-800 text-slate-300 border-slate-700" : "bg-slate-100 text-slate-700 border-slate-200/60"
                      }`}>
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                    <div className={`text-3xl font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>{dispatchedCount}</div>
                    <div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full inline-block border ${
                        isDarkMode ? "bg-slate-800 text-slate-300 border-slate-700" : "bg-slate-100 text-slate-500 border-slate-200/60"
                      }`}>
                        Leopard &amp; TCS Dispatched
                      </span>
                    </div>
                  </div>

                  {/* Card 4: Pending Verification */}
                  <div className={`border p-6 rounded-3xl shadow-2xs space-y-4 flex flex-col justify-between h-[180px] transition-colors duration-300 ${
                    isDarkMode ? "bg-[#1F2937] border-slate-800 text-white" : "bg-white border-slate-200/80 text-slate-900"
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Pending Verification
                      </span>
                      <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-700 border border-amber-200/60">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-amber-500">{pendingCount}</div>
                    <div>
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full inline-block border border-amber-200">
                        WhatsApp Verification Needed
                      </span>
                    </div>
                  </div>
                </div>

                {/* ================= MIDDLE GRID (ANALYTICS + COURIER CUTOFF + POPULAR SIMS) ================= */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                  {/* Column 1: Project Analytics (5.5 Cols) Modern Sleek Bar Chart */}
                  <div className={`lg:col-span-5 p-6 rounded-3xl border shadow-2xs flex flex-col justify-between h-[260px] font-sans transition-colors duration-300 ${
                    isDarkMode ? "bg-[#1F2937] border-slate-800 text-white" : "bg-white border-slate-200/80 text-slate-900"
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className={`text-base font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>Project Analytics</h3>
                        <p className="text-[10.5px] font-semibold text-slate-400">Weekly SIM order dispatch volume</p>
                      </div>
                      <span className="text-[10px] font-extrabold text-[#E60000] bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                        ↑ {weeklyAnalyticsData.growthText}
                      </span>
                    </div>

                    {/* Modern Sleek Capsule Bar Chart */}
                    <div className="relative h-40 pt-6 pb-1 px-1">
                      {/* Background Subtle Gridlines */}
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6 pt-6">
                        <div className={`border-b w-full ${isDarkMode ? "border-slate-800" : "border-slate-100"}`} />
                        <div className={`border-b w-full ${isDarkMode ? "border-slate-800" : "border-slate-100"}`} />
                        <div className={`border-b w-full ${isDarkMode ? "border-slate-800" : "border-slate-100"}`} />
                      </div>

                      <div className="flex items-end justify-between gap-3 h-full relative z-10">
                        {weeklyAnalyticsData.items.map((bar, i) => {
                          const isActive = activeAnalyticsDay === i;
                          return (
                            <div
                              key={i}
                              onMouseEnter={() => setActiveAnalyticsDay(i)}
                              onClick={() => setActiveAnalyticsDay(i)}
                              className="flex flex-col items-center gap-2 flex-1 h-full justify-end relative group cursor-pointer"
                            >
                              {/* Dynamic Floating Tooltip Badge */}
                              {isActive && (
                                <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex flex-col items-center z-20 transition-all duration-200">
                                  <div className="bg-slate-900 text-white shadow-lg text-[9.5px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 border border-slate-800 whitespace-nowrap">
                                    {bar.val}%
                                  </div>
                                  <div className="w-1.5 h-1.5 rounded-full bg-slate-900 -mt-0.5" />
                                </div>
                              )}

                              {/* Sleek Pill Bar */}
                              <div
                                style={{ height: `${bar.val}%` }}
                                className={`w-full rounded-2xl transition-all duration-300 cursor-pointer ${bar.colorClass} ${
                                  isActive ? "ring-2 ring-[#E60000] ring-offset-2 ring-offset-white dark:ring-offset-slate-900 scale-105" : ""
                                }`}
                                title={`${bar.label}: ${bar.count > 0 ? `${bar.count} Orders (` : ""}${bar.val}% volume${bar.count > 0 ? ")" : ""}`}
                              />

                              {/* Day Label */}
                              <span className={`text-xs font-black transition-colors ${
                                isActive ? "text-[#E60000]" : "text-slate-400 group-hover:text-red-500"
                              }`}>
                                {bar.day}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Daily Sales Target & Order Operations Hub Card (3 Cols) */}
                  <div className={`lg:col-span-3 p-5 sm:p-6 rounded-3xl border shadow-2xs flex flex-col justify-between h-[260px] font-sans transition-colors duration-300 ${
                    isDarkMode ? "bg-[#1F2937] border-slate-800 text-white" : "bg-white border-slate-200/80 text-slate-900"
                  }`}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          DAILY SALES TARGET
                        </span>
                        <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {orders.length >= 10 ? "Goal Reached!" : "80% Target Met"}
                        </span>
                      </div>

                      <div>
                        <h4 className={`text-base font-black leading-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                          Daily Order Pipeline
                        </h4>
                        <p className="text-xs font-semibold text-slate-400 mt-1">
                          <strong className={isDarkMode ? "text-white" : "text-slate-900"}>{orders.length} / 10 SIM Orders</strong> Placed Today
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className={`border p-3 rounded-2xl space-y-1.5 ${
                      isDarkMode ? "bg-slate-800/80 border-slate-700" : "bg-slate-50 border-slate-200/80"
                    }`}>
                      <div className={`flex justify-between text-[11px] font-bold ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                        <span>Daily Target Progress</span>
                        <span className="text-[#E60000]">{Math.min(100, Math.round((orders.length / 10) * 100))}%</span>
                      </div>
                      <div className={`w-full h-2.5 rounded-full overflow-hidden ${isDarkMode ? "bg-slate-700" : "bg-slate-200"}`}>
                        <div
                          style={{ width: `${Math.min(100, Math.round((orders.length / 10) * 100))}%` }}
                          className="h-full bg-gradient-to-r from-[#E60000] to-[#CC0000] rounded-full transition-all duration-500"
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={handleOpenAddProduct}
                      className="w-full bg-[#E60000] hover:bg-[#CC0000] text-white text-xs font-extrabold py-3.5 rounded-full transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-red-600/20 uppercase tracking-wider"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New SIM Package</span>
                    </button>
                  </div>

                  {/* Column 3: Popular SIM Packages Catalog & Rankings (4 Cols) */}
                  <div className={`lg:col-span-4 p-6 rounded-3xl border shadow-2xs flex flex-col justify-between h-[260px] transition-colors duration-300 ${
                    isDarkMode ? "bg-[#1F2937] border-slate-800 text-white" : "bg-white border-slate-200/80 text-slate-900"
                  }`}>
                    <div className="flex items-center justify-between pb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <h3 className={`text-sm font-black truncate ${isDarkMode ? "text-white" : "text-slate-900"}`}>Popular SIM Packages</h3>
                        {/* Filter Switcher */}
                        <div className={`flex items-center p-0.5 rounded-full text-[9px] font-extrabold shrink-0 ${
                          isDarkMode ? "bg-slate-800" : "bg-slate-100"
                        }`}>
                          <button
                            onClick={() => setRankFilter("all")}
                            className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                              rankFilter === "all" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-400 hover:text-white"
                            }`}
                          >
                            All
                          </button>
                          <button
                            onClick={() => setRankFilter("sales")}
                            className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                              rankFilter === "sales" ? "bg-[#E60000] text-white shadow-2xs" : "text-slate-400 hover:text-white"
                            }`}
                          >
                            Top Sold
                          </button>
                          <button
                            onClick={() => setRankFilter("demand")}
                            className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                              rankFilter === "demand" ? "bg-[#E60000] text-white shadow-2xs" : "text-slate-400 hover:text-white"
                            }`}
                          >
                            Demand
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveTab("catalog")}
                        className={`border text-[10px] font-bold px-3 py-1 rounded-full cursor-pointer transition-colors shrink-0 ml-1 ${
                          isDarkMode ? "border-slate-700 hover:bg-slate-800 text-slate-300" : "border-slate-300 hover:bg-slate-100 text-slate-700"
                        }`}
                      >
                        + Manage
                      </button>
                    </div>

                    {/* Product List with Invisible Scrollbar (Top 3 SIM Packages) */}
                    <div className="space-y-2 text-xs overflow-y-auto max-h-[185px] pr-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                      {rankedProducts.slice(0, 3).map((prod) => (
                        <div
                          key={prod.id}
                          onClick={() => setSelectedAnalyticsProductId(prod.id)}
                          className={`flex items-center justify-between gap-2 p-2 rounded-2xl transition-all border cursor-pointer group shadow-2xs ${
                            isDarkMode
                              ? "bg-slate-800/80 border-slate-700/80 hover:bg-slate-700/80 text-white"
                              : "bg-white border-slate-100 hover:bg-red-50/50 hover:border-red-200/80 text-slate-900"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {/* Theme-aligned Vodafone Rank Badge */}
                            <div
                              className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-[11px] shrink-0 transition-transform group-hover:scale-105 ${
                                prod.rank === 1
                                  ? "bg-[#E60000] text-white shadow-xs shadow-red-600/30"
                                  : prod.rank === 2
                                  ? "bg-red-100 text-[#E60000] border border-red-200/60 font-extrabold"
                                  : "bg-slate-800 text-slate-300 font-extrabold"
                              }`}
                            >
                              {prod.rank}
                            </div>

                            {/* Product Avatar / Initial */}
                            <div className="w-7 h-7 rounded-lg bg-red-100/80 text-[#E60000] flex items-center justify-center font-black text-xs shrink-0 overflow-hidden relative border border-red-200/50">
                              {prod.image ? (
                                <Image src={prod.image} alt={prod.name} width={28} height={28} className="w-full h-full object-cover" />
                              ) : (
                                prod.name.charAt(0)
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <h4 className={`font-extrabold truncate leading-tight group-hover:text-[#E60000] transition-colors ${
                                isDarkMode ? "text-white" : "text-slate-900"
                              }`}>
                                {prod.name}
                              </h4>
                              <p className="text-[10px] text-slate-400 font-semibold truncate">
                                Rs. {prod.price.toLocaleString()} • {prod.category}
                              </p>
                            </div>
                          </div>

                          {/* Dynamic Metric Badges */}
                          <div className="flex items-center gap-1.5 shrink-0 text-[10px]">
                            {prod.isTopSeller && (
                              <span className="bg-[#E60000] text-white font-extrabold px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wide shadow-2xs">
                                Selling Most
                              </span>
                            )}
                            {!prod.isTopSeller && prod.isHighestDemand && (
                              <span className="bg-red-50 text-[#E60000] border border-red-200 font-extrabold px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wide">
                                High Demand
                              </span>
                            )}

                            <div className="text-right leading-tight">
                              <span className={`font-black block text-[11px] ${isDarkMode ? "text-white" : "text-slate-900"}`}>{prod.soldCount} Sold</span>
                              <span className="text-[9px] font-extrabold text-red-500">{prod.demandScore}% Demand</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* ================= BOTTOM GRID (CUSTOMER SIM ORDERS + FULFILLMENT + COURIER TIMER) ================= */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">

                  {/* Column 1: Live Customer Orders & COD Table (5.5 Cols) */}
                  <div className={`lg:col-span-5 p-6 rounded-3xl border shadow-2xs flex flex-col justify-between h-[260px] font-sans transition-colors duration-300 ${
                    isDarkMode ? "bg-[#1F2937] border-slate-800 text-white" : "bg-white border-slate-200/80 text-slate-900"
                  }`}>
                    <div className="flex items-center justify-between pb-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`text-base font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>Live Customer SIM Orders</h3>
                        <span className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                        </span>
                      </div>
                      <button
                        onClick={() => setActiveTab("orders")}
                        className="text-xs font-bold text-slate-400 hover:text-[#E60000] transition-colors cursor-pointer"
                      >
                        View All ({orders.length}) →
                      </button>
                    </div>

                    <div className="space-y-2 overflow-y-auto max-h-[185px] pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                      {filteredOrders.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 text-xs font-semibold">
                          No active SIM orders found.
                        </div>
                      ) : (
                        filteredOrders.map((order) => (
                          <div
                            key={order.id}
                            onClick={() => setSelectedOrderDetails(order)}
                            className={`p-2.5 rounded-2xl border flex items-center justify-between gap-3 text-xs transition-all cursor-pointer group shadow-2xs ${
                              isDarkMode
                                ? "bg-slate-800/80 border-slate-700/80 hover:bg-slate-700/80 text-white"
                                : "bg-slate-50/80 hover:bg-red-50/40 border-slate-200/80 text-slate-900"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {/* Styled Avatar Badge */}
                              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-[#E60000] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                                {order.customerName.charAt(0)}
                              </div>
                              <div className="min-w-0">
                                <div className={`font-extrabold truncate text-xs group-hover:text-[#E60000] transition-colors ${
                                  isDarkMode ? "text-white" : "text-slate-900"
                                }`}>
                                  {order.customerName}
                                </div>
                                <p className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">
                                  #{order.id} • {order.city} • <span className="font-mono text-slate-400">{order.phone}</span>
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                              {/* Dynamically Styled Status Selector */}
                              <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.id, e.target.value as Order["status"])}
                                className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border cursor-pointer transition-all shadow-2xs ${
                                  order.status === "Pending"
                                    ? "bg-amber-50 text-amber-800 border-amber-300"
                                    : order.status === "Dispatched"
                                    ? "bg-blue-50 text-blue-800 border-blue-300"
                                    : "bg-emerald-50 text-emerald-800 border-emerald-300"
                                }`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Dispatched">Dispatched</option>
                                <option value="Delivered">Delivered</option>
                              </select>

                              {/* Premium WhatsApp Action Icon */}
                              <a
                                href={`https://wa.me/92${order.phone.replace(/^0/, "")}?text=Hi%20${encodeURIComponent(order.customerName)},%20your%20Vodafone%20SIM%20order%20%23${order.id}%20is%20${order.status}!`}
                                target="_blank"
                                rel="noreferrer"
                                className="w-7 h-7 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center cursor-pointer shadow-xs transition-all hover:scale-105"
                                title="Chat on WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                              </a>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Column 2: Order Fulfillment Arc Gauge (3 Cols) */}
                  <div className={`lg:col-span-3 p-6 rounded-3xl border shadow-2xs flex flex-col justify-between text-left h-[260px] font-sans transition-colors duration-300 ${
                    isDarkMode ? "bg-[#1F2937] border-slate-800 text-white" : "bg-white border-slate-200/80 text-slate-900"
                  }`}>
                    <div className="flex items-center justify-between">
                      <h3 className={`text-base font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>Order Fulfillment</h3>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                        isDarkMode ? "bg-slate-800 text-slate-300 border-slate-700" : "bg-slate-100 text-slate-500 border-slate-200/80"
                      }`}>
                        {totalOrdersCount} Total Orders
                      </span>
                    </div>

                    {/* 100% Dynamic Multi-Segment SVG Semi-Circle Arc Gauge */}
                    <div className="relative w-48 h-24 mx-auto flex items-end justify-center my-1">
                      <svg className="w-48 h-24 overflow-visible" viewBox="0 0 200 100">
                        {/* Background Base Arc Track */}
                        <path
                          d="M 20 90 A 80 80 0 0 1 180 90"
                          fill="none"
                          stroke="#F1F5F9"
                          strokeWidth="20"
                          strokeLinecap="round"
                        />

                        {/* Segment 3: Pending COD (Amber #F59E0B) */}
                        {pendArcLen > 0 && (
                          <path
                            d="M 20 90 A 80 80 0 0 1 180 90"
                            fill="none"
                            stroke="#F59E0B"
                            strokeWidth="20"
                            strokeLinecap="round"
                            strokeDasharray={`${pendArcLen} ${gaugeArcLength}`}
                            strokeDashoffset={-(delArcLen + dispArcLen)}
                            className="transition-all duration-700 ease-out"
                          />
                        )}

                        {/* Segment 2: In-Transit (Blue #3B82F6) */}
                        {dispArcLen > 0 && (
                          <path
                            d="M 20 90 A 80 80 0 0 1 180 90"
                            fill="none"
                            stroke="#3B82F6"
                            strokeWidth="20"
                            strokeLinecap="round"
                            strokeDasharray={`${dispArcLen} ${gaugeArcLength}`}
                            strokeDashoffset={-delArcLen}
                            className="transition-all duration-700 ease-out"
                          />
                        )}

                        {/* Segment 1: Delivered (Brand Red #E60000) */}
                        {delArcLen > 0 && (
                          <path
                            d="M 20 90 A 80 80 0 0 1 180 90"
                            fill="none"
                            stroke="#E60000"
                            strokeWidth="20"
                            strokeLinecap="round"
                            strokeDasharray={`${delArcLen} ${gaugeArcLength}`}
                            strokeDashoffset={0}
                            className="transition-all duration-700 ease-out"
                          />
                        )}
                      </svg>

                      {/* Center Number & Dynamic Text */}
                      <div className="absolute bottom-0 text-center">
                        <span className={`text-3xl font-black block leading-none tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                          {deliveryPercentage}%
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 mt-1 block">
                          {deliveredCount} of {totalOrdersCount} Delivered
                        </span>
                      </div>
                    </div>

                    {/* Dynamic Legend Row with Real Live Order Counts */}
                    <div className={`flex items-center justify-between text-[10px] font-bold pt-2 border-t ${
                      isDarkMode ? "border-slate-800 text-slate-300" : "border-slate-100 text-slate-600"
                    }`}>
                      <span className="flex items-center gap-1.5" title={`${deliveredCount} Delivered (${deliveryPercentage}%)`}>
                        <span className="w-2.5 h-2.5 rounded-full bg-[#E60000] shrink-0 shadow-2xs" />
                        <span>Delivered</span>
                        <span className="text-slate-400 font-extrabold">({deliveredCount})</span>
                      </span>

                      <span className="flex items-center gap-1.5" title={`${dispatchedCount} In-Transit (${dispatchedPercentage}%)`}>
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0 shadow-2xs" />
                        <span>In-Transit</span>
                        <span className="text-slate-400 font-extrabold">({dispatchedCount})</span>
                      </span>

                      <span className="flex items-center gap-1.5" title={`${pendingCount} Pending (${pendingPercentage}%)`}>
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 shadow-2xs" />
                        <span>Pending</span>
                        <span className="text-slate-400 font-extrabold">({pendingCount})</span>
                      </span>
                    </div>
                  </div>

                  {/* Column 3: Dispatch Cutoff Countdown Timer (4 Cols) */}
                  <div className="lg:col-span-4 bg-gradient-to-br from-[#0D0203] via-[#1A0305] to-[#280407] p-6 rounded-3xl text-white flex flex-col justify-between h-[260px] shadow-xl border border-red-950/60 relative overflow-hidden">

                    {/* 3D Abstract Wave Curve Overlay */}
                    <div className="absolute inset-0 opacity-50 pointer-events-none overflow-hidden">
                      <svg className="w-full h-full" viewBox="0 0 300 200" preserveAspectRatio="none">
                        <path
                          d="M-40,80 C60,-20 160,180 260,30 C360,-80 460,160 560,80 L560,300 L-40,300 Z"
                          fill="url(#redWave1)"
                        />
                        <path
                          d="M-40,120 C80,20 180,220 280,60 C380,-60 480,180 580,120 L580,300 L-40,300 Z"
                          fill="url(#redWave2)"
                          opacity="0.7"
                        />
                        <defs>
                          <linearGradient id="redWave1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#E60000" />
                            <stop offset="50%" stopColor="#880000" />
                            <stop offset="100%" stopColor="#2A0000" />
                          </linearGradient>
                          <linearGradient id="redWave2" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FF3333" />
                            <stop offset="100%" stopColor="#0D0203" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>

                    {/* Title */}
                    <span className="text-xs font-bold text-white/90 block relative z-10">
                      Courier Dispatch Cutoff Timer
                    </span>

                    {/* Big Clock Counter */}
                    <div className="text-4xl sm:text-5xl font-black font-mono tracking-wider py-1 text-center relative z-10 text-white drop-shadow-md">
                      {formatTimer(timerSeconds)}
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-4 pt-1 relative z-10">
                      <button
                        onClick={() => setTimerRunning(!timerRunning)}
                        className="w-12 h-12 rounded-full bg-white text-[#E60000] flex items-center justify-center hover:scale-105 transition-transform cursor-pointer shadow-lg"
                        title={timerRunning ? "Pause Countdown" : "Resume Countdown"}
                      >
                        {timerRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                      </button>

                      <button
                        onClick={() => {
                          setTimerRunning(false);
                          setTimerSeconds(5048);
                        }}
                        className="w-12 h-12 rounded-full bg-[#E60000] text-[#E60000] flex items-center justify-center hover:scale-105 transition-transform cursor-pointer shadow-lg border border-red-400/40"
                        title="Reset Countdown"
                      >
                        <Square className="w-4 h-4 fill-current text-white" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* VIEW 4: ULTRA-EXECUTIVE ADMIN PROFILE VIEW */}
            {activeTab === "profile" && (
              <div className="space-y-6 font-sans animate-in fade-in duration-300">
                {/* Dynamic Executive Hero Banner Card */}
                <div className={`relative rounded-3xl overflow-hidden p-6 sm:p-8 text-white shadow-xl border bg-cover bg-center ${
                  profileCoverUrl === "dark_mesh"
                    ? "bg-gradient-to-r from-[#0F172A] via-[#1E1B4B] to-[#0F172A] border-slate-700"
                    : profileCoverUrl === "cyber_dots"
                      ? "bg-gradient-to-r from-[#18181B] via-[#27272A] to-[#09090B] border-slate-800"
                      : profileCoverUrl && (profileCoverUrl.startsWith("http") || profileCoverUrl.startsWith("data:image"))
                        ? "border-slate-800"
                        : "bg-gradient-to-r from-[#500000] via-[#E60000] to-[#800000] border-red-900/40"
                }`} style={profileCoverUrl && (profileCoverUrl.startsWith("http") || profileCoverUrl.startsWith("data:image")) ? { backgroundImage: `url("${profileCoverUrl}")` } : {}}>
                  {/* Dark overlay for image covers */}
                  {profileCoverUrl && (profileCoverUrl.startsWith("http") || profileCoverUrl.startsWith("data:image")) && (
                    <div className="absolute inset-0 bg-black/50 pointer-events-none" />
                  )}
                  
                  {/* Background Ambient Glow */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/15 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <div className="relative shrink-0">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white text-[#E60000] font-black text-3xl sm:text-4xl flex items-center justify-center shadow-2xl border-4 border-white/20 relative overflow-hidden">
                          {profileAvatarUrl ? (
                            <img src={profileAvatarUrl} alt={profileName} className="w-full h-full object-cover" />
                          ) : (
                            profileName.charAt(0) || "V"
                          )}
                        </div>
                        <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-400 border-4 border-[#800000] shadow-sm animate-pulse" title="Online Active Session" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">{profileName}</h1>
                        </div>
                        <p className="text-xs sm:text-sm text-red-100 font-semibold">{profileTitle}</p>
                        <div className="flex flex-wrap items-center gap-2.5 pt-1.5">
                          <div className="bg-black/40 backdrop-blur-md border border-white/30 text-white text-xs font-semibold px-3.5 py-1 rounded-full flex items-center gap-2 shadow-sm">
                            <Mail className="w-3.5 h-3.5 text-[#E60000] shrink-0" />
                            <span>{loginEmail || "agha.irtiza.rizvi@gmail.com"}</span>
                          </div>
                          <div className="bg-emerald-500/20 backdrop-blur-md border border-emerald-400/40 text-emerald-300 text-[11px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Super Admin Access</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {profileInfoSuccess && (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center justify-between animate-in fade-in">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{profileInfoSuccess}</span>
                    </div>
                    <button onClick={() => setProfileInfoSuccess("")} className="text-emerald-500 hover:text-emerald-300 font-bold text-xs">Dismiss</button>
                  </div>
                )}

                {/* 2 Column Main Profile Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column (1 Span): Personal Identity Info & Customization Form */}
                  <div className={`p-6 rounded-3xl border space-y-5 transition-colors duration-300 ${
                    isDarkMode ? "bg-[#1F2937] border-slate-800 text-white" : "bg-white border-slate-200/80 text-slate-900 shadow-2xs"
                  }`}>
                    <h3 className={`text-sm font-black flex items-center gap-2 border-b pb-3 ${isDarkMode ? "border-slate-700/60 text-white" : "border-slate-100 text-slate-900"}`}>
                      <Users className="w-4 h-4 text-[#E60000]" />
                      Personal Identity &amp; Branding
                    </h3>

                    <form onSubmit={handleSaveProfileInfo} className="space-y-4 text-xs font-sans">
                      <div>
                        <label className={`block text-[11px] font-extrabold uppercase tracking-wider mb-1.5 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          className={`w-full border rounded-2xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-[#E60000] ${
                            isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                          }`}
                        />
                      </div>

                      <div>
                        <label className={`block text-[11px] font-extrabold uppercase tracking-wider mb-1.5 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                          Executive Title / Designation
                        </label>
                        <input
                          type="text"
                          required
                          value={profileTitle}
                          onChange={(e) => setProfileTitle(e.target.value)}
                          className={`w-full border rounded-2xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-[#E60000] ${
                            isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                          }`}
                        />
                      </div>

                      <div>
                        <label className={`block text-[11px] font-extrabold uppercase tracking-wider mb-1.5 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                          Upload Profile Avatar Photo (From Device)
                        </label>
                        <div className="flex items-center gap-2">
                          <label className={`flex-1 border-2 border-dashed rounded-2xl p-3 flex items-center justify-center gap-2 cursor-pointer transition-all ${
                            isDarkMode ? "bg-slate-800/80 border-slate-700 hover:border-[#E60000] text-slate-300" : "bg-slate-50 border-slate-300 hover:border-[#E60000] text-slate-700"
                          }`}>
                            <Upload className="w-4 h-4 text-[#E60000]" />
                            <span className="text-xs font-bold truncate">{profileAvatarUrl ? "Change Uploaded Avatar" : "Choose File from System"}</span>
                            <input type="file" accept="image/*" onChange={handleAvatarFileUpload} className="hidden" />
                          </label>
                          {profileAvatarUrl && (
                            <button
                              type="button"
                              onClick={() => setProfileAvatarUrl("")}
                              className="px-3 py-3 text-xs font-extrabold text-rose-500 hover:bg-rose-500/10 rounded-2xl border border-rose-500/20"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className={`block text-[11px] font-extrabold uppercase tracking-wider mb-1.5 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                          Upload Banner Cover Photo (From Device)
                        </label>
                        <div className="space-y-2">
                          <label className={`w-full border-2 border-dashed rounded-2xl p-3 flex items-center justify-center gap-2 cursor-pointer transition-all ${
                            isDarkMode ? "bg-slate-800/80 border-slate-700 hover:border-[#E60000] text-slate-300" : "bg-slate-50 border-slate-300 hover:border-[#E60000] text-slate-700"
                          }`}>
                            <Upload className="w-4 h-4 text-[#E60000]" />
                            <span className="text-xs font-bold truncate">{profileCoverUrl && profileCoverUrl.startsWith("data:image") ? "Change Uploaded Banner" : "Choose Banner File from System"}</span>
                            <input type="file" accept="image/*" onChange={handleCoverFileUpload} className="hidden" />
                          </label>

                          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                            <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">Presets:</span>
                            <button
                              type="button"
                              onClick={() => setProfileCoverUrl("red_gradient")}
                              className={`text-[10px] px-2.5 py-1 rounded-full font-extrabold border transition-all ${
                                profileCoverUrl === "red_gradient" ? "bg-[#E60000] text-white border-red-600" : isDarkMode ? "bg-slate-800 border-slate-700 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-600"
                              }`}
                            >
                              Vodafone Red
                            </button>
                            <button
                              type="button"
                              onClick={() => setProfileCoverUrl("dark_mesh")}
                              className={`text-[10px] px-2.5 py-1 rounded-full font-extrabold border transition-all ${
                                profileCoverUrl === "dark_mesh" ? "bg-indigo-900 text-white border-indigo-700" : isDarkMode ? "bg-slate-800 border-slate-700 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-600"
                              }`}
                            >
                              Midnight Mesh
                            </button>
                            <button
                              type="button"
                              onClick={() => setProfileCoverUrl("cyber_dots")}
                              className={`text-[10px] px-2.5 py-1 rounded-full font-extrabold border transition-all ${
                                profileCoverUrl === "cyber_dots" ? "bg-zinc-800 text-white border-zinc-600" : isDarkMode ? "bg-slate-800 border-slate-700 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-600"
                              }`}
                            >
                              Obsidian Dark
                            </button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className={`block text-[11px] font-extrabold uppercase tracking-wider mb-1.5 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                          Helpline Phone Number
                        </label>
                        <input
                          type="text"
                          value={profilePhone}
                          onChange={(e) => setProfilePhone(e.target.value)}
                          className={`w-full border rounded-2xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-[#E60000] ${
                            isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                          }`}
                        />
                      </div>

                      <div>
                        <label className={`block text-[11px] font-extrabold uppercase tracking-wider mb-1.5 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                          Regional Office Hub Location
                        </label>
                        <input
                          type="text"
                          value={profileLocation}
                          onChange={(e) => setProfileLocation(e.target.value)}
                          className={`w-full border rounded-2xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-[#E60000] ${
                            isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                          }`}
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#E60000] hover:bg-[#CC0000] text-white text-xs font-extrabold py-3 rounded-full transition-all shadow-md shadow-red-600/20 uppercase tracking-wider cursor-pointer mt-2"
                      >
                        Save Profile Details &amp; Branding
                      </button>
                    </form>
                  </div>

                  {/* Right Column (2 Spans): Security Password & Session Log Cards */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Security & Password Card */}
                    <div className={`p-6 sm:p-7 rounded-3xl border space-y-5 transition-colors duration-300 ${
                      isDarkMode ? "bg-[#1F2937] border-slate-800 text-white" : "bg-white border-slate-200/80 text-slate-900 shadow-2xs"
                    }`}>
                      <div>
                        <h3 className={`text-base font-black flex items-center gap-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                          <Lock className="w-5 h-5 text-[#E60000]" />
                          Update Security Password
                        </h3>
                        <p className="text-xs text-slate-400 font-semibold mt-1">
                          Change your admin login password securely. Enter your current password to verify identity.
                        </p>
                      </div>

                      {profileUpdateStatus && (
                        <div className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in ${
                          profileUpdateStatus.type === "success" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                        }`}>
                          <ShieldCheck className="w-4 h-4 shrink-0" />
                          <span>{profileUpdateStatus.message}</span>
                        </div>
                      )}

                      <form onSubmit={handleProfilePasswordUpdate} className="space-y-4 max-w-lg">
                        <div>
                          <label className={`block text-xs font-extrabold uppercase tracking-wider mb-1.5 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                            Current Admin Password
                          </label>
                          <input
                            type="password"
                            required
                            placeholder="Enter current admin password..."
                            value={profileCurrentPass}
                            onChange={(e) => setProfileCurrentPass(e.target.value)}
                            className={`w-full border rounded-2xl px-4 py-3 text-xs font-medium focus:outline-none focus:border-[#E60000] ${
                              isDarkMode ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                            }`}
                          />
                        </div>

                        <div>
                          <label className={`block text-xs font-extrabold uppercase tracking-wider mb-1.5 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                            New Admin Password
                          </label>
                          <input
                            type="password"
                            required
                            placeholder="Enter new password (e.g. 123)"
                            value={profileNewPass}
                            onChange={(e) => setProfileNewPass(e.target.value)}
                            className={`w-full border rounded-2xl px-4 py-3 text-xs font-medium focus:outline-none focus:border-[#E60000] ${
                              isDarkMode ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                            }`}
                          />
                        </div>

                        <div>
                          <label className={`block text-xs font-extrabold uppercase tracking-wider mb-1.5 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            required
                            placeholder="Re-enter new password"
                            value={profileConfirmPass}
                            onChange={(e) => setProfileConfirmPass(e.target.value)}
                            className={`w-full border rounded-2xl px-4 py-3 text-xs font-medium focus:outline-none focus:border-[#E60000] ${
                              isDarkMode ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                            }`}
                          />
                        </div>

                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          <button
                            type="submit"
                            disabled={profileUpdating}
                            className="bg-[#E60000] hover:bg-[#CC0000] text-white text-xs font-extrabold px-6 py-3 rounded-full transition-all shadow-md shadow-red-600/20 uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-50"
                          >
                            {profileUpdating ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <Lock className="w-4 h-4" />
                                <span>Save Password Directly</span>
                              </>
                            )}
                          </button>

                        </div>
                      </form>
                    </div>

                    {/* Active Security Sessions Log Table */}
                    <div className={`p-6 rounded-3xl border space-y-4 ${
                      isDarkMode ? "bg-[#1F2937] border-slate-800 text-white" : "bg-white border-slate-200/80 text-slate-900 shadow-2xs"
                    }`}>
                      <h3 className={`text-sm font-black flex items-center gap-2 border-b pb-3 ${isDarkMode ? "border-slate-700/60 text-white" : "border-slate-100 text-slate-900"}`}>
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        Active Admin Session Logs &amp; Devices (Dynamic)
                      </h3>

                      <div className="space-y-2.5 text-xs font-sans">
                        {sessionLogs.map((log) => (
                          <div
                            key={log.id}
                            className={`p-3.5 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
                              log.current
                                ? isDarkMode ? "bg-slate-800/80 border-emerald-500/40" : "bg-slate-50 border-emerald-500/30"
                                : isDarkMode ? "bg-slate-800/40 border-slate-700/60" : "bg-slate-50/60 border-slate-200/60"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                                log.current ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-200/60 text-slate-500"
                              }`}>
                                {log.device.toLowerCase().includes("mobile") || log.device.toLowerCase().includes("iphone") ? (
                                  <Smartphone className="w-4 h-4" />
                                ) : (
                                  <Globe className="w-4 h-4" />
                                )}
                              </div>
                              <div>
                                <div className={`font-extrabold ${log.current ? (isDarkMode ? "text-white" : "text-slate-900") : (isDarkMode ? "text-slate-300" : "text-slate-700")}`}>
                                  {log.device}
                                </div>
                                <div className="text-[10px] text-slate-400 font-semibold mt-0.5">IP: {log.ip}</div>
                              </div>
                            </div>

                            {log.current ? (
                              <span className="text-[9.5px] font-black px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 uppercase tracking-wider">
                                Current Active Session
                              </span>
                            ) : (
                              <span className="text-[9.5px] font-extrabold text-slate-400">
                                {log.time}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 5: ULTRA-EXECUTIVE SYSTEM SETTINGS VIEW */}
            {activeTab === "settings" && (
              <div className="space-y-6 font-sans animate-in fade-in duration-300">
                {/* Header */}
                <div className="border-b border-slate-200/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className={`text-2xl font-black tracking-tight flex items-center gap-2.5 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                      <Settings className="w-6 h-6 text-[#E60000]" />
                      Enterprise System Settings
                    </h1>
                    <p className="text-xs font-semibold text-slate-400 mt-1">
                      Manage storefront parameters, COD delivery pricing, real-time sound alerts, and data backups.
                    </p>
                  </div>
                  
                  {/* Maintenance Mode Pill */}
                  <button
                    onClick={() => {
                      setMaintenanceMode(!maintenanceMode);
                      setSettingsToast(maintenanceMode ? "Maintenance Mode Disabled. Storefront is LIVE!" : "Maintenance Mode Enabled. Storefront is now paused!");
                      setTimeout(() => setSettingsToast(""), 4000);
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                      maintenanceMode ? "bg-amber-500 text-slate-950 shadow-md" : "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${maintenanceMode ? "bg-slate-950 animate-ping" : "bg-emerald-500 animate-pulse"}`} />
                    <span>{maintenanceMode ? "MAINTENANCE MODE ACTIVE" : "STOREFRONT LIVE"}</span>
                  </button>
                </div>

                {settingsToast && (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center justify-between animate-in fade-in">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{settingsToast}</span>
                    </div>
                    <button onClick={() => setSettingsToast("")} className="text-emerald-500 hover:text-emerald-300 font-bold text-xs">Dismiss</button>
                  </div>
                )}

                {/* Sub-Tabs Pills Selector */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200/60 scrollbar-none">
                  <button
                    onClick={() => setSettingsSubTab("general")}
                    className={`px-4 py-2.5 rounded-full text-xs transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                      settingsSubTab === "general"
                        ? "bg-[#E60000] text-white font-extrabold shadow-md shadow-red-600/20"
                        : isDarkMode ? "bg-slate-800 text-slate-300 font-bold hover:bg-slate-700" : "bg-white text-slate-700 font-bold hover:bg-slate-100 border border-slate-200/80"
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    <span>Storefront &amp; Contact</span>
                  </button>

                  <button
                    onClick={() => setSettingsSubTab("alerts")}
                    className={`px-4 py-2.5 rounded-full text-xs transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                      settingsSubTab === "alerts"
                        ? "bg-[#E60000] text-white font-extrabold shadow-md shadow-red-600/20"
                        : isDarkMode ? "bg-slate-800 text-slate-300 font-bold hover:bg-slate-700" : "bg-white text-slate-700 font-bold hover:bg-slate-100 border border-slate-200/80"
                    }`}
                  >
                    <Bell className="w-4 h-4" />
                    <span>Live Sound &amp; Alerts</span>
                  </button>

                  <button
                    onClick={() => setSettingsSubTab("backup")}
                    className={`px-4 py-2.5 rounded-full text-xs transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                      settingsSubTab === "backup"
                        ? "bg-[#E60000] text-white font-extrabold shadow-md shadow-red-600/20"
                        : isDarkMode ? "bg-slate-800 text-slate-300 font-bold hover:bg-slate-700" : "bg-white text-slate-700 font-bold hover:bg-slate-100 border border-slate-200/80"
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    <span>Security &amp; Data Backup</span>
                  </button>
                </div>

                {/* SUB-TAB 1: STOREFRONT & BRANDING */}
                {settingsSubTab === "general" && (
                  <div className={`p-6 rounded-3xl border space-y-5 animate-in fade-in ${
                    isDarkMode ? "bg-[#1F2937] border-slate-800 text-white" : "bg-white border-slate-200/80 text-slate-900 shadow-2xs"
                  }`}>
                    <h3 className={`text-sm font-black flex items-center gap-2 border-b pb-3 ${isDarkMode ? "border-slate-700/60 text-white" : "border-slate-100 text-slate-900"}`}>
                      <Globe className="w-4 h-4 text-[#E60000]" />
                      Storefront Channels &amp; Business Address
                    </h3>

                    <form onSubmit={(e) => {
                      e.preventDefault();
                      setSettingsToast("Storefront general settings updated successfully!");
                      setTimeout(() => setSettingsToast(""), 4000);
                    }} className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                      <div>
                        <label className={`block text-[11px] font-extrabold uppercase tracking-wider mb-1.5 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                          Official Store Name
                        </label>
                        <input
                          type="text"
                          value="Vodafone UK & T-Mobile USA SIM Hub Pakistan"
                          readOnly
                          className={`w-full border rounded-2xl px-4 py-2.5 text-xs font-semibold ${
                            isDarkMode ? "bg-slate-800/60 border-slate-700 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"
                          }`}
                        />
                      </div>

                      <div>
                        <label className={`block text-[11px] font-extrabold uppercase tracking-wider mb-1.5 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                          WhatsApp Support Helpline Number
                        </label>
                        <input
                          type="text"
                          value={supportPhone}
                          onChange={(e) => setSupportPhone(e.target.value)}
                          className={`w-full border rounded-2xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-[#E60000] ${
                            isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                          }`}
                        />
                      </div>

                      <div>
                        <label className={`block text-[11px] font-extrabold uppercase tracking-wider mb-1.5 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                          Official Support Email
                        </label>
                        <input
                          type="email"
                          value="agha.irtiza.rizvi@gmail.com"
                          readOnly
                          className={`w-full border rounded-2xl px-4 py-2.5 text-xs font-semibold ${
                            isDarkMode ? "bg-slate-800/60 border-slate-700 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"
                          }`}
                        />
                      </div>

                      <div>
                        <label className={`block text-[11px] font-extrabold uppercase tracking-wider mb-1.5 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                          Warehouse &amp; Head Office Address
                        </label>
                        <input
                          type="text"
                          defaultValue="Plot 42-C, Commercial Area, Main Shahrah-e-Faisal, Karachi"
                          className={`w-full border rounded-2xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-[#E60000] ${
                            isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                          }`}
                        />
                      </div>

                      <div className="sm:col-span-2 pt-2">
                        <button
                          type="submit"
                          className="bg-[#E60000] hover:bg-[#CC0000] text-white text-xs font-extrabold px-6 py-3 rounded-full transition-all shadow-md shadow-red-600/20 uppercase tracking-wider cursor-pointer"
                        >
                          Save Storefront Settings
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* SUB-TAB 3: LIVE SOUND & ALERTS */}
                {settingsSubTab === "alerts" && (
                  <div className={`p-6 rounded-3xl border space-y-5 animate-in fade-in ${
                    isDarkMode ? "bg-[#1F2937] border-slate-800 text-white" : "bg-white border-slate-200/80 text-slate-900 shadow-2xs"
                  }`}>
                    <h3 className={`text-sm font-black flex items-center gap-2 border-b pb-3 ${isDarkMode ? "border-slate-700/60 text-white" : "border-slate-100 text-slate-900"}`}>
                      <Bell className="w-4 h-4 text-[#E60000]" />
                      Real-time Sound Chime &amp; Order Notifications
                    </h3>

                    <div className="space-y-4 text-xs font-sans">
                      <div className={`flex items-center justify-between p-4 rounded-2xl border ${
                        isDarkMode ? "bg-slate-800/60 border-slate-700" : "bg-slate-50 border-slate-200/80"
                      }`}>
                        <div>
                          <div className={`font-extrabold text-sm ${isDarkMode ? "text-white" : "text-slate-900"}`}>Live Order Chime Audio</div>
                          <div className="text-[10.5px] text-slate-400 font-semibold mt-0.5">Plays audio notification chime whenever a customer submits a SIM order</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              try {
                                const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
                                audio.play();
                              } catch (err) {}
                            }}
                            className="px-3 py-1.5 rounded-full text-xs font-bold bg-slate-700 hover:bg-slate-600 text-white transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Test Sound</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setSoundEnabled(!soundEnabled)}
                            className={`px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer ${
                              soundEnabled ? "bg-emerald-500 text-white shadow-2xs" : "bg-slate-700 text-slate-300"
                            }`}
                          >
                            {soundEnabled ? "ENABLED" : "MUTED"}
                          </button>
                        </div>
                      </div>

                      <div className={`flex items-center justify-between p-4 rounded-2xl border ${
                        isDarkMode ? "bg-slate-800/60 border-slate-700" : "bg-slate-50 border-slate-200/80"
                      }`}>
                        <div>
                          <div className={`font-extrabold text-sm ${isDarkMode ? "text-white" : "text-slate-900"}`}>Floating Toast Duration</div>
                          <div className="text-[10.5px] text-slate-400 font-semibold mt-0.5">Time to display live order popup on screen bottom</div>
                        </div>
                        <select
                          value={toastDuration}
                          onChange={(e) => setToastDuration(e.target.value)}
                          className={`border rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-[#E60000] ${
                            isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
                          }`}
                        >
                          <option value="3">3 Seconds</option>
                          <option value="5">5 Seconds (Default)</option>
                          <option value="10">10 Seconds</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* SUB-TAB 4: SECURITY & DATA BACKUP */}
                {settingsSubTab === "backup" && (
                  <div className={`p-6 rounded-3xl border space-y-5 animate-in fade-in ${
                    isDarkMode ? "bg-[#1F2937] border-slate-800 text-white" : "bg-white border-slate-200/80 text-slate-900 shadow-2xs"
                  }`}>
                    <h3 className={`text-sm font-black flex items-center gap-2 border-b pb-3 ${isDarkMode ? "border-slate-700/60 text-white" : "border-slate-100 text-slate-900"}`}>
                      <Download className="w-4 h-4 text-[#E60000]" />
                      Data Export, Import &amp; Database Backup Utilities
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div className={`p-5 rounded-2xl border space-y-3 ${
                        isDarkMode ? "bg-slate-800/60 border-slate-700" : "bg-slate-50 border-slate-200/80"
                      }`}>
                        <h4 className={`text-xs font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>Export Orders CSV Report</h4>
                        <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                          Download complete Microsoft Excel / CSV spreadsheet containing all SIM orders, customer phones, and delivery addresses.
                        </p>
                        <button
                          onClick={handleExportCSV}
                          className="bg-[#E60000] hover:bg-[#CC0000] text-white text-xs font-extrabold px-5 py-2.5 rounded-full transition-all shadow-md shadow-red-600/20 flex items-center gap-2 cursor-pointer uppercase tracking-wider"
                        >
                          <Download className="w-4 h-4" />
                          <span>Export Orders CSV</span>
                        </button>
                      </div>

                      <div className={`p-5 rounded-2xl border space-y-3 ${
                        isDarkMode ? "bg-slate-800/60 border-slate-700" : "bg-slate-50 border-slate-200/80"
                      }`}>
                        <h4 className={`text-xs font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>Full Store JSON Backup</h4>
                        <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                          Download full JSON system snapshot containing all active orders, inventory products, and admin settings.
                        </p>
                        <button
                          onClick={() => {
                            setConfirmModal({
                              isOpen: true,
                              title: "Export System Backup",
                              message: "Download full JSON backup of all store orders and SIM packages.",
                              type: "info",
                              confirmText: "Download Backup JSON",
                              cancelText: "Cancel",
                              onConfirm: () => {
                                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ orders, products }, null, 2));
                                const dlAnchor = document.createElement("a");
                                dlAnchor.setAttribute("href", dataStr);
                                dlAnchor.setAttribute("download", `vodafone_backup_${new Date().toISOString().slice(0, 10)}.json`);
                                dlAnchor.click();
                              },
                            });
                          }}
                          className={`border text-xs font-extrabold px-5 py-2.5 rounded-full transition-all flex items-center gap-2 cursor-pointer ${
                            isDarkMode ? "border-slate-700 hover:bg-slate-800 text-slate-200" : "border-slate-300 hover:bg-slate-100 text-slate-700"
                          }`}
                        >
                          <FileText className="w-4 h-4 text-slate-400" />
                          <span>Download Backup JSON</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

        </main>
      </div>

      {/* ================= ORDER DETAILS & INVOICE SLIP MODAL ================= */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 bg-slate-950/40 z-50 flex items-center justify-center p-4 transition-all duration-300 animate-in fade-in duration-200">
          <div className={`max-w-2xl w-full rounded-[32px] p-6 sm:p-8 border space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 ${
            isDarkMode ? "bg-[#111827] border-slate-800 text-white shadow-black/80" : "bg-white border-slate-200 text-slate-900 shadow-slate-900/20"
          }`}>
            {/* Modal Header */}
            <div className={`flex items-center justify-between border-b pb-4 ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-100 text-[#E60000] font-black text-xs flex items-center justify-center shadow-xs">
                  {selectedOrderDetails.customerName.charAt(0)}
                </div>
                <div>
                  <h2 className={`text-xl font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    Order #{selectedOrderDetails.id}
                  </h2>
                  <p className="text-xs font-semibold text-slate-400">
                    Placed on {new Date(selectedOrderDetails.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrderDetails(null)}
                className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ${
                  isDarkMode ? "bg-slate-800 text-slate-400 hover:text-white" : "bg-slate-100 text-slate-500 hover:text-slate-900"
                }`}
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
              {/* Customer Info Box */}
              <div className={`p-4 rounded-2xl border space-y-2.5 ${
                isDarkMode ? "bg-slate-800/80 border-slate-700/80 text-white" : "bg-slate-50 border-slate-200/80 text-slate-900"
              }`}>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                  CUSTOMER DETAILS
                </span>
                <div>
                  <h4 className={`font-extrabold text-sm ${isDarkMode ? "text-white" : "text-slate-900"}`}>{selectedOrderDetails.customerName}</h4>
                  <p className={`font-medium ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>{selectedOrderDetails.phone}</p>
                  {selectedOrderDetails.email && <p className="text-slate-400">{selectedOrderDetails.email}</p>}
                </div>
                <div className={`pt-2 border-t ${isDarkMode ? "border-slate-700" : "border-slate-200/60"}`}>
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                    DELIVERY ADDRESS
                  </span>
                  <p className={`font-semibold mt-1 ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>{selectedOrderDetails.address}</p>
                  <p className="text-slate-400 font-bold">{selectedOrderDetails.city}, Pakistan</p>
                </div>
              </div>

              {/* Package & Payment Box */}
              <div className={`p-4 rounded-2xl border space-y-3 ${
                isDarkMode ? "bg-slate-800/80 border-slate-700/80 text-white" : "bg-slate-50 border-slate-200/80 text-slate-900"
              }`}>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                  SIM PACKAGE &amp; PAYMENT
                </span>

                {selectedOrderDetails.items && selectedOrderDetails.items.length > 0 && (
                  <div className={`flex items-center gap-3 p-2.5 rounded-xl border ${
                    isDarkMode ? "bg-slate-900/80 border-slate-700" : "bg-white border-slate-200/60"
                  }`}>
                    <div className="w-10 h-10 rounded-lg bg-slate-100 relative overflow-hidden shrink-0">
                      <Image src={selectedOrderDetails.items[0].image} alt={selectedOrderDetails.items[0].name} fill className="object-cover" />
                    </div>
                    <div>
                      <h5 className={`font-bold leading-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>{selectedOrderDetails.items[0].name}</h5>
                      <span className="text-[10px] text-slate-400 font-semibold">Qty: {selectedOrderDetails.items[0].qty} • {selectedOrderDetails.items[0].carrier}</span>
                    </div>
                  </div>
                )}

                <div className={`pt-2 border-t flex items-center justify-between ${isDarkMode ? "border-slate-700" : "border-slate-200/60"}`}>
                  <span className={`font-bold ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>Total Cash on Delivery:</span>
                  <span className={`text-lg font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>Rs. {selectedOrderDetails.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className={`pt-4 border-t flex items-center justify-between gap-3 ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}>
              <a
                href={`https://wa.me/92${selectedOrderDetails.phone.replace(/^0/, "")}?text=Hi%20${encodeURIComponent(selectedOrderDetails.customerName)},%20your%20Vodafone%20SIM%20order%20%23${selectedOrderDetails.id}%20is%20${selectedOrderDetails.status}!`}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-full transition-all flex items-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Verify on WhatsApp</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className={`border text-xs font-bold px-4 py-2.5 rounded-full transition-all flex items-center gap-2 cursor-pointer ${
                    isDarkMode ? "border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200" : "border-slate-300 hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Slip</span>
                </button>

                <button
                  onClick={() => setSelectedOrderDetails(null)}
                  className="bg-[#E60000] hover:bg-[#CC0000] text-white text-xs font-bold px-5 py-2.5 rounded-full transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADD / EDIT PRODUCT MODAL ================= */}
      {showProductModal && (
        <div className="fixed inset-0 bg-slate-950/40 z-50 flex items-center justify-center p-4 transition-all duration-300 animate-in fade-in duration-200">
          <div className={`max-w-lg w-full rounded-[32px] p-6 sm:p-8 border space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 ${
            isDarkMode ? "bg-[#111827] border-slate-800 text-white shadow-black/80" : "bg-white border-slate-200 text-slate-900 shadow-slate-900/20"
          }`}>
            <div className={`flex items-center justify-between border-b pb-4 ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}>
              <h2 className={`text-xl font-black flex items-center gap-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                <Smartphone className="w-5 h-5 text-[#E60000]" />
                {editingProductId ? "Edit SIM Package" : "Add New SIM Package"}
              </h2>
              <button
                onClick={() => setShowProductModal(false)}
                className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ${
                  isDarkMode ? "bg-slate-800 text-slate-400 hover:text-white" : "bg-slate-100 text-slate-500 hover:text-slate-900"
                }`}
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 font-sans">
              <div>
                <label className={`block text-xs font-extrabold uppercase tracking-wider mb-1 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                  Package Name / Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Official Vodafone UK Pay-As-You-Go SIM Card"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className={`w-full border rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-[#E60000] ${
                    isDarkMode ? "bg-slate-800 border-slate-700 text-white placeholder-slate-400" : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-extrabold uppercase tracking-wider mb-1 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                    Category / Region
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className={`w-full border rounded-xl px-3 py-2.5 text-xs font-medium focus:outline-none focus:border-[#E60000] ${
                      isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                  >
                    <option value="Vodafone UK">Vodafone UK</option>
                    <option value="T-Mobile USA">T-Mobile USA</option>
                    <option value="Giffgaff UK">Giffgaff UK</option>
                    <option value="EE UK">EE UK</option>
                    <option value="Lebara UK">Lebara UK</option>
                    <option value="Lycamobile UK">Lycamobile UK</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-extrabold uppercase tracking-wider mb-1 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                    Selling Price (PKR)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="3500"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className={`w-full border rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-[#E60000] ${
                      isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-extrabold uppercase tracking-wider mb-1 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                    Original Price (PKR)
                  </label>
                  <input
                    type="number"
                    placeholder="6000"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                    className={`w-full border rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-[#E60000] ${
                      isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-extrabold uppercase tracking-wider mb-1 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                    Image Path / URL
                  </label>
                  <input
                    type="text"
                    placeholder="/product pictures/Vodafone_img1_202304.jpg"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    className={`w-full border rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-[#E60000] ${
                      isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-extrabold uppercase tracking-wider mb-1 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                  Description &amp; Package Features
                </label>
                <textarea
                  rows={3}
                  placeholder="Factory sealed physical Vodafone UK SIM. Zero monthly contract. Guaranteed UK OTPs, Wise, Monzo, and PayPal UK accounts."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className={`w-full border rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-[#E60000] ${
                    isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                />
              </div>



              <div className={`pt-4 border-t flex items-center justify-end gap-3 ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}>
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className={`px-5 py-2.5 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                    isDarkMode ? "border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300" : "border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#E60000] hover:bg-[#CC0000] text-white text-xs font-extrabold px-6 py-2.5 rounded-full transition-all shadow-md shadow-red-600/20 uppercase tracking-wider cursor-pointer"
                >
                  {editingProductId ? "Update Package" : "Create Package"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= PRODUCT PERFORMANCE ANALYTICS MODAL (DYNAMIC & VODAFONE THEME STYLED) ================= */}
      {activeAnalyticsProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 transition-all duration-300 animate-in fade-in duration-200">
          <div className={`rounded-[32px] max-w-md w-full p-6 border relative overflow-hidden font-sans shadow-2xl animate-in fade-in zoom-in-95 duration-200 ${
            isDarkMode ? "bg-[#111827] border-slate-800 text-white shadow-black/80" : "bg-white border-slate-200 text-slate-900 shadow-slate-900/20"
          }`}>
            {/* Top Banner Accent - Vodafone Red */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-[#E60000]" />
            
            {/* Close button */}
            <button
              onClick={() => setSelectedAnalyticsProductId(null)}
              className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                isDarkMode ? "bg-slate-800 text-slate-400 hover:text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900"
              }`}
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-start gap-3.5 mb-5 pt-1">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-[#E60000] flex items-center justify-center font-black text-lg shrink-0 border border-red-200 overflow-hidden relative shadow-2xs">
                {activeAnalyticsProduct.image ? (
                  <Image
                    src={activeAnalyticsProduct.image}
                    alt={activeAnalyticsProduct.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  activeAnalyticsProduct.name.charAt(0)
                )}
              </div>

              <div className="min-w-0 pr-6">
                <div className="flex items-center gap-1.5 flex-wrap mb-1">
                  <span className="bg-[#E60000] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-2xs">
                    Rank #{activeAnalyticsProduct.rank}
                  </span>
                  {activeAnalyticsProduct.isTopSeller && (
                    <span className="bg-red-50 text-[#E60000] border border-red-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Selling Most
                    </span>
                  )}
                  {activeAnalyticsProduct.isHighestDemand && !activeAnalyticsProduct.isTopSeller && (
                    <span className="bg-red-50 text-[#E60000] border border-red-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      High Demand
                    </span>
                  )}
                </div>
                <h3 className={`text-base font-black leading-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  {activeAnalyticsProduct.name}
                </h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">
                  Category: {activeAnalyticsProduct.category} • Rs. {activeAnalyticsProduct.price.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Performance KPIs Grid - Theme Consistent */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className={`p-3.5 rounded-2xl border ${
                isDarkMode ? "bg-slate-800/80 border-slate-700" : "bg-red-50/50 border-red-100"
              }`}>
                <div className="flex items-center justify-between text-[#E60000] text-xs font-extrabold mb-1">
                  <span>Units Sold</span>
                  <Package className="w-4 h-4 text-[#E60000]" />
                </div>
                <div className={`text-xl font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  {activeAnalyticsProduct.soldCount} <span className="text-xs font-semibold text-slate-400">Sold</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 font-medium truncate">
                  {activeAnalyticsProduct.liveSold > 0 ? `${activeAnalyticsProduct.liveSold} live orders placed` : `Based on store velocity`}
                </p>
              </div>

              <div className={`p-3.5 rounded-2xl border ${
                isDarkMode ? "bg-slate-800/80 border-slate-700" : "bg-red-50/50 border-red-100"
              }`}>
                <div className="flex items-center justify-between text-[#E60000] text-xs font-extrabold mb-1">
                  <span>Demand Score</span>
                  <Flame className="w-4 h-4 text-[#E60000]" />
                </div>
                <div className="text-xl font-black text-[#E60000]">
                  {activeAnalyticsProduct.demandScore}<span className="text-xs font-semibold text-slate-400"> / 100</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 font-medium truncate">
                  Live order velocity score
                </p>
              </div>

              <div className={`p-3.5 rounded-2xl border ${
                isDarkMode ? "bg-slate-800/80 border-slate-700" : "bg-slate-50 border-slate-200/80"
              }`}>
                <div className={`flex items-center justify-between text-xs font-extrabold mb-1 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                  <span>Gross Revenue</span>
                  <DollarSign className="w-4 h-4 text-[#E60000]" />
                </div>
                <div className={`text-base font-black truncate ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  Rs. {activeAnalyticsProduct.totalRevenue.toLocaleString()}
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 font-medium truncate">
                  {activeAnalyticsProduct.soldCount} units × Rs. {activeAnalyticsProduct.price.toLocaleString()}
                </p>
              </div>

              <div className={`p-3.5 rounded-2xl border ${
                isDarkMode ? "bg-slate-800/80 border-slate-700" : "bg-slate-50 border-slate-200/80"
              }`}>
                <div className={`flex items-center justify-between text-xs font-extrabold mb-1 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                  <span>Store SIM Orders</span>
                  <ShoppingBag className="w-4 h-4 text-[#E60000]" />
                </div>
                <div className={`text-base font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  {activeAnalyticsProduct.liveOrdersCount} <span className="text-xs font-semibold text-slate-400">Orders</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 font-medium truncate">
                  Live customer checkout orders
                </p>
              </div>
            </div>

            {/* Demand Bar Progress Visual */}
            <div className={`p-4 rounded-2xl border mb-5 space-y-2 ${
              isDarkMode ? "bg-slate-800/80 border-slate-700" : "bg-slate-50 border-slate-200/80"
            }`}>
              <div className={`flex justify-between text-xs font-bold ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                <span className="flex items-center gap-1 font-extrabold">
                  <TrendingUp className="w-3.5 h-3.5 text-[#E60000]" /> Live Demand Index
                </span>
                <span className="text-[#E60000] font-black">{activeAnalyticsProduct.demandScore}%</span>
              </div>
              <div className={`w-full h-3 rounded-full overflow-hidden p-0.5 ${isDarkMode ? "bg-slate-700" : "bg-slate-200"}`}>
                <div
                  style={{ width: `${activeAnalyticsProduct.demandScore}%` }}
                  className="h-full bg-gradient-to-r from-[#E60000] to-[#CC0000] rounded-full transition-all duration-500"
                />
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                Dynamically updating from live customer SIM purchase velocity and order volume.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const prodToEdit = activeAnalyticsProduct;
                  setSelectedAnalyticsProductId(null);
                  handleOpenEditProduct(prodToEdit);
                  setActiveTab("catalog");
                }}
                className="flex-1 bg-[#E60000] hover:bg-[#CC0000] text-white text-xs font-extrabold py-3 rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-red-600/20 uppercase tracking-wider"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Package in Catalog
              </button>
              <button
                onClick={() => setSelectedAnalyticsProductId(null)}
                className={`px-5 text-xs font-extrabold py-3 rounded-full transition-all cursor-pointer ${
                  isDarkMode ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= EXECUTIVE CUSTOM GLASSMORPHISM CONFIRMATION / ACTION MODAL ================= */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 transition-all duration-300 animate-in fade-in duration-200">
          <div className={`max-w-md w-full rounded-[32px] p-6 sm:p-7 border relative overflow-hidden font-sans shadow-2xl animate-in fade-in zoom-in-95 duration-200 ${
            isDarkMode ? "bg-[#111827] border-slate-800 text-white shadow-black/80" : "bg-white border-slate-200 text-slate-900 shadow-slate-900/20"
          }`}>
            {/* Top Red/Rose Accent Bar */}
            <div className={`absolute top-0 left-0 right-0 h-2 ${
              confirmModal.type === "danger" ? "bg-rose-600" : "bg-[#E60000]"
            }`} />

            <button
              onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
              className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                isDarkMode ? "bg-slate-800 text-slate-400 hover:text-white" : "bg-slate-100 text-slate-500 hover:text-slate-900"
              }`}
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Icon & Title */}
            <div className="flex items-start gap-4 mb-4 pt-1">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                confirmModal.type === "danger"
                  ? "bg-rose-100 text-rose-600 border border-rose-200"
                  : "bg-red-100 text-[#E60000] border border-red-200"
              }`}>
                {confirmModal.type === "danger" ? (
                  <Trash2 className="w-6 h-6" />
                ) : (
                  <Info className="w-6 h-6" />
                )}
              </div>

              <div className="min-w-0 pr-4">
                <h3 className={`text-lg font-black leading-snug ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  {confirmModal.title}
                </h3>
                <p className="text-xs font-semibold text-slate-400 mt-1 leading-relaxed">
                  {confirmModal.message}
                </p>
              </div>
            </div>

            {/* Action Buttons Bar */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100/10">
              {confirmModal.cancelText !== null && (
                <button
                  type="button"
                  onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                  className={`px-5 py-2.5 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                    isDarkMode ? "border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300" : "border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {confirmModal.cancelText || "Cancel"}
                </button>
              )}

              {confirmModal.onConfirm && (
                <button
                  type="button"
                  onClick={() => {
                    const confirmFn = confirmModal.onConfirm;
                    setConfirmModal({ ...confirmModal, isOpen: false });
                    confirmFn?.();
                  }}
                  className={`text-white text-xs font-extrabold px-6 py-2.5 rounded-full transition-all shadow-md uppercase tracking-wider cursor-pointer ${
                    confirmModal.type === "danger"
                      ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
                      : "bg-[#E60000] hover:bg-[#CC0000] shadow-red-600/20"
                  }`}
                >
                  {confirmModal.confirmText || "Confirm"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= 2FA SECURITY OTP VERIFICATION MODAL ================= */}
      {profileOtpModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all duration-300 animate-in fade-in">
          <div className={`max-w-md w-full rounded-[32px] p-6 sm:p-7 border space-y-5 shadow-2xl animate-in zoom-in-95 duration-200 ${
            isDarkMode ? "bg-[#111827] border-slate-800 text-white shadow-black/80" : "bg-white border-slate-200 text-slate-900 shadow-slate-900/20"
          }`}>
            <div className="flex items-center justify-between border-b pb-3.5 border-slate-200/40">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-red-100 text-[#E60000] font-black text-sm flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-5 h-5 text-[#E60000]" />
                </div>
                <div>
                  <h3 className={`text-base font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>2FA Security Verification</h3>
                  <p className="text-[11px] text-slate-400 font-semibold">Enter 6-digit OTP code sent to Gmail</p>
                </div>
              </div>
              <button onClick={() => setProfileOtpModalOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            {profileOtpMessage && (
              <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-[#E60000] text-xs font-bold flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" />
                <span>{profileOtpMessage}</span>
              </div>
            )}

            <form onSubmit={handleVerifyOtpAndUpdatePassword} className="space-y-4 text-xs font-sans">
              <div>
                <label className={`block text-[11px] font-extrabold uppercase tracking-wider mb-1.5 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                  6-Digit OTP Verification Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="Enter 6-digit code (e.g. 849201)"
                  value={profileOtpCode}
                  onChange={(e) => setProfileOtpCode(e.target.value)}
                  className={`w-full border rounded-2xl px-4 py-3 text-center text-base font-black tracking-widest focus:outline-none focus:border-[#E60000] ${
                    isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setProfileOtpModalOpen(false)}
                  className={`flex-1 py-3 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                    isDarkMode ? "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700" : "border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={profileOtpLoading}
                  className="flex-1 bg-[#E60000] hover:bg-[#CC0000] text-white text-xs font-extrabold py-3 rounded-full transition-all shadow-md uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {profileOtpLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Verify & Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
