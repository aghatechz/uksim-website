import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import CartProvider from "./components/CartProvider";

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

export const metadata: Metadata = {
  title:
    "Buy Vodafone UK & T-Mobile USA SIM Card in Pakistan | Cash on Delivery",
  description:
    "Get genuine Vodafone UK and T-Mobile USA SIM cards delivered to your doorstep in Pakistan. Perfect for UK banking OTP, PayPal, TikTok Live, Wise verification. Cash on delivery. Free shipping.",
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
    title: "Buy Vodafone UK & T-Mobile USA SIM Card in Pakistan",
    description:
      "Genuine UK & USA SIM cards with cash on delivery across Pakistan. For banking, OTP, PayPal, TikTok Live & more.",
    url: "https://vodafonesimhub.pk",
    siteName: "Vodafone SIM Hub Pakistan",
    type: "website",
    locale: "en_PK",
    images: [
      {
        url: "/hero-1.png",
        width: 1200,
        height: 630,
        alt: "Vodafone UK & T-Mobile USA SIM Cards in Pakistan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Buy Vodafone UK & T-Mobile USA SIM in Pakistan",
    description:
      "Genuine UK & USA SIM cards delivered to Pakistan. Banking, OTP, TikTok Live ready. Cash on delivery.",
    images: ["/hero-1.png"],
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
    canonical: "https://vodafonesimhub.pk",
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
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
