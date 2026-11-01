'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, ShieldCheck, Menu, X, PhoneCall, Truck } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

interface NavbarProps {
  cartCount?: number;
}

export function Navbar({ cartCount }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalCount, openCart } = useCart();

  const displayCount = typeof cartCount === 'number' ? cartCount : totalCount;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/8 bg-[#07070A]/85 backdrop-blur-2xl shadow-2xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-black tracking-tighter text-foreground sm:text-3xl">
            SOLE<span className="text-accent underline decoration-accent/40 decoration-4 underline-offset-4">VAULT</span>
          </span>
          <span className="hidden rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent sm:inline-block">
            Egypt
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 text-sm font-semibold tracking-wide md:flex">
          <Link href="/#products" className="text-muted transition-colors hover:text-accent">
            أحدث الكوتشيات
          </Link>
          <Link href="/track" className="text-muted transition-colors hover:text-accent flex items-center gap-1.5">
            <Truck className="h-4 w-4 text-accent" />
            <span>تتبع شحنتك</span>
          </Link>
          <Link href="/shipping" className="text-muted transition-colors hover:text-accent">
            الشحن والاستلام
          </Link>
          <Link href="/returns" className="text-muted transition-colors hover:text-accent">
            سياسة الاسترجاع (14 يوم)
          </Link>
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-3">
          
          {/* WhatsApp Support */}
          <a
            href="https://wa.me/201000000000?text=مرحباً%20سول%20فولت،%20عندي%20استفسار%20عن%20كوتشي"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg bg-surface-elevated border border-border px-3 py-1.5 text-xs font-bold text-foreground transition-colors hover:border-success hover:text-success"
          >
            <PhoneCall className="h-3.5 w-3.5 text-success" />
            <span className="hidden sm:inline">واتساب الدعم</span>
          </a>

          {/* Cart Icon / Open Slide-Out Cart */}
          <button
            type="button"
            onClick={openCart}
            className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-background transition-transform hover:scale-105 active:scale-95 shadow-md cursor-pointer"
            aria-label="فتح سلة المشتريات"
          >
            <ShoppingBag className="h-5 w-5 stroke-[2.5]" />
            {displayCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-[10px] font-black text-white ring-2 ring-background animate-pulse">
                {displayCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground hover:bg-surface-elevated md:hidden"
            aria-label="القائمة"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-surface px-5 py-6 md:hidden">
          <nav className="flex flex-col gap-4 text-sm font-bold text-foreground">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openCart();
              }}
              className="flex items-center justify-between py-2 text-foreground font-black border-b border-border/60"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-accent" />
                <span>سلة المشتريات</span>
              </div>
              {displayCount > 0 && (
                <span className="rounded-full bg-danger text-white text-[10px] px-2 py-0.5 font-black">
                  {displayCount} قطع
                </span>
              )}
            </button>
            <Link
              href="/#products"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-muted hover:text-accent"
            >
              أحدث الكوتشيات
            </Link>
            <Link
              href="/track"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-accent flex items-center gap-2"
            >
              <Truck className="h-4 w-4" />
              <span>تتبع شحنتك وأوردرك</span>
            </Link>
            <Link
              href="/shipping"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-muted hover:text-accent"
            >
              الشحن والتوصيل
            </Link>
            <Link
              href="/returns"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-muted hover:text-accent"
            >
              سياسة الاستبدال والاسترجاع
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
