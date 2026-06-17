"use client";

import React from "react";

export default function Footer() {
  const handleScrollToTop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const heroSection = document.querySelector("#hero");
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const socialLinks = [
    { name: "Twitter", href: "#" },
    { name: "Instagram", href: "#" },
    { name: "LinkedIn", href: "#" },
    { name: "Dribbble", href: "#" },
  ];

  return (
    <footer id="footer" className="relative pt-24 pb-12 overflow-hidden bg-black border-t border-zinc-900">
      {/* Glow */}
      <div className="absolute right-0 bottom-0 w-[30rem] h-[30rem] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-20">
          {/* Logo & Callout */}
          <div className="lg:col-span-5 flex flex-col items-start justify-between gap-8">
            <div>
              <span className="font-extrabold text-2xl tracking-tight text-white mb-4 block">
                MARUTI<span className="text-purple-400">.</span>
              </span>
              <p className="max-w-sm text-sm text-zinc-400 leading-relaxed">
                Elevating web development from static grid layouts to premium, scroll-bound, immersive storytelling mediums.
              </p>
            </div>
            {/* Social Links */}
            <div className="flex gap-6">
              {socialLinks.map((soc) => (
                <a
                  key={soc.name}
                  href={soc.href}
                  className="text-xs uppercase font-extrabold tracking-widest text-zinc-500 hover:text-white transition-colors"
                >
                  {soc.name}
                </a>
              ))}
            </div>
          </div>

          {/* Site Navigation Links */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <h4 className="text-xs uppercase font-bold text-white tracking-widest">Explore</h4>
              <nav className="flex flex-col gap-2.5">
                <a href="#hero" className="text-xs text-zinc-400 hover:text-white transition-colors">Home</a>
                <a href="#about" className="text-xs text-zinc-400 hover:text-white transition-colors">About Us</a>
                <a href="#services" className="text-xs text-zinc-400 hover:text-white transition-colors">Services</a>
                <a href="#industries" className="text-xs text-zinc-400 hover:text-white transition-colors">Industries</a>
              </nav>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-xs uppercase font-bold text-white tracking-widest">Contact</h4>
              <div className="flex flex-col gap-2.5 text-xs text-zinc-400">
                <span>hello@maruti.design</span>
                <span>+1 (555) 019-2834</span>
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Newsletter Input Form */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div>
              <h4 className="text-xs uppercase font-bold text-white tracking-widest mb-3">Newsletter</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Get monthly deep dives on frontend motion engineering and Next.js scale practices.
              </p>
            </div>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex border-b border-zinc-800 focus-within:border-purple-500 transition-colors duration-300 py-1.5"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-transparent text-xs text-white focus:outline-none w-full placeholder:text-zinc-600 px-1"
                required
              />
              <button
                type="submit"
                className="text-[10px] font-black uppercase tracking-widest text-purple-400 hover:text-white px-3 transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Lower row */}
        <div className="pt-8 border-t border-zinc-900/60 flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-[10px] text-zinc-600 font-mono">
            &copy; {new Date().getFullYear()} Maruti. All rights reserved. Crafted with care.
          </span>
          <button
            onClick={handleScrollToTop}
            className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-zinc-400 hover:text-white transition-colors group"
          >
            Back to Top
            <svg
              className="w-4 h-4 transform -rotate-90 group-hover:-translate-y-0.5 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
