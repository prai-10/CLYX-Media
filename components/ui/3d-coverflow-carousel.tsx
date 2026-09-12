"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CoverflowItem {
  id: string;
  title: string;
  tag?: string;
  subtitle?: string;
  description: string;
  imageUrl: string;
  badge?: string;
  category?: string;
  onAction?: () => void;
}

const defaultItems: CoverflowItem[] = [
  {
    id: "lumina-skin",
    title: "LUMINA SKINCARE",
    tag: "#BeautyScale",
    subtitle: "CREATOR WHITELISTING",
    description: "Scaled a clean skincare startup from ₹8L/mo to ₹48L/mo in 90 days pairing 18 dermatologist UGC hooks.",
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop",
    badge: "4.4X ROAS",
    category: "beauty",
  },
  {
    id: "aethel-apparel",
    title: "AETHEL LUXURY STREETWEAR",
    tag: "#StreetwearDrop",
    subtitle: "VIRAL REELS CRO",
    description: "Generated ₹1.2Cr in collection drops within 48 hours using viral streetwear transition reels.",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
    badge: "3.9X ROAS",
    category: "fashion",
  },
  {
    id: "nutra-boost",
    title: "APEX PERFORMANCE NUTRITION",
    tag: "#PerformanceFuel",
    subtitle: "SUB-SECOND CHECKOUT",
    description: "Transformed a sports electrolyte blend into a top-selling morning ritual product via fitness creators.",
    imageUrl: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=1000&auto=format&fit=crop",
    badge: "3.6X ROAS",
    category: "food",
  },
  {
    id: "volt-audio",
    title: "VOLT HI-FI AUDIO",
    tag: "#HiFiAudio",
    subtitle: "3D ADS ENGINE",
    description: "Scaled premium noise-canceling headphones to #1 trending tech product on Instagram Reels.",
    imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1000&auto=format&fit=crop",
    badge: "5.1X ROAS",
    category: "tech",
  },
  {
    id: "sol-botanicals",
    title: "SOL BOTANICAL ELIXIRS",
    tag: "#BotanicalGlow",
    subtitle: "DERM FORMULATIONS",
    description: "Built a 30-creator whitelisting engine around certified trichologist recommendations driving 4.8X ROAS.",
    imageUrl: "https://images.unsplash.com/photo-1608248597359-bb472b5fca52?q=80&w=1000&auto=format&fit=crop",
    badge: "4.8X ROAS",
    category: "beauty",
  },
];

export interface CoverflowCarouselProps {
  items?: CoverflowItem[];
  className?: string;
  initialIndex?: number;
  onItemSelect?: (item: CoverflowItem, index: number) => void;
}

export function CoverflowCarousel({
  items = defaultItems,
  className,
  initialIndex = 1,
  onItemSelect,
}: CoverflowCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(
    Math.min(initialIndex, Math.max(0, items.length - 1))
  );

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      else if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  if (!items || items.length === 0) return null;

  const activeItem = items[activeIndex];

  return (
    <div className={cn("relative w-full max-w-6xl mx-auto py-12 px-4", className)}>
      {/* Ambient background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-700 opacity-40 dark:opacity-30"
        style={{
          background:
            activeItem.category === "beauty"
              ? "radial-gradient(circle, #f472b6 0%, #3b82f6 60%, transparent 80%)"
              : activeItem.category === "fashion"
              ? "radial-gradient(circle, #facc15 0%, #003aa3 60%, transparent 80%)"
              : activeItem.category === "food"
              ? "radial-gradient(circle, #fb923c 0%, #003aa3 60%, transparent 80%)"
              : "radial-gradient(circle, #38bdf8 0%, #6366f1 60%, transparent 80%)",
        }}
      />

      {/* 3D Stage */}
      <div
        className="relative w-full h-[540px] flex items-center justify-center overflow-visible"
        style={{ perspective: 1200 }}
      >
        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          aria-label="Previous"
          className="absolute left-4 md:left-8 z-40 w-12 h-12 rounded-full bg-black/60 hover:bg-yellow-400 hover:text-black text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-2xl cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next"
          className="absolute right-4 md:right-8 z-40 w-12 h-12 rounded-full bg-black/60 hover:bg-yellow-400 hover:text-black text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-2xl cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* 3D Cards Track */}
        <div className="relative w-full h-full flex items-center justify-center [transform-style:preserve-3d]">
          {items.map((item, index) => {
            const offset = index - activeIndex;
            const absOffset = Math.abs(offset);
            const isCenter = offset === 0;

            const dir = Math.sign(offset);
            const tx = isCenter ? 0 : dir * (270 * Math.min(absOffset, 2) + 20);
            const tz = isCenter ? 0 : -absOffset * 130;
            const ry = isCenter ? 0 : -dir * (absOffset === 1 ? 32 : 44);
            const scale = isCenter ? 1 : Math.max(0.68, 1 - absOffset * 0.13);
            const opacity = isCenter ? 1 : absOffset === 1 ? 0.82 : absOffset === 2 ? 0.45 : 0;
            const brightness = isCenter ? 1 : absOffset === 1 ? 0.6 : 0.35;
            const zIndex = 25 - absOffset * 3;

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (!isCenter) {
                    setActiveIndex(index);
                  } else if (onItemSelect) {
                    onItemSelect(item, index);
                  }
                }}
                className={cn(
                  "absolute w-[340px] md:w-[360px] h-[500px] md:h-[530px] rounded-[28px] overflow-hidden border transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer select-none",
                  isCenter
                    ? "border-yellow-400/80 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.95),0_0_45px_rgba(255,230,0,0.3)]"
                    : "border-white/10"
                )}
                style={{
                  transform: `translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) scale(${scale})`,
                  opacity,
                  filter: `brightness(${brightness})`,
                  zIndex,
                  pointerEvents: absOffset <= 2 ? "auto" : "none",
                }}
              >
                {/* Background Image */}
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                  priority={isCenter}
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/95 z-10 pointer-events-none" />

                {/* Content Overlay */}
                <div className="relative z-20 w-full h-full p-6 md:p-7 flex flex-col justify-between text-white">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    {item.badge && (
                      <span className="bg-yellow-400 text-black font-extrabold text-xs px-3 py-1 rounded-full shadow-lg">
                        {item.badge}
                      </span>
                    )}
                    {item.tag && (
                      <span className="font-mono text-xs md:text-sm font-bold text-white/90 drop-shadow">
                        {item.tag}
                      </span>
                    )}
                  </div>

                  {/* Bottom Information */}
                  <div className="flex flex-col items-center text-center">
                    <h3 className="font-extrabold text-xl md:text-2xl uppercase tracking-tight text-white mb-1 drop-shadow-md">
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <div className="text-xs font-bold uppercase tracking-widest text-yellow-400 mb-3">
                        — {item.subtitle}
                      </div>
                    )}
                    <p className="text-sm leading-relaxed text-white/90 line-clamp-2 mb-5 drop-shadow">
                      {item.description}
                    </p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (item.onAction) item.onAction();
                        else if (onItemSelect) onItemSelect(item, index);
                      }}
                      className="inline-flex items-center justify-center gap-2 bg-[#e8d8c8] hover:bg-yellow-400 text-black font-extrabold text-xs tracking-wider uppercase px-6 py-2.5 rounded-full shadow-xl transition-all duration-200 hover:scale-105 cursor-pointer"
                    >
                      <span>VIEW CASE STUDY</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center justify-center gap-2.5 mt-8">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to item ${index + 1}`}
            className={cn(
              "h-2.5 rounded-full transition-all duration-300 cursor-pointer",
              index === activeIndex
                ? "w-7 bg-yellow-400 shadow-[0_0_12px_rgba(255,230,0,0.6)]"
                : "w-2.5 bg-white/20 hover:bg-white/40"
            )}
          />
        ))}
      </div>
    </div>
  );
}
