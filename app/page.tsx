"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import ProductCardVodafone from "./components/ProductCardVodafone";
import ProductCardTMobile from "./components/ProductCardTMobile";
import CountdownPromo from "./components/CountdownPromo";
import FeaturesGrid from "./components/FeaturesGrid";
import Testimonials from "./components/Testimonials";
import PhotoReviews from "./components/PhotoReviews";
import FAQAccordion from "./components/FAQAccordion";
import CheckoutModal from "./components/CheckoutModal";
import { useCart } from "./components/CartProvider";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import SalesToast from "./components/SalesToast";
import Script from "next/script";

// JSON-LD Structured Data
const productSchemaVodafone = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Vodafone UK Pay-As-You-Go SIM Card",
  description:
    "Genuine Vodafone UK SIM card for banking OTP, PayPal, TikTok Live. Pre-activated, delivered in Pakistan.",
  brand: { "@type": "Brand", name: "Vodafone" },
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "3500",
    highPrice: "8500",
    priceCurrency: "PKR",
    availability: "https://schema.org/InStock",
    offerCount: "3",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "312",
  },
  image: "/vodafone-sim.png",
};

const productSchemaTMobile = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "T-Mobile USA Pay-As-You-Go SIM Card",
  description:
    "Genuine T-Mobile USA SIM with full roaming in 210+ countries. US number for PayPal, TikTok Live.",
  brand: { "@type": "Brand", name: "T-Mobile" },
  offers: {
    "@type": "Offer",
    price: "10500",
    priceCurrency: "PKR",
    availability: "https://schema.org/InStock",
  },
  image: "/tmobile-sim.png",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do I need a UK passport to purchase a UK SIM?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, you do not need a UK passport. Our Vodafone UK SIM cards are pre-registered and pre-activated. Simply insert the SIM into any unlocked phone and you are ready to go.",
      },
    },
    {
      "@type": "Question",
      name: "What are the Vodafone SIM delivery schedule for Pakistan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We ship across all major cities in Pakistan including Karachi, Lahore, Islamabad. Standard delivery takes 2-3 business days. Express next-day delivery is available for Karachi and Lahore.",
      },
    },
    {
      "@type": "Question",
      name: "How do I top up or recharge my SIM card?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can top up your Vodafone UK or T-Mobile USA SIM using the official carrier app, their website, or through third-party top-up services.",
      },
    },
    {
      "@type": "Question",
      name: "Are these official authorized SIM cards?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, all our SIM cards are 100% genuine, factory-sealed, and sourced directly from Vodafone UK and T-Mobile USA through authorized distribution channels.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use the SIM for TikTok Live streaming?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely! Both Vodafone UK and T-Mobile USA SIM cards are fully compatible with TikTok Live. The T-Mobile USA SIM provides a US IP address.",
      },
    },
  ],
};

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(0);

  // Global Cart State (shared across the whole site)
  const { addToCart } = useCart();

  const openCheckout = (pkg?: string, price?: number) => {
    if (pkg) setSelectedPkg(pkg);
    if (price) setSelectedPrice(price);
    setModalOpen(true);
  };


  return (
    <>
      <Script
        id="schema-vodafone"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchemaVodafone),
        }}
      />
      <Script
        id="schema-tmobile"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchemaTMobile),
        }}
      />
      <Script
        id="schema-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <header>
        <Navbar onOrderClick={() => openCheckout()} />
      </header>

      <main className="flex-1">
        <Hero onOrderClick={() => openCheckout()} />
        <Marquee />

        <article>
          <ProductCardVodafone
            onOrderClick={(pkg, price) => openCheckout(pkg, price)}
            onAddToCart={addToCart}
          />
        </article>

        <article>
          <ProductCardTMobile
            onOrderClick={(pkg, price) => openCheckout(pkg, price)}
            onAddToCart={addToCart}
          />
        </article>

        <CountdownPromo onOrderClick={() => openCheckout()} />
        <FeaturesGrid />
        <Testimonials />
        <PhotoReviews />
        <FAQAccordion />
      </main>

      <Footer />

      <Chatbot onOrderClick={() => openCheckout()} />
      <SalesToast />

      <CheckoutModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedPackage={selectedPkg}
        selectedPrice={selectedPrice}
      />
    </>
  );
}
