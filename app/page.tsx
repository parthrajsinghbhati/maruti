"use client";

import Navbar from "@/components/Navbar";
import ScrollVideo from "@/components/ScrollVideo";
import About from "@/components/About";
import Stats from "@/components/Stats";
import Services from "@/components/Services";
import Industries from "@/components/Industries";
import NewsSlider from "@/components/NewsSlider";
import Footer from "@/components/Footer";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function Home() {
  // Initialize Lenis smooth scroll and GSAP scroll trigger sequences on client mount
  useScrollAnimation();

  return (
    <main className="relative min-h-screen bg-[#030303]">
      {/* <Navbar />
      <ScrollVideo />
      <About />
      <Stats />
      <Services />
      <Industries />
      <NewsSlider />
      <Footer /> */}
    </main>
  );
}
