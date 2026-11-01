'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Image as ImageIcon, Check, DollarSign, Package, Tag } from 'lucide-react';
import { Product } from '@/types';

interface AdminProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
  onSave: (product: Product, stockPerSize: Record<string, number>, supplierCost: number) => void;
}

// Preset luxury sneaker photography links for 1-click picking
const PRESET_IMAGES = [
  {
    name: 'Ghost Black',
    url: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=1200&q=90',
  },
  {
    name: 'Neon Pulse Red',
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'Retro Cream Classic',
    url: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'Stealth Shadow Dunk',
    url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=90',
  },
  {
    name: 'Cyberpunk Runner High',
    url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&q=90',
  },
];

export function AdminProductModal({
  isOpen,
  onClose,
  productToEdit,
  onSave,
}: AdminProductModalProps) {
  const isEditing = !!productToEdit;

  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('SOLEVAULT LAB');
  const [salePrice, setSalePrice] = useState(2499);
  const [basePrice, setBasePrice] = useState(3200);
  const [supplierCost, setSupplierCost] = useState(950);
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState('');
  const [isTrending, setIsTrending] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [stockPerSize, setStockPerSize] = useState<Record<string, number>>({
    '40': 6,
    '41': 8,
    '42': 10,
    '43': 7,
    '44': 5,
    '45': 3,
  });

  useEffect(() => {
    if (productToEdit) {
      setTitle(productToEdit.title);
      setBrand(productToEdit.brand || 'SOLEVAULT LAB');
      setSalePrice(productToEdit.sale_price);
      setBasePrice(productToEdit.base_price);
      setImageUrl(productToEdit.images[0] || PRESET_IMAGES[0].url);
      setDescription(productToEdit.description || '');
      setFeatures(productToEdit.features ? productToEdit.features.join('\n') : '');
      setIsTrending(!!productToEdit.is_trending);
      setIsFeatured(!!productToEdit.is_featured);
    } else {
      // Defaults for new product
      setTitle('');
      setBrand('SOLEVAULT LAB');
      setSalePrice(2499);
      setBasePrice(3200);
      setSupplierCost(950);
      setImageUrl(PRESET_IMAGES[0].url);
      setDescription('كوتشي ماستر كواليتي حصري بتصميم ستريتوير مريح وتبطين مزدوج ممتص للصدمات.');
      setFeatures('نعل ممتص للصدمات\nخامات جلدية فاخرة\nمعاينة وقياس قبل الدفع\nضمان استبدال فوري');
      setIsTrending(true);
      setIsFeatured(false);
      setStockPerSize({
        '40': 6,
        '41': 8,
        '42': 10,
        '43': 7,
        '44': 5,
        '45': 3,
      });
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') || `sneaker-${Date.now()}`;

    const updatedProduct: Product = {
      id: productToEdit ? productToEdit.id : `prod-${Date.now()}`,
      title: title.trim(),
      slug: productToEdit ? productToEdit.slug : slug,
      brand,
      description,
      base_price: Number(basePrice),
      sale_price: Number(salePrice),
      images: [imageUrl],
      features: features.split('\n').filter((f) => f.trim().length > 0),
      is_trending: isTrending,
      is_featured: isFeatured,
    };

    onSave(updatedProduct, stockPerSize, Number(supplierCost));
    onClose();
  };

  const calculatedProfit = salePrice - supplierCost;
  const marginPct = salePrice > 0 ? Math.round((calculatedProfit / salePrice) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-[2rem] border border-white/10 bg-[#0C0C12] p-6 sm:p-8 text-foreground shadow-2xl space-y-6 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 border border-accent/40 text-accent font-black">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">
                {isEditing ? 'تعديل بيانات الكوتشي والأسعار' : 'إضافة كوتشي جديد للخزنة'}
              </h3>
              <p className="text-xs text-white/50">
                {isEditing
                  ? 'قم بتحديث السعر أو المخزون أو المواصفات في ثوانٍ'
                  : 'أدخل تفاصيل الموديل والمقاسات وسعر البيع لتدشينه فوراً بالمتجر'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Row 1: Title & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-white/80">اسم الموديل (Sneaker Title):</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: Air Phantom Edge — Ghost Black"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-accent focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/80">خط الإنتاج (Brand):</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#161622] px-4 py-2.5 text-sm text-white focus:border-accent focus:outline-none"
              >
                <option value="SOLEVAULT LAB">SOLEVAULT LAB</option>
                <option value="SOLEVAULT ARCHIVE">SOLEVAULT ARCHIVE</option>
                <option value="SOLEVAULT RUNNER">SOLEVAULT RUNNER</option>
                <option value="COLLAB EDITION">COLLAB EDITION</option>
              </select>
            </div>
          </div>

          {/* Row 2: Pricing & Unit Economics Matrix */}
          <div className="rounded-2xl border border-accent/20 bg-accent/[0.03] p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-black text-accent">
              <DollarSign className="h-4 w-4" />
              <span>هندسة الأسعار والأرباح (Pricing & Unit Economics):</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/80">سعر البيع للعميل (ج.م):</label>
                <input
                  type="number"
                  required
                  min={100}
                  value={salePrice}
                  onChange={(e) => setSalePrice(Number(e.target.value))}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-accent focus:border-accent focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/80">السعر قبل الخصم (ج.م):</label>
                <input
                  type="number"
                  required
                  min={100}
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white/70 focus:border-accent focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/80">تكلفة شراء المورد (ج.م):</label>
                <input
                  type="number"
                  required
                  min={50}
                  value={supplierCost}
                  onChange={(e) => setSupplierCost(Number(e.target.value))}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-danger focus:border-danger focus:outline-none"
                />
              </div>
            </div>

            {/* Profit margin live feedback */}
            <div className="flex items-center justify-between border-t border-white/10 pt-2 text-xs">
              <span className="text-white/60">صافي الربح المتوقع للقطعة:</span>
              <span className="font-black text-accent">
                +{calculatedProfit.toLocaleString('en-US')} ج.م (هامش {marginPct}%)
              </span>
            </div>
          </div>

          {/* Row 3: Product Image (Pick preset or enter URL) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/80 flex items-center gap-1.5">
              <ImageIcon className="h-4 w-4 text-accent" />
              <span>صورة الكوتشي الرئيسية (اختر جاهز أو ضع رابط مباشر):</span>
            </label>

            <div className="flex flex-wrap gap-2 mb-2">
              {PRESET_IMAGES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImageUrl(preset.url)}
                  className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
                    imageUrl === preset.url
                      ? 'border-accent bg-accent/20 text-accent'
                      : 'border-white/10 bg-white/[0.03] text-white/60 hover:text-white'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>

            <input
              type="url"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-white/80 focus:border-accent focus:outline-none font-mono"
            />
          </div>

          {/* Row 4: Sizes & Stock Matrix */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/80 flex items-center gap-1.5">
              <Package className="h-4 w-4 text-accent" />
              <span>المخزون المتوفر لكل مقاس:</span>
            </label>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {['40', '41', '42', '43', '44', '45'].map((size) => (
                <div key={size} className="rounded-xl border border-white/10 bg-white/[0.02] p-2 text-center space-y-1">
                  <span className="text-[11px] font-bold text-white/60">مقاس {size}</span>
                  <input
                    type="number"
                    min={0}
                    value={stockPerSize[size] ?? 5}
                    onChange={(e) =>
                      setStockPerSize((prev) => ({ ...prev, [size]: Math.max(0, Number(e.target.value)) }))
                    }
                    className="w-full text-center rounded-lg border border-white/10 bg-black/40 py-1 text-sm font-mono font-bold text-white focus:border-accent focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Row 5: Description & Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/80">الوصف التسويقي:</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white placeholder:text-white/30 focus:border-accent focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/80">المميزات (ميزة في كل سطر):</label>
              <textarea
                rows={3}
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white placeholder:text-white/30 focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          {/* Row 6: Toggles */}
          <div className="flex flex-wrap items-center gap-6 border-t border-white/10 pt-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-white">
              <input
                type="checkbox"
                checked={isTrending}
                onChange={(e) => setIsTrending(e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-white/5 accent-[#E6FF00]"
              />
              <span>تثبيت شارة الأكثر مبيعاً (Trending 🔥)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-white">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-white/5 accent-[#E6FF00]"
              />
              <span>إبراز في الواجهة الرئيسية (Featured ⭐)</span>
            </label>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-5 py-2.5 text-xs font-bold text-white/70 hover:bg-white/5 hover:text-white transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-xs font-black text-black hover:bg-accent/90 transition-all shadow-lg glow-accent"
            >
              <Check className="h-4 w-4" />
              <span>{isEditing ? 'حفظ التعديلات' : 'إضافة الكوتشي للمتجر'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
