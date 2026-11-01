'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { INITIAL_ORDERS } from '@/lib/mock-data';
import { Order } from '@/types';
import { getSupabaseOrderByQuery } from '@/lib/supabase';
import { formatPrice } from '@/lib/utils';

export default function TrackOrderPage() {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setSearched(true);
    const cleanQuery = query.trim();

    // Check Supabase first (solevault_orders)
    try {
      const dbOrder = await getSupabaseOrderByQuery(cleanQuery);
      if (dbOrder) {
        setFoundOrder(dbOrder as Order);
        return;
      }
    } catch {
      // fallback to mock
    }

    // Match by mock INITIAL_ORDERS
    const match = INITIAL_ORDERS.find(
      (o) =>
        o.order_number.toLowerCase().includes(cleanQuery.toLowerCase()) ||
        o.customer_phone.includes(cleanQuery)
    );

    setFoundOrder(match || null);
  };

  const getStepStatus = (orderStatus: string, stepIndex: number) => {
    const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = statuses.indexOf(orderStatus);

    if (orderStatus === 'returned' || orderStatus === 'cancelled') {
      return stepIndex === 0 ? 'completed' : 'failed';
    }

    if (currentIndex >= stepIndex) return 'completed';
    if (currentIndex + 1 === stepIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-accent">
          SOLEVAULT LOGISTICS
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-foreground">
          تتبع شحنتك وأوردر الكوتشي
        </h1>
        <p className="text-sm text-muted max-w-md mx-auto">
          اكتب رقم هاتفك أو رقم الأوردر (مثال: SV-2026-101) لمعرفة خط سير شحنتك وميعاد وصول المندوب.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto">
        <div className="relative flex items-center">
          <input
            type="text"
            required
            placeholder="اكتب رقم الموبايل أو رقم الأوردر هنا..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-2xl border border-border bg-surface px-5 py-4 pl-32 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none transition-colors shadow-lg"
          />
          <button
            type="submit"
            className="absolute left-2 rounded-xl bg-accent px-6 py-2.5 text-xs font-black text-background hover:bg-accent-hover transition-all hover:scale-105 active:scale-95 shadow-md flex items-center gap-1.5"
          >
            <Search className="h-4 w-4" />
            <span>بحث</span>
          </button>
        </div>
      </form>

      {/* Search Results */}
      {searched && (
        <div className="space-y-8 animate-fade-in">
          {foundOrder ? (
            <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 space-y-8 shadow-2xl">
              
              {/* Order Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-6">
                <div>
                  <span className="text-xs font-bold text-muted">رقم الشحنة:</span>
                  <h3 className="text-2xl font-black font-mono text-accent">
                    {foundOrder.order_number}
                  </h3>
                  <p className="text-xs text-muted mt-0.5">
                    العميل: <strong className="text-foreground">{foundOrder.customer_name}</strong> ({foundOrder.governorate} - {foundOrder.city})
                  </p>
                </div>

                <div className="text-left">
                  <span className="text-xs font-bold text-muted">شركة الشحن:</span>
                  <div className="text-sm font-black text-foreground">
                    {foundOrder.shipping_carrier || 'بوسطة (Bosta)'}
                  </div>
                  {foundOrder.tracking_number && (
                    <span className="text-[11px] font-mono text-accent block">
                      بوليصة: {foundOrder.tracking_number}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Steps Timeline */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-foreground">خط سير الشحنة:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {[
                    { title: '1. تم تسجيل الطلب', desc: 'تم استلام بياناتك بنجاح', index: 0 },
                    { title: '2. تم التأكيد هاتفياً', desc: 'تأكيد المقاس وميعاد الشحن', index: 1 },
                    { title: '3. مع مندوب الشحن', desc: 'خرج الكوتشي في خط السير', index: 3 },
                    { title: '4. تم التسليم', desc: 'عاينت الكوتشي واستلمت', index: 4 },
                  ].map((step) => {
                    const status = getStepStatus(foundOrder.order_status, step.index);

                    return (
                      <div
                        key={step.index}
                        className={`rounded-2xl border p-4 space-y-1.5 transition-all ${
                          status === 'completed'
                            ? 'border-accent/60 bg-accent/10 text-foreground'
                            : status === 'current'
                            ? 'border-accent bg-surface-elevated glow-accent text-accent'
                            : 'border-border bg-background/50 text-muted opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2
                            className={`h-4 w-4 ${
                              status === 'completed'
                                ? 'text-accent'
                                : status === 'current'
                                ? 'text-accent animate-pulse'
                                : 'text-muted'
                            }`}
                          />
                          <span className="font-bold text-xs">{step.title}</span>
                        </div>
                        <p className="text-[11px] text-muted">{step.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Items & Total */}
              <div className="rounded-2xl border border-border/80 bg-background/80 p-5 space-y-3 text-xs">
                <span className="font-bold text-foreground block">محتويات الأوردر:</span>
                {foundOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-muted">
                    <div>
                      <strong className="text-foreground">{item.product_title}</strong>
                      <span className="mr-2 rounded bg-accent/20 text-accent px-2 py-0.5 text-[10px] font-bold">
                        مقاس {item.size}
                      </span>
                    </div>
                    <span className="font-mono">{item.unit_price} ج.م</span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-border/60 pt-3 text-sm font-black text-foreground">
                  <span>المبلغ المطلوب عند الاستلام (شامل الشحن):</span>
                  <span className="text-accent text-base">{formatPrice(foundOrder.total_amount)} ج.م</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs text-muted">
                  <ShieldCheck className="h-4 w-4 text-accent" />
                  <span>تذكير: من حقك قياس الكوتشي قبل دفع الحساب للمندوب.</span>
                </div>

                <a
                  href={`https://wa.me/201000000000?text=مرحباً،%20عندي%20استفسار%20عن%20أوردر%20رقم%20${foundOrder.order_number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-success px-5 py-2.5 text-xs font-black text-white hover:bg-success/90 transition-all shadow-md"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>تواصل مع مسؤول الشحن عبر واتساب</span>
                </a>
              </div>

            </div>
          ) : (
            /* Not Found Box */
            <div className="rounded-3xl border border-border bg-surface p-8 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10 text-danger border border-danger/20">
                <AlertCircle className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-black text-foreground">
                لم نتمكن من العثور على أوردر بهذا الرقم!
              </h3>
              <p className="text-xs text-muted max-w-sm mx-auto">
                يرجى التأكد من كتابة رقم الهاتف المستخدم أثناء الطلب بشكل صحيح، أو تواصل معنا لمساعدتك فوراً.
              </p>
              <div className="pt-2">
                <a
                  href="https://wa.me/201000000000?text=مرحباً،%20كنت%20عاوز%20أتتبع%20أوردر%20ومش%20ظاهر%20معايا"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-xs font-black text-background hover:bg-accent-hover transition-all"
                >
                  <Phone className="h-4 w-4" />
                  <span>مساعدة فريق خدمة العملاء على واتساب</span>
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer Navigation */}
      <div className="border-t border-border pt-6 flex justify-between items-center text-xs">
        <Link href="/" className="text-accent font-bold hover:underline">
          ← العودة لتسوق الكوتشيات
        </Link>
        <Link href="/shipping" className="text-muted hover:text-foreground">
          سياسة الشحن والمعاينة →
        </Link>
      </div>

    </div>
  );
}
