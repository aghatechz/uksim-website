import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Chatbot from "../components/Chatbot";
import LegalLayout, { P, UL, LI } from "../components/LegalLayout";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Vodafone SIM Hub Pakistan",
  description:
    "Read the Terms of Service of Vodafone SIM Hub Pakistan. Understand the terms governing orders, payments (COD), shipping, returns, and use of our UK & USA SIM card services.",
  robots: { index: true, follow: true },
};

const sections = [
  {
    id: "sec-acceptance",
    title: "Acceptance of Terms",
    body: (
      <>
        <P>
          Welcome to Vodafone SIM Hub Pakistan. These Terms of Service ("Terms") govern your
          access to and use of our website, products, and services. By placing an order, browsing
          our website, or contacting us, you acknowledge that you have read, understood, and agree
          to be bound by these Terms.
        </P>
        <P>
          If you do not agree with any part of these Terms, please discontinue use of our website
          and services. We reserve the right to update or modify these Terms at any time, and your
          continued use of our services after any changes constitutes acceptance of the revised
          Terms.
        </P>
      </>
    ),
  },
  {
    id: "sec-products",
    title: "Our Products & Services",
    body: (
      <>
        <P>We provide the following products and services across Pakistan:</P>
        <UL>
          <LI>
            Genuine, factory-sealed physical SIM cards from UK carriers including{" "}
            <strong className="text-slate-900">Vodafone UK</strong>,{" "}
            <strong className="text-slate-900">Giffgaff UK</strong>,{" "}
            <strong className="text-slate-900">EE UK</strong>, and{" "}
            <strong className="text-slate-900">Lebara UK</strong>.
          </LI>
          <LI>
            Genuine US SIM cards from <strong className="text-slate-900">T-Mobile USA</strong>.
          </LI>
          <LI>
            Nationwide Cash on Delivery (COD) delivery through trusted courier partners.
          </LI>
          <LI>
            Pre-sales guidance and post-purchase support via WhatsApp and phone.
          </LI>
        </UL>
        <P>
          Our SIM cards are sourced through authorized distribution channels and are intended for
          lawful personal and commercial use. Activation, network availability, and service
          features are governed by the respective carrier&apos;s terms.
        </P>
      </>
    ),
  },
  {
    id: "sec-orders",
    title: "Orders & Order Acceptance",
    body: (
      <>
        <P>
          You may place an order through our website, or by contacting us directly via WhatsApp or
          phone. When you place an order, you will receive an order reference ID (e.g., VOD-123456).
        </P>
        <UL>
          <LI>
            All orders are subject to availability and verification. We reserve the right to refuse
            or cancel any order at our discretion — for example, if a product is out of stock or
            details cannot be verified.
          </LI>
          <LI>
            Please ensure your name, phone number, and delivery address are accurate. We are not
            responsible for failed deliveries caused by incorrect or incomplete information
            provided by you.
          </LI>
          <LI>
            An order is considered confirmed only after we have verified your details and your
            order reference ID has been generated.
          </LI>
        </UL>
      </>
    ),
  },
  {
    id: "sec-pricing",
    title: "Pricing & Payment",
    body: (
      <>
        <P>
          All prices are listed in Pakistani Rupees (PKR) and are inclusive of the SIM package.
          Prices are subject to change without prior notice, but the price displayed at the time of
          your order will apply to that order.
        </P>
        <UL>
          <LI>
            <strong className="text-slate-900">Cash on Delivery (COD):</strong> you pay the full
            amount in cash to our courier partner when your order is delivered.
          </LI>
          <LI>
            <strong className="text-slate-900">Delivery Charges:</strong> delivery is free across
            Pakistan on qualifying orders.
          </LI>
          <LI>
            <strong className="text-slate-900">Promotions &amp; Coupons:</strong> discounts or
            coupon codes (such as SIM500) may be offered from time to time. Coupons are
            single-use, non-transferable, and cannot be combined unless stated otherwise.
          </LI>
        </UL>
      </>
    ),
  },
  {
    id: "sec-shipping",
    title: "Shipping & Delivery",
    body: (
      <>
        <P>
          We dispatch orders on the same day or the next working day, and standard delivery takes{" "}
          <strong className="text-slate-900">2 to 3 working days</strong> across major cities in
          Pakistan.
        </P>
        <UL>
          <LI>
            Delivery timelines may vary for remote areas or during public holidays, severe weather,
            or courier network disruptions.
          </LI>
          <LI>
            Please be available to receive your delivery. If a delivery attempt fails, our courier
            partner may contact you to reschedule.
          </LI>
          <LI>
            Refused or failed deliveries may be subject to re-delivery charges, and in some cases
            may be treated as a cancellation.
          </LI>
          <LI>
            You can track your order using the reference ID on our{" "}
            <Link href="/track" className="text-[#E60000] font-bold hover:underline">
              Track Order
            </Link>{" "}
            page.
          </LI>
        </UL>
      </>
    ),
  },
  {
    id: "sec-activation",
    title: "SIM Activation & Usage",
    body: (
      <>
        <P>
          Our SIM cards are delivered ready for use. To activate and use a SIM card, you must have
          a compatible, unlocked device that supports the carrier&apos;s network frequencies.
        </P>
        <UL>
          <LI>
            Activation and network coverage are managed by the respective carrier (Vodafone,
            T-Mobile, Giffgaff, EE, or Lebara).
          </LI>
          <LI>
            Top-up, roaming, and usage are subject to the carrier&apos;s terms and applicable laws
            of the UK, USA, and Pakistan.
          </LI>
          <LI>
            We are not liable for network outages, coverage gaps, or carrier service interruptions
            that are outside our control.
          </LI>
          <LI>
            Services such as TikTok Live monetization, PayPal, or banking OTPs depend on carrier,
            platform, and bank policies — availability is not guaranteed by us.
          </LI>
        </UL>
      </>
    ),
  },
  {
    id: "sec-returns",
    title: "Returns, Exchanges & Refunds",
    body: (
      <>
        <P>
          We want you to be completely satisfied with your purchase. Our returns and refund
          policy works as follows:
        </P>
        <UL>
          <LI>
            <strong className="text-slate-900">Defective or Wrong Product:</strong> if your SIM
            card arrives damaged, is the wrong package, or is genuinely faulty on arrival, report
            it to us within <strong className="text-slate-900">7 days</strong> of delivery via
            WhatsApp, quoting your order ID.
          </LI>
          <LI>
            <strong className="text-slate-900">Replacement First:</strong> where a SIM is faulty,
            we will first verify the issue with the carrier and arrange a replacement. Refunds are
            issued only where a replacement is not possible.
          </LI>
          <LI>
            <strong className="text-slate-900">Change of Mind:</strong> because SIM cards are
            factory-sealed and single-use items, we cannot accept returns for change of mind once
            the seal is broken or the SIM has been activated or used.
          </LI>
          <LI>
            <strong className="text-slate-900">COD Refunds:</strong> any approved refund will be
            processed through the original payment channel or via bank transfer, as agreed.
          </LI>
        </UL>
      </>
    ),
  },
  {
    id: "sec-prohibited",
    title: "Prohibited Uses",
    body: (
      <>
        <P>You agree not to use our products or services for any unlawful or prohibited purpose, including:</P>
        <UL>
          <LI>Any activity that violates the laws of Pakistan, the UK, the USA, or your local jurisdiction.</LI>
          <LI>Fraud, phishing, identity theft, harassment, or threats against any person or entity.</LI>
          <LI>Unauthorized mass resale or redistribution of SIM cards without our written consent.</LI>
          <LI>Interference with, or disruption of, our website, systems, or services.</LI>
          <LI>Any use that infringes the rights of third parties.</LI>
        </UL>
      </>
    ),
  },
  {
    id: "sec-ip",
    title: "Intellectual Property",
    body: (
      <>
        <P>
          All content on our website — including text, graphics, logos, images, and design — is
          owned by or licensed to Vodafone SIM Hub Pakistan and is protected by applicable
          intellectual property laws. You may not reproduce, distribute, or use our content
          without our prior written permission.
        </P>
        <P>
          Please note: "Vodafone" is a trademark of Vodafone Group Plc, "T-Mobile" is a trademark
          of Deutsche Telekom AG, and other carrier names are trademarks of their respective
          owners. We operate as an independent distributor and are not affiliated with, or
          endorsed by, these companies.
        </P>
      </>
    ),
  },
  {
    id: "sec-disclaimer",
    title: "Disclaimer of Warranties",
    body: (
      <>
        <P>
          To the maximum extent permitted by applicable law, our products and services are
          provided "as is" and "as available", without warranties of any kind, whether express or
          implied, including but not limited to implied warranties of merchantability, fitness for
          a particular purpose, or non-infringement.
        </P>
        <P>
          We do not warrant that the use of a SIM card will work with every device, network, or
          platform, or that specific services (such as social media monetization or banking OTPs)
          will be available at all times.
        </P>
      </>
    ),
  },
  {
    id: "sec-liability",
    title: "Limitation of Liability",
    body: (
      <>
        <P>
          To the maximum extent permitted by law, Vodafone SIM Hub Pakistan shall not be liable
          for any indirect, incidental, special, consequential, or punitive damages — including
          loss of profits, data, or opportunities — arising out of or related to your use of our
          products or services.
        </P>
        <P>
          Our total liability for any claim arising from your purchase shall not exceed the amount
          you actually paid for the product in question.
        </P>
      </>
    ),
  },
  {
    id: "sec-indemnification",
    title: "Indemnification",
    body: (
      <>
        <P>
          You agree to indemnify, defend, and hold harmless Vodafone SIM Hub Pakistan, its
          officers, employees, and partners from and against any claims, damages, liabilities,
          costs, or expenses (including legal fees) arising from your breach of these Terms or
          your unlawful or improper use of our products or services.
        </P>
      </>
    ),
  },
  {
    id: "sec-governing-law",
    title: "Governing Law & Dispute Resolution",
    body: (
      <>
        <P>
          These Terms are governed by and construed in accordance with the laws of the Islamic
          Republic of Pakistan. Any disputes arising out of or relating to these Terms or our
          services shall be subject to the exclusive jurisdiction of the courts of Pakistan.
        </P>
        <P>
          Before initiating any formal proceedings, we encourage you to contact us directly to
          resolve the matter amicably. Most issues can be resolved quickly through a single
          WhatsApp message or phone call.
        </P>
      </>
    ),
  },
  {
    id: "sec-changes",
    title: "Changes to These Terms",
    body: (
      <>
        <P>
          We may revise these Terms at any time by updating this page. The revised Terms will take
          effect immediately upon posting. We will make reasonable efforts to notify you of
          significant changes, but it is your responsibility to review this page periodically.
          Your continued use of our services after revisions are posted constitutes acceptance of
          the updated Terms.
        </P>
      </>
    ),
  },
  {
    id: "sec-contact",
    title: "Contact Us",
    body: (
      <>
        <P>
          If you have any questions about these Terms or our services, please contact us:
        </P>
        <UL>
          <LI>
            <strong className="text-slate-900">WhatsApp &amp; Call Support:</strong> +92 340
            8219725 (24/7 Active)
          </LI>
          <LI>
            <strong className="text-slate-900">Email:</strong> agha.irtiza.rizvi@gmail.com
          </LI>
          <LI>
            <strong className="text-slate-900">Website:</strong> vodafonesimhub.pk
          </LI>
          <LI>
            <strong className="text-slate-900">Location:</strong> Pakistan (nationwide delivery)
          </LI>
        </UL>
        <P>
          Please also review our{" "}
          <Link href="/privacy-policy" className="text-[#E60000] font-bold hover:underline">
            Privacy Policy
          </Link>{" "}
          to understand how we handle your personal information.
        </P>
      </>
    ),
  },
];

export default function TermsOfServicePage() {
  return (
    <>
      <header>
        <Navbar />
      </header>

      <LegalLayout
        badge="Legal Document"
        title="Terms of Service"
        lastUpdated="August 2, 2026"
        introduction={
          <>
            <P>
              These Terms of Service constitute a legally binding agreement between you and{" "}
              <strong className="text-slate-900">Vodafone SIM Hub Pakistan</strong> ("we", "us",
              or "our") regarding your use of our website, products, and services.
            </P>
            <P>
              By placing an order or using our services, you confirm that you are at least 18
              years old and agree to comply with these Terms. Please read them carefully before
              making a purchase.
            </P>
          </>
        }
        sections={sections}
        footerNote="Have a question about your order or our policies? Our support team is available 24/7."
      />

      <Footer />
      <Chatbot />
    </>
  );
}
