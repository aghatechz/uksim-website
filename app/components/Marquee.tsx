"use client";

const brandImages = [
  {
    name: "Brand Logo 1",
    src: "/trusted companies/4c88f4a75f2e447c4c088b6a1aa4710d.png",
    className: "h-8 md:h-10 w-auto object-contain max-w-[140px] md:max-w-[180px]",
  },
  {
    name: "Wise Logo",
    src: "/trusted companies/9bf21ac8544464e61b4308c8cf8c2a67.png",
    className: "h-11 md:h-14 w-auto object-contain max-w-[160px] md:max-w-[200px] scale-125",
  },
  {
    name: "Brand Logo 3",
    src: "/trusted companies/f12a86e2170c82ab7baa8426e71651a5.png",
    className: "h-8 md:h-10 w-auto object-contain max-w-[140px] md:max-w-[180px]",
  },
  {
    name: "Binance Logo",
    src: "/trusted companies/f3567f2cc331db58b859397ee861da5a.png",
    className: "h-9 md:h-11 w-auto object-contain max-w-[150px] md:max-w-[190px]",
  },
  {
    name: "WhatsApp Logo",
    src: "/trusted companies/pngwing.com.png",
    className: "h-8 md:h-10 w-auto object-contain max-w-[140px] md:max-w-[180px]",
  },
  {
    name: "Stripe Logo",
    src: "/trusted companies/stripe-seeklogo.png",
    className: "h-8 md:h-10 w-auto object-contain max-w-[140px] md:max-w-[180px]",
  },
  {
    name: "TikTok Live Logo",
    src: "/trusted companies/tiktok-live-stream-red-logo-23137_1024.png",
    className: "h-11 md:h-14 w-auto object-contain max-w-[160px] md:max-w-[200px] scale-125",
  },
];

export default function Marquee() {
  const doubled = [...brandImages, ...brandImages];

  return (
    <section className="py-6 bg-slate-50 border-y border-slate-200/80 overflow-hidden shadow-xs">
      <div className="relative flex items-center">
        <div className="flex animate-marquee whitespace-nowrap items-center">
          {doubled.map((item, i) => (
            <div
              key={`a-${i}`}
              className="mx-8 md:mx-14 flex items-center justify-center flex-shrink-0 h-12 md:h-16 hover:scale-105 transition-transform"
            >
              <img
                src={item.src}
                alt={item.name}
                className={`${item.className} drop-shadow-xs`}
              />
            </div>
          ))}
        </div>

        <div className="flex animate-marquee whitespace-nowrap items-center" aria-hidden="true">
          {doubled.map((item, i) => (
            <div
              key={`b-${i}`}
              className="mx-8 md:mx-14 flex items-center justify-center flex-shrink-0 h-12 md:h-16 hover:scale-105 transition-transform"
            >
              <img
                src={item.src}
                alt={item.name}
                className={`${item.className} drop-shadow-xs`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
