"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import { videoSections } from "../lib/sections";

// Durations must match the actual scroll video file lengths exactly.
// scroll1=2.0s, scroll2=2.333s, scroll3=4.0s, scroll4=6.5s
const TRANSITION_DURATION = [2.285, 1.5, 3.5, 6.1];
const TRANSITION_EASE = "sine.out";

const getTransitionDuration = (fromIndex: number, toIndex: number) => {
  return TRANSITION_DURATION[Math.min(fromIndex, toIndex)] ?? 2.0;
};

export default function HeroScroll() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scene video refs
  const scene1Ref = useRef<HTMLVideoElement>(null);
  const scene2Ref = useRef<HTMLVideoElement>(null);
  const scene3Ref = useRef<HTMLVideoElement>(null);
  const scene4Ref = useRef<HTMLVideoElement>(null);
  const scene5Ref = useRef<HTMLVideoElement>(null);

  // Transition video refs
  const scroll1Ref = useRef<HTMLVideoElement>(null);
  const scroll2Ref = useRef<HTMLVideoElement>(null);
  const scroll3Ref = useRef<HTMLVideoElement>(null);
  const scroll4Ref = useRef<HTMLVideoElement>(null);

  // UI state
  const [loadedCount, setLoadedCount] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [activeId, setActiveId] = useState("design");
  const [virtualProgress, setVirtualProgress] = useState(0);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeSection, setActiveSection] = useState("design");

  // videoReady only tracks scene videos (scroll videos are never read for opacity rendering)
  const [videoReady, setVideoReady] = useState<Record<string, boolean>>({
    design: false,
    robot: false,
    box: false,
    workshop: false,
    outro: false,
  });

  // Refs mirror state so event listeners never need to re-register
  const isTransitioningRef = useRef(false);
  const currentSceneIndexRef = useRef(0);
  const virtualProgressRef = useRef(0);
  const transitionToRef = useRef<(targetIndex: number, direction?: 'forward' | 'back') => void>(() => {});

  // Refs for equality checks — avoid re-rendering when computed value hasn't changed
  const activeSectionRef = useRef("design");
  const activeIdRef = useRef("design");
  // Tracks which destination scene is being pre-warmed during a scroll transition.
  // The scene play/pause effect must NOT pause this video.
  const preStartingSceneRef = useRef<string | null>(null);

  // Loading tracking via ref (no re-render cost per video)
  const videosLoadedRef = useRef<Record<string, boolean>>({
    design: false, scroll1: false, robot: false, scroll2: false,
    box: false, scroll3: false, workshop: false, scroll4: false, outro: false,
  });



  // Keep track of loop timeouts so we can clear them on unmount or transition
  const loopTimeoutsRef = useRef<Record<string, NodeJS.Timeout>>({});

  const handleVideoEnded = useCallback((id: string, videoRef: React.RefObject<HTMLVideoElement | null>) => {
    if (loopTimeoutsRef.current[id]) {
      clearTimeout(loopTimeoutsRef.current[id]);
    }

    loopTimeoutsRef.current[id] = setTimeout(() => {
      const video = videoRef.current;
      if (!video) return;

      if (activeSectionRef.current === id && !isTransitioningRef.current) {
        video.currentTime = 0;
        video.play().catch((err) => console.error(`Replay error for ${id}:`, err));
      }
    }, 300); // 0.3s pause
  }, []);

  // Cleanup loop timeouts on unmount
  useEffect(() => {
    const timeouts = loopTimeoutsRef.current;
    return () => {
      Object.values(timeouts).forEach(clearTimeout);
    };
  }, []);

  // Sync refs to state
  useEffect(() => { isTransitioningRef.current = isTransitioning; }, [isTransitioning]);
  useEffect(() => { currentSceneIndexRef.current = currentSceneIndex; }, [currentSceneIndex]);
  useEffect(() => { virtualProgressRef.current = virtualProgress; }, [virtualProgress]);

  // Mark scene video as playing (shows it on screen)
  const handleVideoPlaying = useCallback((id: string) => {
    setVideoReady((prev) => {
      if (prev[id]) return prev;
      return { ...prev, [id]: true };
    });
  }, []);

  // Track video metadata loaded for the loading screen percentage
  const handleVideoLoaded = useCallback((id: string) => {
    if (videosLoadedRef.current[id]) return;
    videosLoadedRef.current[id] = true;
    const loaded = Object.values(videosLoadedRef.current).filter(Boolean).length;
    setLoadedCount(loaded);
    if (loaded === 9) setIsVideoLoaded(true);
  }, []);

  // Fallback: unblock UI after 4s even if some videos haven't fired loadedmetadata
  useEffect(() => {
    const timer = setTimeout(() => setIsVideoLoaded(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Derive activeSection and activeId from virtualProgress.
  // Use ref equality to skip setState when value is unchanged (runs 60×/s during tweens).
  useEffect(() => {
    let section = "design";
    if      (virtualProgress === 0.0)                            section = "design";
    else if (virtualProgress > 0.0 && virtualProgress < 0.25)   section = "scroll1";
    else if (virtualProgress === 0.25)                           section = "robot";
    else if (virtualProgress > 0.25 && virtualProgress < 0.50)  section = "scroll2";
    else if (virtualProgress === 0.50)                           section = "box";
    else if (virtualProgress > 0.50 && virtualProgress < 0.75)  section = "scroll3";
    else if (virtualProgress === 0.75)                           section = "workshop";
    else if (virtualProgress > 0.75 && virtualProgress < 1.0)   section = "scroll4";
    else if (virtualProgress === 1.0)                            section = "outro";

    if (section !== activeSectionRef.current) {
      activeSectionRef.current = section;
      setActiveSection(section);
    }

    let tabId = "design";
    if      (virtualProgress < 0.125)                                  tabId = "design";
    else if (virtualProgress >= 0.125 && virtualProgress < 0.375)     tabId = "robot";
    else if (virtualProgress >= 0.375 && virtualProgress < 0.625)     tabId = "box";
    else if (virtualProgress >= 0.625 && virtualProgress < 0.875)     tabId = "workshop";
    else                                                                tabId = "outro";

    if (tabId !== activeIdRef.current) {
      activeIdRef.current = tabId;
      setActiveId(tabId);
    }
  }, [virtualProgress]);

  // Scene video play/pause controller
  useEffect(() => {
    if (!isVideoLoaded) return;

    const sceneVideos = [
      { id: "design",   ref: scene1Ref },
      { id: "robot",    ref: scene2Ref },
      { id: "box",      ref: scene3Ref },
      { id: "workshop", ref: scene4Ref },
      { id: "outro",    ref: scene5Ref },
    ];

    sceneVideos.forEach(({ id, ref }) => {
      const video = ref.current;
      if (!video) return;
      if (id === activeSection) {
        // If the video was pre-started during transition it is already playing —
        // skip the reset to avoid the flash of opacity-0 before onPlaying fires.
        if (video.paused) {
          setVideoReady((prev) => ({ ...prev, [id]: false }));
          video.currentTime = 0;
          video.play().catch((err) => console.error(`Play error for ${id}:`, err));
        }
      } else {
        // Never pause the scene we intentionally pre-started behind the scroll layer.
        if (id !== preStartingSceneRef.current && !video.paused) video.pause();
        if (id !== preStartingSceneRef.current) {
          setVideoReady((prev) => ({ ...prev, [id]: false }));
        }
      }
    });
  }, [activeSection, isVideoLoaded]);

  const animationRef = useRef<gsap.core.Tween | null>(null);

  // Play scroll transition video + pre-start destination scene in background
  const playScrollVideo = useCallback((fromIndex: number, targetIndex: number) => {
    const scrollRefs = [scroll1Ref, scroll2Ref, scroll3Ref, scroll4Ref];
    const vid = scrollRefs[Math.min(fromIndex, targetIndex)]?.current;
    if (!vid) return vid;
    vid.currentTime = 0;
    vid.playbackRate = 1;
    vid.play().catch(() => {});

    // Pre-start destination scene video behind the scroll layer.
    // We mark it in preStartingSceneRef FIRST so the play/pause effect
    // (which will fire when activeSection flips to the scroll section)
    // does NOT immediately pause the video we're about to play.
    const sceneRefs = [scene1Ref, scene2Ref, scene3Ref, scene4Ref, scene5Ref];
    const destIds   = ["design", "robot", "box", "workshop", "outro"];
    const destId    = destIds[targetIndex];
    const destVid   = sceneRefs[targetIndex]?.current;
    if (destVid) {
      preStartingSceneRef.current = destId;
      setVideoReady((prev) => ({ ...prev, [destId]: false }));
      destVid.currentTime = 0;
      destVid.play().catch(() => {});
    }

    return vid;
  }, []);

  const transitionTo = useCallback((targetIndex: number, direction: 'forward' | 'back' = 'forward') => {
    if (isTransitioningRef.current) return;

    // Clear any pending loops
    Object.values(loopTimeoutsRef.current).forEach(clearTimeout);

    isTransitioningRef.current = true;
    setIsTransitioning(true);

    const fromIndex = currentSceneIndexRef.current;
    setCurrentSceneIndex(targetIndex);

    const targetProgress = targetIndex * 0.25;
    animationRef.current?.kill();

    if (direction === 'back') {
      // Instant jump backwards — no scroll video, no tween through a scroll section.
      // Directly land on the previous scene.
      preStartingSceneRef.current = null;
      virtualProgressRef.current = targetProgress;
      setVirtualProgress(targetProgress);
      isTransitioningRef.current = false;
      setIsTransitioning(false);
      return;
    }

    // --- Forward transition: play scroll video then show scene from start ---
    const sceneRefs = [scene1Ref, scene2Ref, scene3Ref, scene4Ref, scene5Ref];
    const destIds   = ["design", "robot", "box", "workshop", "outro"];
    const destId    = destIds[targetIndex];

    const scrollVid = playScrollVideo(fromIndex, targetIndex);
    const duration  = getTransitionDuration(fromIndex, targetIndex);

    const dummy = { progress: virtualProgressRef.current };
    animationRef.current = gsap.to(dummy, {
      progress: targetProgress,
      duration,
      ease: TRANSITION_EASE,
      onUpdate: () => setVirtualProgress(dummy.progress),
      onComplete: () => {
        scrollVid?.pause();
        // Reset destination scene to the beginning — it was pre-started during
        // the transition and is now several seconds in. Seek back to 0 so the
        // user always sees the scene from its first frame.
        const destVid = sceneRefs[targetIndex]?.current;
        if (destVid) {
          setVideoReady((prev) => ({ ...prev, [destId]: false }));
          destVid.currentTime = 0;
          destVid.play().catch(() => {});
        }
        preStartingSceneRef.current = null;
        isTransitioningRef.current = false;
        setIsTransitioning(false);
      },
    });
  }, [playScrollVideo]);

  useEffect(() => { transitionToRef.current = transitionTo; }, [transitionTo]);

  // Wheel and keyboard scroll gestures
  useEffect(() => {
    if (!isVideoLoaded) return;

    let cooldown = false;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isTransitioningRef.current || cooldown) return;
      if (Math.abs(e.deltaY) < 1) return;

      const idx = currentSceneIndexRef.current;
      if (e.deltaY > 0) { if (idx < 4) transitionToRef.current(idx + 1, 'forward'); }
      else              { if (idx > 0) transitionToRef.current(idx - 1, 'back'); }

      cooldown = true;
      setTimeout(() => { cooldown = false; }, 300);
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (isTransitioningRef.current || cooldown) return;
      const diff = touchStartY - e.touches[0].clientY;
      if (Math.abs(diff) < 5) return;

      const idx = currentSceneIndexRef.current;
      if (diff > 0) { if (idx < 4) transitionToRef.current(idx + 1, 'forward'); }
      else          { if (idx > 0) transitionToRef.current(idx - 1, 'back'); }

      cooldown = true;
      setTimeout(() => { cooldown = false; }, 300);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowDown","PageDown","ArrowUp","PageUp"].includes(e.key)) e.preventDefault();
      if (isTransitioningRef.current || cooldown) return;

      const idx = currentSceneIndexRef.current;
      if (e.key === "ArrowDown" || e.key === "PageDown") { if (idx < 4) transitionToRef.current(idx + 1, 'forward'); }
      if (e.key === "ArrowUp"   || e.key === "PageUp")   { if (idx > 0) transitionToRef.current(idx - 1, 'back'); }
    };

    window.addEventListener("wheel",      handleWheel,     { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true  });
    window.addEventListener("touchmove",  handleTouchMove,  { passive: false });
    window.addEventListener("keydown",    handleKeyDown);

    return () => {
      window.removeEventListener("wheel",      handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove",  handleTouchMove);
      window.removeEventListener("keydown",    handleKeyDown);
    };
  }, [isVideoLoaded]);



  const loadingPercentage = Math.min(100, Math.floor((loadedCount / 9) * 100));

  const activeSceneData = videoSections.find((s) => s.id === activeId);
  const showTextCard = isVideoLoaded && activeSection === activeId;

  // Helper: is a given section active (visible on screen)?
  const sectionActive = (id: string) => isVideoLoaded && activeSection === id;

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative w-full h-screen overflow-hidden bg-[#0A0F1E] flex items-center justify-center"
    >
      {/* Background decorative grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e3a8a_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 -z-30" />
      <div className="absolute -top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#2563EB]/10 blur-3xl -z-20" />

      {/* ── Scene 1 (design) ── */}
      <div className={`absolute inset-0 w-full h-full ${
        (sectionActive("design") || sectionActive("scroll1")) ? "opacity-100 z-10" : "opacity-0 z-0"
      }`}>
        <video ref={scene1Ref}
          onPlaying={() => handleVideoPlaying("design")}
          onTimeUpdate={() => handleVideoPlaying("design")}
          onLoadedMetadata={() => handleVideoLoaded("design")}
          onEnded={() => handleVideoEnded("design", scene1Ref)}
          playsInline muted autoPlay preload="auto"
          className={`absolute inset-0 w-full h-full object-cover ${videoReady["design"] ? "opacity-100" : "opacity-0"}`}
        >
          <source src="/videos/scene1.mp4" type="video/mp4" />
        </video>
      </div>

      {/* ── Scroll 1 (transition) ── */}
      <div className={`absolute inset-0 w-full h-full ${
        (sectionActive("scroll1") || (sectionActive("robot") && !videoReady["robot"]) || (sectionActive("design") && !videoReady["design"]))
          ? "opacity-100 z-20" : "opacity-0 z-0"
      }`}>
        <video ref={scroll1Ref} onLoadedMetadata={() => handleVideoLoaded("scroll1")}
          playsInline muted preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/scroll1.mp4" type="video/mp4" />
        </video>
      </div>

      {/* ── Scene 2 (robot) ── */}
      <div className={`absolute inset-0 w-full h-full ${
        (sectionActive("robot") || sectionActive("scroll1") || sectionActive("scroll2")) ? "opacity-100 z-10" : "opacity-0 z-0"
      }`}>
        <video ref={scene2Ref}
          onPlaying={() => handleVideoPlaying("robot")}
          onTimeUpdate={() => handleVideoPlaying("robot")}
          onLoadedMetadata={() => handleVideoLoaded("robot")}
          onEnded={() => handleVideoEnded("robot", scene2Ref)}
          playsInline muted preload="auto"
          className={`absolute inset-0 w-full h-full object-cover ${videoReady["robot"] ? "opacity-100" : "opacity-0"}`}
        >
          <source src="/videos/scene2.mp4" type="video/mp4" />
        </video>
      </div>

      {/* ── Scroll 2 (transition) ── */}
      <div className={`absolute inset-0 w-full h-full ${
        (sectionActive("scroll2") || (sectionActive("box") && !videoReady["box"]) || (sectionActive("robot") && !videoReady["robot"]))
          ? "opacity-100 z-20" : "opacity-0 z-0"
      }`}>
        <video ref={scroll2Ref} onLoadedMetadata={() => handleVideoLoaded("scroll2")}
          playsInline muted preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/scroll2.mp4" type="video/mp4" />
        </video>
      </div>

      {/* ── Scene 3 (box) ── */}
      <div className={`absolute inset-0 w-full h-full ${
        (sectionActive("box") || sectionActive("scroll2") || sectionActive("scroll3")) ? "opacity-100 z-10" : "opacity-0 z-0"
      }`}>
        <video ref={scene3Ref}
          onPlaying={() => handleVideoPlaying("box")}
          onTimeUpdate={() => handleVideoPlaying("box")}
          onLoadedMetadata={() => handleVideoLoaded("box")}
          onEnded={() => handleVideoEnded("box", scene3Ref)}
          playsInline muted preload="auto"
          className={`absolute inset-0 w-full h-full object-cover ${videoReady["box"] ? "opacity-100" : "opacity-0"}`}
        >
          <source src="/videos/scene3.mp4" type="video/mp4" />
        </video>
      </div>

      {/* ── Scroll 3 (transition) ── */}
      <div className={`absolute inset-0 w-full h-full ${
        (sectionActive("scroll3") || (sectionActive("workshop") && !videoReady["workshop"]) || (sectionActive("box") && !videoReady["box"]))
          ? "opacity-100 z-20" : "opacity-0 z-0"
      }`}>
        <video ref={scroll3Ref} onLoadedMetadata={() => handleVideoLoaded("scroll3")}
          playsInline muted preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/scroll3.mp4" type="video/mp4" />
        </video>
      </div>

      {/* ── Scene 4 (workshop) ── */}
      <div className={`absolute inset-0 w-full h-full ${
        (sectionActive("workshop") || sectionActive("scroll3") || sectionActive("scroll4")) ? "opacity-100 z-10" : "opacity-0 z-0"
      }`}>
        <video ref={scene4Ref}
          onPlaying={() => handleVideoPlaying("workshop")}
          onTimeUpdate={() => handleVideoPlaying("workshop")}
          onLoadedMetadata={() => handleVideoLoaded("workshop")}
          onEnded={() => handleVideoEnded("workshop", scene4Ref)}
          playsInline muted preload="auto"
          className={`absolute inset-0 w-full h-full object-cover ${videoReady["workshop"] ? "opacity-100" : "opacity-0"}`}
        >
          <source src="/videos/scene4.mp4" type="video/mp4" />
        </video>
      </div>

      {/* ── Scroll 4 (transition) ── */}
      <div className={`absolute inset-0 w-full h-full ${
        (sectionActive("scroll4") || (sectionActive("outro") && !videoReady["outro"]) || (sectionActive("workshop") && !videoReady["workshop"]))
          ? "opacity-100 z-20" : "opacity-0 z-0"
      }`}>
        <video ref={scroll4Ref} onLoadedMetadata={() => handleVideoLoaded("scroll4")}
          playsInline muted preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/scroll4.mp4" type="video/mp4" />
        </video>
      </div>

      {/* ── Scene 5 (outro) ── */}
      <div className={`absolute inset-0 w-full h-full ${
        (sectionActive("outro") || sectionActive("scroll4")) ? "opacity-100 z-10" : "opacity-0 z-0"
      }`}>
        <video ref={scene5Ref}
          onPlaying={() => handleVideoPlaying("outro")}
          onTimeUpdate={() => handleVideoPlaying("outro")}
          onLoadedMetadata={() => handleVideoLoaded("outro")}
          onEnded={() => handleVideoEnded("outro", scene5Ref)}
          playsInline muted preload="auto"
          className={`absolute inset-0 w-full h-full object-cover ${videoReady["outro"] ? "opacity-100" : "opacity-0"}`}
        >
          <source src="/videos/scene5.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Loading overlay */}
      {!isVideoLoaded && (
        <div className="absolute inset-0 flex flex-col justify-center items-center gap-4 bg-[#0A0F1E] z-50">
          <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-[#2563EB] animate-spin" />
          <span className="text-xs uppercase tracking-widest text-white font-medium">
            Loading experience... {loadingPercentage}%
          </span>
        </div>
      )}

      {/* Floating Scene Information Card */}
      <div className={`absolute bottom-12 left-1/2 -translate-x-1/2 z-30 w-[90%] max-w-2xl rounded-2xl bg-blue-600/90 backdrop-blur-md border border-blue-400/40 shadow-[0_0_50px_rgba(37,99,235,0.4)] p-6 text-white text-center transition-all duration-500 transform ${
        showTextCard ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
      }`}>
        <h2 className="text-xl md:text-2xl font-extrabold tracking-wider mb-2 uppercase drop-shadow">
          {activeSceneData?.title}
        </h2>
        <p className="text-xs md:text-sm text-blue-100 font-medium tracking-wide">
          {activeSceneData?.sub}
        </p>
      </div>

    </section>
  );
}
