'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, DollarSign, Tag, TrendingUp } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';

interface QuickPriceModalProps {
  product: Product | null;
  onClose: () => void;
  onSavePrice: (productId: string, newSalePrice: number, newBasePrice: number) => void;
}

export function QuickPriceModal({ product, onClose, onSavePrice }: QuickPriceModalProps) {
  const [salePrice, setSalePrice] = useState<number>(0);
  const [basePrice, setBasePrice] = useState<number>(0);

  useEffect(() => {
    if (product) {
      setSalePrice(product.sale_price);
      setBasePrice(product.base_price);
    }
  }, [product]);

  if (!product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (salePrice <= 0) return;
    onSavePrice(product.id, salePrice, basePrice);
    onClose();
  };

  const discountAmount = Math.max(0, basePrice - salePrice);
  const discountPct = basePrice > 0 ? Math.round((discountAmount / basePrice) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0C0C12] p-6 text-foreground shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 border border-accent/40 text-accent font-black">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">تعديل سريع للأسعار</h3>
              <p className="text-xs text-white/50 truncate max-w-[200px]">{product.title}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-white/80">سعر البيع الحالي للعميل (ج.م):</label>
            <div className="relative">
              <input
                type="number"
                required
                min={100}
                value={salePrice}
                onChange={(e) => setSalePrice(Number(e.target.value))}
                className="w-full rounded-xl border border-accent/40 bg-accent/[0.05] px-4 py-3 text-lg font-black text-accent focus:border-accent focus:outline-none"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-accent">
                ج.م
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-white/80">السعر الأصلي قبل الخصم (ج.م):</label>
            <div className="relative">
              <input
                type="number"
                required
                min={100}
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white/70 focus:border-accent focus:outline-none"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-white/40">
                ج.م
              </span>
            </div>
          </div>

          {/* Live Discount Calculator */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs flex items-center justify-between">
            <span className="text-white/60">قيمة الخصم للعميل:</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">وفر {formatPrice(discountAmount)} ج.م</span>
              <span className="rounded-full bg-accent/20 text-accent font-bold px-2 py-0.5 text-[10px]">
                خصم {discountPct}%
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-white/70 hover:bg-white/5"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-accent px-5 py-2 text-xs font-black text-black hover:bg-accent/90 shadow-lg glow-accent"
            >
              <Check className="h-4 w-4" />
              <span>تحديث السعر فوراً</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
