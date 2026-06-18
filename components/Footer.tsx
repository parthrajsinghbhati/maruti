import React from 'react'

export default function Footer() {
  return (
    <footer className="w-full bg-[#0A0F1E] border-t border-white/5 py-8 px-6 text-center text-sm text-white/40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-bold text-[#2563EB] tracking-wider">MARUTI</div>
        <div>
          &copy; {new Date().getFullYear()} Maruti Suzuki. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
