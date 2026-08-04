import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import CartProvider from "./components/CartProvider";
import AnalyticsTracker from "./components/AnalyticsTracker";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["500", "600", "700", "800", "900"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://uksim.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Buy Vodafone UK & T-Mobile USA SIM Card in Pakistan | Cash on Delivery",
    template: "%s | Vodafone SIM Hub Pakistan",
  },
  description:
    "Official Vodafone UK, T-Mobile USA & European physical SIM cards in Pakistan. Instant SMS OTP verification for Wise, PayPal, Monzo & Bank Apps. Free Cash on Delivery (COD) nationwide.",
  keywords: [
    "Vodafone UK SIM Pakistan",
    "T-Mobile USA SIM Pakistan",
    "UK SIM card Pakistan",
    "USA SIM card Pakistan",
    "TikTok Live SIM",
    "PayPal verification SIM",
    "UK banking OTP SIM",
    "buy UK SIM in Pakistan",
    "T-Mobile roaming SIM",
    "Vodafone pay as you go Pakistan",
    "international SIM card Pakistan",
  ],
  openGraph: {
    title: "Buy Official Vodafone UK & T-Mobile USA SIM Cards in Pakistan",
    description:
      "Genuine UK & USA physical SIM cards with Free Cash on Delivery across Pakistan. Instant SMS OTP for Wise, PayPal, Monzo & Banking Apps.",
    url: siteUrl,
    siteName: "Vodafone SIM Hub Pakistan",
    type: "website",
    locale: "en_PK",
    images: [
      {
        url: "/hero-2.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Vodafone UK & T-Mobile USA SIM Cards in Pakistan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Buy Vodafone UK & T-Mobile USA SIM in Pakistan",
    description:
      "Official UK & USA SIM cards with Free Cash on Delivery across Pakistan. Instant OTP verification for international banking.",
    images: ["/hero-2.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${jakarta.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col overflow-x-hidden font-sans bg-slate-50 text-slate-900 selection:bg-red-500 selection:text-white" suppressHydrationWarning>
        <AnalyticsTracker />
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
