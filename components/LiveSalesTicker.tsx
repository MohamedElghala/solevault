'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Flame, X, ShieldCheck } from 'lucide-react';

const RECENT_SALES = [
  {
    name: 'أحمد م.',
    city: 'القاهرة (مدينة نصر)',
    product: 'Air Phantom Edge "Ghost Black"',
    size: 'مقاس 42',
    timeAgo: 'منذ دقيقتين',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=150&q=80',
  },
  {
    name: 'عمر ش.',
    city: 'الجيزة (الشيخ زايد)',
    product: 'Shadow Vault "Retro Cream"',
    size: 'مقاس 43',
    timeAgo: 'منذ 5 دقائق',
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=150&q=80',
  },
  {
    name: 'كريم ع.',
    city: 'الإسكندرية (سموحة)',
    product: 'Apex Runner "Neon Pulse"',
    size: 'مقاس 41',
    timeAgo: 'منذ 9 دقائق',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=150&q=80',
  },
  {
    name: 'طارق ص.',
    city: 'الدقهلية (المنصورة)',
    product: 'Air Phantom Edge "Ghost Black"',
    size: 'مقاس 44',
    timeAgo: 'منذ 14 دقيقة',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=150&q=80',
  },
];

export function LiveSalesTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Initial delay before showing first notification
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 2500);

    // Interval to cycle through sales
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % RECENT_SALES.length);
        setIsVisible(true);
      }, 600);
    }, 7000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  if (isDismissed) return null;

  const current = RECENT_SALES[currentIndex];

  return (
    <div
      className={`fixed bottom-5 left-5 z-40 max-w-sm transition-all duration-500 ease-out ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div className="relative flex items-center gap-3.5 rounded-2xl border border-accent/40 bg-surface/95 p-3.5 shadow-2xl backdrop-blur-xl glow-accent">
        
        {/* Dismiss Button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-surface-elevated border border-border text-muted hover:text-foreground text-[10px]"
          aria-label="إغلاق التنبيه"
        >
          <X className="h-3 w-3" />
        </button>

        {/* Thumbnail */}
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-border bg-surface-elevated">
          <Image
            src={current.image}
            alt={current.product}
            fill
            className="object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-grow text-xs space-y-0.5 text-right">
          <div className="flex items-center gap-1.5 font-bold text-foreground">
            <Flame className="h-3.5 w-3.5 text-accent animate-pulse" />
            <span>طلب شراء جديد مؤكد ✓</span>
          </div>

          <p className="text-[11px] text-muted truncate max-w-[210px]">
            <strong className="text-foreground">{current.name}</strong> من {current.city}
          </p>

          <p className="text-[10px] text-accent font-semibold truncate max-w-[210px]">
            اشترى {current.product} ({current.size})
          </p>
        </div>

        <span className="text-[9px] text-muted shrink-0 self-end">
          {current.timeAgo}
        </span>
      </div>
    </div>
  );
}
