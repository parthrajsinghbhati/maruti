"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

export function useScrollAnimation() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // 1. Initialize Lenis Smooth Scroll
      const lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
      });

      // Synchronize Lenis scrolling with ScrollTrigger
      lenis.on("scroll", ScrollTrigger.update);

      // Connect Lenis to the GSAP Ticker
      const tickHandler = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(tickHandler);
      gsap.ticker.lagSmoothing(0);

      // 2. Register GSAP ScrollTrigger
      gsap.registerPlugin(ScrollTrigger);

      // 3. Define animations
      // Fade Up Elements
      const fadeUpElements = document.querySelectorAll(".reveal-fade-up");
      fadeUpElements.forEach((el) => {
        gsap.fromTo(
          el,
          {
            opacity: 0,
            y: 50,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Text Mask Reveal
      const textRevealElements = document.querySelectorAll(".reveal-text");
      textRevealElements.forEach((el) => {
        gsap.fromTo(
          el,
          {
            clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
            y: 40,
          },
          {
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            y: 0,
            duration: 1.4,
            ease: "power4.out",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Staggered Grid items
      const staggerContainers = document.querySelectorAll(".reveal-stagger-container");
      staggerContainers.forEach((container) => {
        const items = container.querySelectorAll(".reveal-stagger-item");
        if (items.length > 0) {
          gsap.fromTo(
            items,
            {
              opacity: 0,
              y: 40,
            },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              stagger: 0.15,
              ease: "power3.out",
              scrollTrigger: {
                trigger: container,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });

      // Refresh ScrollTrigger to align coordinate metrics
      ScrollTrigger.refresh();

      // Cleanup on unmount
      return () => {
        lenis.destroy();
        gsap.ticker.remove(tickHandler);
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    }
  }, []);

  return gsap;
}
