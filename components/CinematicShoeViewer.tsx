'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Eye, Sparkles } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface CinematicShoeViewerProps {
  imageSrc: string;
  title: string;
  price: number;
  originalPrice: number;
}

export function CinematicShoeViewer({
  imageSrc,
  title,
  price,
  originalPrice,
}: CinematicShoeViewerProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -12;
    const rotY = ((x - centerX) / centerX) * 12;

    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      
      {/* Background Radial Glow */}
      <div className="absolute h-72 w-72 rounded-full bg-accent/15 blur-3xl animate-glow pointer-events-none" />

      {/* 3D Tilt Card Container */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: isHovered ? 'none' : 'transform 0.5s ease-out',
        }}
        className="relative aspect-square w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-surface-elevated via-surface to-background p-6 shadow-2xl backdrop-blur-xl glow-accent-hover cursor-grab active:cursor-grabbing"
      >
        {/* Floating Tag */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-full border border-accent/40 bg-background/80 px-3 py-1 text-xs font-black text-accent backdrop-blur-md shadow-md">
          <Sparkles className="h-3.5 w-3.5" />
          <span>إصدار 2026 الحصري</span>
        </div>

        {/* 360 Hint */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1 rounded-full border border-white/10 bg-background/70 px-2.5 py-1 text-[10px] font-bold text-muted backdrop-blur-md">
          <Eye className="h-3 w-3 text-accent" />
          <span>تفاعل ثلاثي الأبعاد 3D</span>
        </div>

        {/* Sneaker Image with Cinematic Float */}
        <div className="relative h-full w-full flex items-center justify-center pt-2">
          <div className="relative h-64 w-64 sm:h-72 sm:w-72 animate-float">
            <Image
              src={imageSrc}
              alt={title}
              fill
              priority
              className="object-contain drop-shadow-[0_25px_25px_rgba(0,0,0,0.8)] filter brightness-105 contrast-105"
            />
          </div>
        </div>

        {/* Dynamic Floor Shadow */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 h-6 w-48 rounded-[100%] bg-black/60 blur-md animate-shadow pointer-events-none" />

        {/* Card Footer Info */}
        <div className="absolute bottom-4 inset-x-4 z-20 rounded-2xl border border-white/10 bg-background/85 p-3.5 backdrop-blur-xl flex items-center justify-between shadow-lg">
          <div>
            <h4 className="text-sm font-black text-foreground">{title}</h4>
            <p className="text-[11px] text-muted">ضمان معاينة قبل الدفع</p>
          </div>
          <div className="text-left">
            <span className="text-base font-black text-accent">{formatPrice(price)} ج.م</span>
            <span className="block text-[10px] line-through text-muted">{formatPrice(originalPrice)} ج.م</span>
          </div>
        </div>
      </div>
    </div>
  );
}
