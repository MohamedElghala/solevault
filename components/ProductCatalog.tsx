'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, ShoppingBag, Sparkles, Check } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/lib/cart-context';

interface ProductCatalogProps {
  products: Product[];
}

export function ProductCatalog({ products }: ProductCatalogProps) {
  const { addItem } = useCart();
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({
    'prod-1': '42',
    'prod-2': '42',
    'prod-3': '42',
  });
  const [addedAnimation, setAddedAnimation] = useState<string | null>(null);

  const handleSelectSize = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleAddToCart = (product: Product) => {
    const size = selectedSizes[product.id] || '42';
    addItem(product, size, 1);
    setAddedAnimation(product.id);
    setTimeout(() => setAddedAnimation(null), 1500);
  };

  return (
    <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => {
        const discountPct = Math.round(
          ((product.base_price - product.sale_price) / product.base_price) * 100
        );
        const currentSize = selectedSizes[product.id] || '42';
        const isRecentlyAdded = addedAnimation === product.id;

        return (
          <article
            key={product.id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-surface transition-all duration-500 hover:border-accent/80 hover:shadow-2xl hover:-translate-y-1.5"
          >
            {/* Image */}
            <Link href={`/products/${product.slug}`} className="relative aspect-[4/3] w-full overflow-hidden bg-surface-elevated block">
              <Image
                src={product.images[0]}
                alt={product.title}
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-108"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              {/* Badges */}
              <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end z-10">
                {product.is_trending && (
                  <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-black text-background shadow-md">
                    🔥 الأكثر طلباً
                  </span>
                )}
                <span className="rounded-full bg-danger px-2.5 py-1 text-[11px] font-black text-white shadow-md">
                  خصم {discountPct}%
                </span>
              </div>
            </Link>

            {/* Details */}
            <div className="flex flex-col p-6 flex-grow justify-between space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
                  {product.brand}
                </span>
                <Link href={`/products/${product.slug}`}>
                  <h3 className="mt-1 text-lg font-bold text-foreground group-hover:text-accent transition-colors">
                    {product.title}
                  </h3>
                </Link>
                <p className="mt-2 text-xs leading-relaxed text-muted line-clamp-2">
                  {product.description}
                </p>

                {/* Features list */}
                <div className="mt-4 space-y-1.5 border-t border-border/60 pt-4">
                  {product.features.slice(0, 2).map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] text-muted">
                      <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                      <span className="truncate">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Quick Size Picker */}
                <div className="mt-4 border-t border-border/60 pt-3">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted font-bold">المقاس:</span>
                    <span className="text-accent font-black">مقاس {currentSize}</span>
                  </div>
                  <div className="grid grid-cols-6 gap-1.5">
                    {['40', '41', '42', '43', '44', '45'].map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => handleSelectSize(product.id, sz)}
                        className={`py-1 text-xs font-bold rounded-lg transition-all ${
                          currentSize === sz
                            ? 'bg-accent text-background font-black shadow-sm'
                            : 'border border-border bg-background text-muted hover:border-accent hover:text-foreground'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pricing and Actions */}
              <div className="mt-4 border-t border-border/80 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-black text-foreground">
                      {formatPrice(product.sale_price)} ج.م
                    </span>
                    <span className="block text-xs line-through text-muted">
                      {formatPrice(product.base_price)} ج.م
                    </span>
                  </div>

                  <Link
                    href={`/products/${product.slug}`}
                    className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
                  >
                    <span>صفحة الكوتشي</span>
                    <span>←</span>
                  </Link>
                </div>

                {/* Add to Slide-Out Cart Button */}
                <button
                  type="button"
                  data-testid="add-to-cart-button"
                  onClick={() => handleAddToCart(product)}
                  className={`w-full flex items-center justify-center gap-2 rounded-2xl py-3 text-xs font-black transition-all shadow-md active:scale-98 ${
                    isRecentlyAdded
                      ? 'bg-success text-white'
                      : 'bg-accent text-background hover:bg-accent-hover glow-accent'
                  }`}
                >
                  {isRecentlyAdded ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>تمت الإضافة للسلة!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4" />
                      <span>أضف مقاس {currentSize} لسلة الشراء 🛒</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
