"use client";

import React, { useState, useEffect } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "#hero" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Industries", href: "#industries" },
    { label: "Insights", href: "#news" },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? "py-4" : "py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2 group z-50">
          <span className="font-extrabold text-2xl tracking-tight text-white group-hover:opacity-85 transition-opacity">
            MARUTI
          </span>
          <span className="w-2 h-2 rounded-full bg-purple-400 group-hover:scale-150 transition-transform duration-300"></span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 p-1.5 rounded-full glass-panel border-white/5 shadow-2xl backdrop-blur-md">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white px-5 py-2.5 rounded-full transition-all duration-300 relative group"
            >
              {link.label}
              <span className="absolute inset-0 w-full h-full bg-white/5 rounded-full scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 -z-10"></span>
            </a>
          ))}
        </nav>

        {/* Call to Action button */}
        <div className="hidden md:block">
          <a
            href="#footer"
            onClick={(e) => handleLinkClick(e, "#footer")}
            className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-xs font-bold uppercase tracking-wider text-white rounded-full group bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 hover:text-black focus:ring-4 focus:outline-none focus:ring-purple-800"
          >
            <span className="relative px-6 py-2.5 transition-all ease-in duration-75 bg-zinc-950 rounded-full group-hover:bg-opacity-0">
              Start Project
            </span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-zinc-400 hover:text-white focus:outline-none z-50 w-10 h-10 flex flex-col justify-center items-center gap-1.5"
          aria-label="Toggle Menu"
        >
          <span
            className={`w-6 h-0.5 bg-white transition-transform duration-300 ${
              isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></span>
          <span
            className={`w-6 h-0.5 bg-white transition-opacity duration-300 ${
              isMobileMenuOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`w-6 h-0.5 bg-white transition-transform duration-300 ${
              isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 w-full h-screen bg-[#030303]/98 flex flex-col justify-center items-center transition-all duration-500 z-40 ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-6 text-center">
          {navLinks.map((link, idx) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              style={{ transitionDelay: `${idx * 100}ms` }}
              className={`text-3xl font-extrabold uppercase tracking-widest text-zinc-500 hover:text-white transition-all duration-300 ${
                isMobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#footer"
            onClick={(e) => handleLinkClick(e, "#footer")}
            className={`mt-6 inline-block text-sm font-bold uppercase tracking-widest text-purple-400 border border-purple-500/20 px-8 py-3 rounded-full hover:bg-purple-500 hover:text-black transition-all duration-300 ${
              isMobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: `${navLinks.length * 100}ms` }}
          >
            Start Project
          </a>
        </div>
      </div>
    </header>
  );
}
