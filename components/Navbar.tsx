import React from 'react'

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full h-[72px] z-50 bg-transparent flex items-center justify-between px-6 md:px-12 text-white border-b border-white/5">
      {/* Left: Logo */}
      <div className="bg-[#2563EB] text-white px-5 py-2 font-extrabold text-base md:text-lg tracking-widest rounded-md shadow-sm">
        MARUTI SUZUKI
      </div>

      {/* Right: Nav Links Placeholder */}
      <nav className="flex items-center gap-6 text-sm font-medium text-white/70">
        <span className="hover:text-[#2563EB] transition-colors cursor-pointer">Home</span>
        <span className="hover:text-[#2563EB] transition-colors cursor-pointer">About</span>
        <span className="hover:text-[#2563EB] transition-colors cursor-pointer">Services</span>
        <span className="hover:text-[#2563EB] transition-colors cursor-pointer">Contact</span>
      </nav>
    </header>
  )
}
