import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Chatbot from "../components/Chatbot";
import LegalLayout, { P, UL, LI } from "../components/LegalLayout";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Vodafone SIM Hub Pakistan",
  description:
    "Read the Privacy Policy of Vodafone SIM Hub Pakistan. Learn how we collect, use, store, and protect your personal information when you order UK & USA SIM cards online.",
  robots: { index: true, follow: true },
};

const sections = [
  {
    id: "sec-info-we-collect",
    title: "Information We Collect",
    body: (
      <>
        <P>
          To process your orders and provide you with the best possible service, we collect certain
          information when you interact with our website or contact us directly. This information
          falls into the following categories:
        </P>
        <UL>
          <LI>
            <strong className="text-slate-900">Personal &amp; Contact Details:</strong> your full
            name, phone number, WhatsApp number, email address (optional), delivery address, and
            city — collected when you place an order or contact our support team.
          </LI>
          <LI>
            <strong className="text-slate-900">Order Information:</strong> the SIM packages you
            order, quantities, prices, order reference ID, payment method (Cash on Delivery), and
            delivery status.
          </LI>
          <LI>
            <strong className="text-slate-900">Device &amp; Usage Data:</strong> browser type,
            device type, IP address, referring pages, and pages visited on our website, collected
            through cookies and analytics tools.
          </LI>
          <LI>
            <strong className="text-slate-900">Communications:</strong> any messages, chat
            history, or call records exchanged with us via WhatsApp, email, or phone regarding
            your orders or support queries.
          </LI>
        </UL>
      </>
    ),
  },
  {
    id: "sec-how-we-use",
    title: "How We Use Your Information",
    body: (
      <>
        <P>We use the information we collect for the following purposes:</P>
        <UL>
          <LI>To process, confirm, and fulfil your SIM card orders.</LI>
          <LI>
            To arrange Cash on Delivery delivery through our trusted courier partners across
            Pakistan.
          </LI>
          <LI>
            To communicate order updates, delivery confirmations, and important notices via
            WhatsApp, phone call, or SMS.
          </LI>
          <LI>To respond to your inquiries and provide customer support.</LI>
          <LI>
            To improve our website, products, services, and overall customer experience through
            analytics.
          </LI>
          <LI>To detect, prevent, and address fraud, abuse, or security issues.</LI>
          <LI>To comply with applicable legal and regulatory obligations.</LI>
        </UL>
      </>
    ),
  },
  {
    id: "sec-cookies",
    title: "Cookies & Analytics",
    body: (
      <>
        <P>
          Our website uses cookies — small text files stored on your device — to enhance your
          browsing experience. These include:
        </P>
        <UL>
          <LI>
            <strong className="text-slate-900">Essential Cookies:</strong> required for the
            website to function correctly, such as remembering your cart and session preferences.
          </LI>
          <LI>
            <strong className="text-slate-900">Analytics Cookies:</strong> help us understand how
            visitors use our website so we can improve its performance and content.
          </LI>
          <LI>
            <strong className="text-slate-900">Preference Cookies:</strong> remember your
            settings and choices, such as filters and display preferences.
          </LI>
        </UL>
        <P>
          You can control or disable cookies through your browser settings at any time. Please
          note that disabling essential cookies may affect certain features of our website.
        </P>
      </>
    ),
  },
  {
    id: "sec-sharing",
    title: "Sharing Your Information",
    body: (
      <>
        <P>
          <strong className="text-slate-900">We never sell, rent, or trade your personal
          information.</strong> We only share data with trusted third parties strictly necessary
          to operate our business:
        </P>
        <UL>
          <LI>
            <strong className="text-slate-900">Courier &amp; Delivery Partners:</strong> your
            name, phone number, and delivery address, solely to deliver your order.
          </LI>
          <LI>
            <strong className="text-slate-900">Payment Processors:</strong> for Cash on Delivery,
            limited order details may be shared to reconcile payments.
          </LI>
          <LI>
            <strong className="text-slate-900">Analytics Providers:</strong> aggregated, non-
            identifiable usage data to improve our website.
          </LI>
          <LI>
            <strong className="text-slate-900">WhatsApp &amp; Communication Platforms:</strong>{" "}
            to send you order confirmations and support messages.
          </LI>
          <LI>
            <strong className="text-slate-900">Legal Authorities:</strong> when required by law,
            court order, or government regulation.
          </LI>
        </UL>
      </>
    ),
  },
  {
    id: "sec-security",
    title: "Data Security",
    body: (
      <>
        <P>
          We take the security of your personal information seriously and implement reasonable
          technical and organisational safeguards, including:
        </P>
        <UL>
          <LI>Secure, encrypted connections (HTTPS) for all website traffic.</LI>
          <LI>Restricted access to personal data on a need-to-know basis.</LI>
          <LI>Secure storage of order records and customer communications.</LI>
          <LI>Regular review of our security practices and procedures.</LI>
        </UL>
        <P>
          While no method of transmission over the internet is 100% secure, we work diligently to
          protect your data. In the unlikely event of a data breach, we will notify affected users
          and relevant authorities as required by applicable law.
        </P>
      </>
    ),
  },
  {
    id: "sec-retention",
    title: "Data Retention",
    body: (
      <>
        <P>
          We retain your personal information only for as long as necessary to fulfil the purposes
          described in this policy. Specifically:
        </P>
        <UL>
          <LI>
            Order records are kept for operational, warranty, and refund-handling purposes.
          </LI>
          <LI>
            Communications are retained to maintain an accurate history of customer support
            interactions.
          </LI>
          <LI>
            Where required by law, certain records are retained for the minimum period mandated by
            applicable regulations.
          </LI>
        </UL>
        <P>
          When information is no longer needed, we securely delete or anonymise it.
        </P>
      </>
    ),
  },
  {
    id: "sec-your-rights",
    title: "Your Privacy Rights",
    body: (
      <>
        <P>You have the following rights regarding your personal information:</P>
        <UL>
          <LI>
            <strong className="text-slate-900">Access:</strong> request a copy of the personal
            data we hold about you.
          </LI>
          <LI>
            <strong className="text-slate-900">Correction:</strong> request corrections to any
            inaccurate or incomplete information.
          </LI>
          <LI>
            <strong className="text-slate-900">Deletion:</strong> request deletion of your
            personal data, subject to legal obligations.
          </LI>
          <LI>
            <strong className="text-slate-900">Restriction:</strong> request that we limit how we
            process your data in certain circumstances.
          </LI>
          <LI>
            <strong className="text-slate-900">Withdrawal of Consent:</strong> withdraw any
            consent you previously gave, at any time.
          </LI>
        </UL>
        <P>
          To exercise any of these rights, contact us using the details below. We will respond
          within a reasonable time frame and take appropriate action to verify your identity
          before processing your request.
        </P>
      </>
    ),
  },
  {
    id: "sec-children",
    title: "Children's Privacy",
    body: (
      <>
        <P>
          Our website and services are not directed to children under the age of 13, and we do
          not knowingly collect personal information from children. If you believe a child has
          provided us with personal information, please contact us immediately, and we will take
          steps to remove such information from our records.
        </P>
      </>
    ),
  },
  {
    id: "sec-third-party-links",
    title: "Third-Party Links",
    body: (
      <>
        <P>
          Our website may contain links to third-party websites, such as carrier portals, payment
          services, or social media platforms. We are not responsible for the privacy practices or
          content of these external sites. We encourage you to review the privacy policies of any
          third-party website you visit.
        </P>
      </>
    ),
  },
  {
    id: "sec-transfers",
    title: "International Data Transfers",
    body: (
      <>
        <P>
          In the course of providing our services, your information may be processed by service
          providers located outside Pakistan, such as courier networks, cloud storage, and
          analytics platforms. Where such transfers occur, we take reasonable steps to ensure your
          data is handled with an equivalent level of protection.
        </P>
      </>
    ),
  },
  {
    id: "sec-changes",
    title: "Changes to This Policy",
    body: (
      <>
        <P>
          We may update this Privacy Policy from time to time to reflect changes in our practices,
          technology, or legal requirements. Any changes will be posted on this page with an
          updated "Last Updated" date. We encourage you to review this page periodically. Your
          continued use of our website after changes are posted constitutes acceptance of the
          revised policy.
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
          If you have any questions, concerns, or requests regarding this Privacy Policy or how we
          handle your personal information, please reach out to us:
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
          <Link href="/terms-of-service" className="text-[#E60000] font-bold hover:underline">
            Terms of Service
          </Link>{" "}
          for more information about using our website and services.
        </P>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <header>
        <Navbar />
      </header>

      <LegalLayout
        badge="Legal Document"
        title="Privacy Policy"
        lastUpdated="August 2, 2026"
        introduction={
          <>
            <P>
              This Privacy Policy explains how <strong className="text-slate-900">Vodafone SIM
              Hub Pakistan</strong> ("we", "us", or "our") collects, uses, stores, and protects
              your personal information when you visit our website, place an order, or interact
              with our services.
            </P>
            <P>
              By accessing our website or using our services, you agree to the practices described
              in this policy. We are committed to protecting your privacy and handling your data
              responsibly, transparently, and in accordance with applicable laws of Pakistan.
            </P>
          </>
        }
        sections={sections}
        footerNote="Your privacy matters to us. Reach out anytime — our team is available 24/7 on WhatsApp."
      />

      <Footer />
      <Chatbot />
    </>
  );
}
