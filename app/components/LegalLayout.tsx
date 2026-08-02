"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { FileText, Clock, List, Home, ArrowUpRight } from "lucide-react";

/* ---------- Shared typography helpers (used by legal page bodies) ---------- */

export function P({ children }: { children: ReactNode }) {
  return <p className="text-sm text-slate-600 leading-relaxed">{children}</p>;
}

export function UL({ children }: { children: ReactNode }) {
  return <ul className="space-y-2.5">{children}</ul>;
}

export function LI({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-sm text-slate-600 leading-relaxed">
      <span className="w-1.5 h-1.5 rounded-full bg-[#E60000] mt-[7px] shrink-0" />
      <span>{children}</span>
    </li>
  );
}

/* ------------------------------- Layout ------------------------------- */

export interface LegalSection {
  id: string;
  title: string;
  body: ReactNode;
}

interface LegalLayoutProps {
  badge: string;
  title: string;
  lastUpdated: string;
  introduction: ReactNode;
  sections: LegalSection[];
  footerNote?: ReactNode;
}

export default function LegalLayout({
  badge,
  title,
  lastUpdated,
  introduction,
  sections,
  footerNote,
}: LegalLayoutProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id || "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-900 pt-28 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Card */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-2xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#E60000] via-[#EA0089] to-[#E60000]" />
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 bg-red-50 text-[#E60000] border border-red-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
              <FileText className="w-3 h-3" /> {badge}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-500 border border-slate-200 px-3 py-1 rounded-full text-[10px] font-bold">
              <Clock className="w-3 h-3" /> Last Updated: {lastUpdated}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            {title}
          </h1>
          <div className="max-w-3xl space-y-3 text-sm text-slate-600 leading-relaxed">
            {introduction}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-8">
          {/* Table of Contents */}
          <aside className="lg:col-span-3 lg:sticky lg:top-28">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
                <List className="w-4 h-4 text-[#E60000]" /> Table of Contents
              </h4>
              <ul className="space-y-1">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className={`block text-xs font-bold px-3 py-2 rounded-xl transition-all ${
                        activeId === s.id
                          ? "bg-red-50 text-[#E60000] border border-red-200"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
                      }`}
                    >
                      <span className="inline-flex w-5 text-[#E60000]/70 font-black">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
              <Link
                href="/"
                className="mt-4 flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" /> Back to Home
              </Link>
            </div>
          </aside>

          {/* Content Sections */}
          <div className="lg:col-span-9 space-y-6">
            {sections.map((s, i) => (
              <section
                key={s.id}
                id={s.id}
                className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-2xs scroll-mt-32"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#E60000] text-white flex items-center justify-center text-sm font-black shrink-0 shadow-md shadow-red-600/20">
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight mb-4">
                      {s.title}
                    </h2>
                    <div className="space-y-3.5">{s.body}</div>
                  </div>
                </div>
              </section>
            ))}

            {/* Contact CTA */}
            <div className="bg-gradient-to-r from-[#E60000] to-[#CC0000] rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-red-600/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-black tracking-tight">
                  Questions about this document?
                </h3>
                <p className="text-xs text-white/80 font-semibold mt-1 max-w-md">
                  {footerNote || "Our support team is available 24/7 to help you with any questions or concerns."}
                </p>
              </div>
              <a
                href="https://wa.me/923408219725"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-[#E60000] text-xs font-black px-5 py-3 rounded-full hover:bg-red-50 transition-all shadow-md shrink-0"
              >
                Contact Support <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
