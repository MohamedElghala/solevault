'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Eye, Sparkles, ShieldCheck, Check, Layers, ChevronRight, ChevronLeft } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface CinematicShoeViewerProps {
  imageSrc: string;
  images?: string[];
  title: string;
  price: number;
  originalPrice: number;
}

export function CinematicShoeViewer({
  imageSrc,
  images = [],
  title,
  price,
  originalPrice,
}: CinematicShoeViewerProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [activeAngleIndex, setActiveAngleIndex] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const allImages = images.length > 0 ? images : [
    imageSrc,
    'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=85'
  ];

  const currentImage = allImages[activeAngleIndex] || imageSrc;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -14;
    const rotY = ((x - centerX) / centerX) * 14;

    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setActiveHotspot(null);
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-2 sm:p-4 select-none">
      
      {/* 1. Volumetric Overhead Vault Spotlight */}
      <div className="absolute -top-16 inset-x-12 h-64 bg-gradient-to-b from-accent/20 via-accent/5 to-transparent blur-3xl pointer-events-none rounded-[100%]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-accent/10 blur-[90px] animate-glow pointer-events-none" />

      {/* 2. Main 3D Showcase Stage */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: isHovered ? 'none' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="relative aspect-square w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-[#14141A]/90 via-[#0C0C10]/95 to-[#050508] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.9)] backdrop-blur-2xl cursor-grab active:cursor-grabbing group"
      >
        {/* Subtle Specular Top Highlight */}
        <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        {/* Top Header Floating Badges */}
        <div className="absolute top-5 inset-x-5 z-20 flex items-center justify-between pointer-events-none">
          
          {/* Hologram Authenticity Tag */}
          <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/70 px-3.5 py-1.5 backdrop-blur-xl shadow-xl pointer-events-auto">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span className="text-[10px] font-black tracking-widest text-white uppercase font-mono">
              VERIFIED AUTHENTIC
            </span>
          </div>

          {/* Cairo Vault Badge */}
          <div className="flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.2 text-[11px] font-black text-accent backdrop-blur-md">
            <Sparkles className="h-3 w-3" />
            <span>إصدار شتاء 2026 الحصري</span>
          </div>
        </div>

        {/* 3. The Sneaker Floating Stage & Pedestal */}
        <div className="relative h-full w-full flex items-center justify-center pt-4">
          
          {/* Dual Elliptical Pedestal Platform */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 h-14 w-72 rounded-[100%] border border-accent/25 bg-accent/5 shadow-[0_0_40px_rgba(201,255,0,0.2)] pointer-events-none" />
          <div className="absolute bottom-18 left-1/2 -translate-x-1/2 h-8 w-56 rounded-[100%] border border-cyan-400/20 bg-cyan-400/5 blur-xs pointer-events-none" />
          
          {/* Dynamic Ground Shadow */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 h-6 w-52 rounded-[100%] bg-black/80 blur-lg animate-shadow pointer-events-none" />

          {/* Floating Sneaker Object */}
          <div className="relative h-64 w-64 sm:h-80 sm:w-80 animate-float transition-all duration-500">
            <Image
              src={currentImage}
              alt={title}
              fill
              priority
              className="object-contain filter drop-shadow-[0_35px_35px_rgba(0,0,0,0.85)] brightness-110 contrast-105 group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Interactive Inspection Hotspots */}
          <button
            onClick={() => setActiveHotspot(activeHotspot === 'cushion' ? null : 'cushion')}
            className="absolute top-1/2 right-12 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-accent/80 text-background font-black text-xs shadow-lg hover:scale-125 transition-transform"
            title="تقنية النعل الممتص للصدمات"
          >
            +
          </button>
          {activeHotspot === 'cushion' && (
            <div className="absolute top-1/2 right-20 z-30 rounded-xl border border-accent/40 bg-black/90 p-2.5 text-xs text-foreground shadow-2xl backdrop-blur-md animate-fade-in w-44">
              <div className="font-bold text-accent">تقنية Air Matrix 2.0</div>
              <div className="text-[10px] text-muted mt-0.5">نعل داخلي طبي مبطن لراحة تامة طول اليوم</div>
            </div>
          )}

          <button
            onClick={() => setActiveHotspot(activeHotspot === 'leather' ? null : 'leather')}
            className="absolute top-1/3 left-12 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-accent/80 text-background font-black text-xs shadow-lg hover:scale-125 transition-transform"
            title="خامات الجلد والتقفيل"
          >
            +
          </button>
          {activeHotspot === 'leather' && (
            <div className="absolute top-1/3 left-20 z-30 rounded-xl border border-accent/40 bg-black/90 p-2.5 text-xs text-foreground shadow-2xl backdrop-blur-md animate-fade-in w-44">
              <div className="font-bold text-accent">خامات ماستر كواليتي</div>
              <div className="text-[10px] text-muted mt-0.5">جلد طبيعي مسامي مع خياطة مزدوجة متينة</div>
            </div>
          )}
        </div>

        {/* 4. Bottom Angle Switcher Bar */}
        <div className="absolute bottom-20 inset-x-0 z-20 flex items-center justify-center gap-2">
          {allImages.slice(0, 3).map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setActiveAngleIndex(idx);
              }}
              className={`h-1.5 rounded-full transition-all ${
                activeAngleIndex === idx ? 'w-8 bg-accent' : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Angle ${idx + 1}`}
            />
          ))}
        </div>

        {/* 5. Card Footer Info Glass Box */}
        <div className="absolute bottom-4 inset-x-4 z-20 rounded-2xl border border-white/10 bg-[#0A0A0E]/90 p-4 backdrop-blur-xl flex items-center justify-between shadow-2xl">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-accent uppercase tracking-wider">
              <span>[ CAIRO VAULT READY ]</span>
              <span>•</span>
              <span className="text-white">معاينة قبل الدفع 100%</span>
            </div>
            <h4 className="text-sm font-black text-foreground mt-0.5">{title}</h4>
          </div>
          <div className="text-left">
            <span className="text-lg font-black text-accent">{formatPrice(price)} ج.م</span>
            <span className="block text-[11px] line-through text-muted/70">{formatPrice(originalPrice)} ج.م</span>
          </div>
        </div>

      </div>

      {/* Micro Interactive Guide */}
      <div className="mt-3 flex items-center gap-2 text-[11px] font-bold text-muted/70">
        <Eye className="h-3.5 w-3.5 text-accent" />
        <span>حرّك الماوس للتفاعل ثلاثي الأبعاد 3D واضغط (+) لتفاصيل الخامات</span>
      </div>

    </div>
  );
}
