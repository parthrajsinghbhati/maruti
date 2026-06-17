"use client";

import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { videoSections } from "../lib/sections";

export default function ScrollVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    // 1. Particle Canvas Fallback Animation
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      color: string;
    }> = [];

    const colors = ["#c084fc", "#60a5fa", "#f472b6", "#818cf8"];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const drawParticles = () => {
      ctx.fillStyle = "rgba(3, 3, 3, 0.08)";
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      ctx.strokeStyle = "rgba(192, 132, 252, 0.03)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(drawParticles);
    };

    drawParticles();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const video = videoRef.current;
    const container = containerRef.current;

    if (!video || !container) return;

    const setupVideoScrub = () => {
      setIsVideoLoaded(true);
      video.pause();

      // Find total duration to map (usually end time of the last section)
      const totalDuration = videoSections[videoSections.length - 1]?.end || 20;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=400%", // Pins the section longer to allow smooth transitions through all 4 sections
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      // Scrub the video currentTime
      tl.to(video, {
        currentTime: totalDuration,
        duration: totalDuration,
        ease: "none",
      }, 0);

      // Animate title reveals aligned with section timestamps
      videoSections.forEach((section) => {
        const textElement = container.querySelector(`#section-text-${section.id}`);
        if (!textElement) return;

        const fadeInStart = section.start;
        const fadeInEnd = Math.min(section.start + 0.8, section.end);
        const fadeOutStart = Math.max(section.end - 0.8, section.start);
        const fadeOutEnd = section.end;

        // Reset initially to hidden
        gsap.set(textElement, { opacity: 0, y: 40 });

        // Fade in
        tl.to(
          textElement,
          {
            opacity: 1,
            y: 0,
            duration: fadeInEnd - fadeInStart,
            ease: "power2.out",
          },
          fadeInStart
        );

        // Fade out (only if it's not the final section, or fade it out at the very end of scroll)
        tl.to(
          textElement,
          {
            opacity: 0,
            y: -40,
            duration: fadeOutEnd - fadeOutStart,
            ease: "power2.in",
          },
          fadeOutStart
        );
      });
    };

    if (video.readyState >= 1) {
      setupVideoScrub();
    } else {
      video.addEventListener("loadedmetadata", setupVideoScrub);
    }

    const handleError = () => {
      setLoadError(true);
    };
    video.addEventListener("error", handleError);

    return () => {
      if (video) {
        video.removeEventListener("loadedmetadata", setupVideoScrub);
        video.removeEventListener("error", handleError);
      }
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === container) {
          trigger.kill();
        }
      });
    };
  }, [loadError]);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center"
    >
      {/* Background Fallback Grid and Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 -z-30"></div>
      <div className="absolute -top-1/4 left-1/4 w-96 h-96 rounded-full radial-glow opacity-30 -z-20"></div>

      {/* Canvas Fallback Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover opacity-60 -z-20 pointer-events-none"
      />

      {/* Scrub Video Element */}
      <video
        ref={videoRef}
        playsInline
        muted
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 -z-10 ${
          isVideoLoaded && !loadError ? "opacity-45" : "opacity-0"
        }`}
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
        <source src="/videos/hero.webm" type="video/webm" />
      </video>

      {/* Loading Overlay */}
      {!isVideoLoaded && !loadError && (
        <div className="absolute inset-0 flex flex-col justify-center items-center gap-4 bg-black/80 z-10">
          <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-purple-500 animate-spin"></div>
          <span className="text-xs uppercase tracking-widest text-zinc-500">Initializing Media</span>
        </div>
      )}

      {/* Overlay Typography sections */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center select-none w-full">
        {videoSections.map((section) => (
          <div
            key={section.id}
            id={`section-text-${section.id}`}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl opacity-0"
          >
            <h3 className="text-xs md:text-sm font-extrabold uppercase tracking-[0.3em] text-purple-400 mb-4 drop-shadow-md">
              {section.sub}
            </h3>
            <h1 className="text-4xl md:text-7xl font-black tracking-tight text-white mb-6 leading-none uppercase">
              {section.title}
            </h1>
          </div>
        ))}

        {/* Bounce Scroll Indicator at bottom */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-zinc-700 rounded-full p-1 flex justify-center items-start shadow-inner">
            <div className="w-1.5 h-3 bg-purple-400 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
