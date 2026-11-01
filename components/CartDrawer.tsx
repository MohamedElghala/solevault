'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Printer,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/utils';
import { createSupabaseOrder } from '@/lib/supabase';
import { PixelEvents } from '@/lib/pixels';
import { ShippingLabelModal } from './ShippingLabelModal';
import { Order } from '@/types';

const EGYPT_GOVERNORATES = [
  'القاهرة',
  'الجيزة',
  'الإسكندرية',
  'القليوبية',
  'الشرقية',
  'الدقهلية (المنصورة)',
  'الغربية (طنطا)',
  'المنوفية',
  'البحيرة',
  'دمياط',
  'كفر الشيخ',
  'بورسعيد',
  'الإسماعيلية',
  'السويس',
  'الفيوم',
  'بني سويف',
  'المنيا',
  'أسيوط',
  'سوهاج',
  'قنا',
  'الأقصر',
  'أسوان',
  'مطروح والساحل',
  'البحر الأحمر (الغردقة)',
];

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    totalCount,
    subtotal,
    clearCart,
  } = useCart();

  // Drawer View State: 'cart' | 'checkout' | 'success'
  const [view, setView] = useState<'cart' | 'checkout' | 'success'>('cart');

  // Upsells State
  const [includeSocks, setIncludeSocks] = useState(false);
  const [includeCleaner, setIncludeCleaner] = useState(false);

  // Fast Checkout Form Fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [governorate, setGovernorate] = useState('القاهرة');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'InstaPay' | 'PayMob'>('COD');
  const [notes, setNotes] = useState('');

  // UI States
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [showShippingLabel, setShowShippingLabel] = useState(false);

  // Price Calculations
  const shippingFee = governorate === 'القاهرة' || governorate === 'الجيزة' ? 45 : 60;
  const upsellSocksPrice = includeSocks ? 99 : 0;
  const upsellCleanerPrice = includeCleaner ? 120 : 0;
  const finalSubtotal = subtotal + upsellSocksPrice + upsellCleanerPrice;
  const grandTotal = finalSubtotal + (items.length > 0 ? shippingFee : 0);

  const whatsappSupportNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '201000000000';

  if (!isOpen) return null;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!customerName.trim()) {
      setFormError('يرجى إدخال اسمك ثلاثياً لإصدار بوليصة الشحن');
      return;
    }

    if (!customerPhone.trim() || !customerPhone.match(/^01[0125][0-9]{8}$/)) {
      setFormError('يرجى إدخال رقم هاتف محمول مصري صحيح (11 رقم)');
      return;
    }

    if (!address.trim()) {
      setFormError('يرجى كتابة العنوان بالتفصيل (اسم الشارع ورقم العمارة والشقة)');
      return;
    }

    setIsSubmitting(true);
    PixelEvents.initiateCheckout(grandTotal, totalCount);

    const orderNumber = `SV-${Date.now().toString().slice(-6)}`;

    // Build order items representation
    const orderItems = items.map((it) => ({
      product_title: it.product.title,
      size: it.size,
      color: 'Original',
      unit_price: it.price,
      unit_cost: 950,
      quantity: it.quantity,
      total_price: it.price * it.quantity,
    }));

    if (includeSocks) {
      orderItems.push({
        product_title: '3 أزواج شرابات رياضية قطنية',
        size: 'One Size',
        color: 'White/Black',
        unit_price: 99,
        unit_cost: 35,
        quantity: 1,
        total_price: 99,
      });
    }

    if (includeCleaner) {
      orderItems.push({
        product_title: 'عبوة فوم تنظيف وحماية مع فرشة',
        size: '150ml',
        color: 'Clear',
        unit_price: 120,
        unit_cost: 45,
        quantity: 1,
        total_price: 120,
      });
    }

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      order_number: orderNumber,
      customer_name: customerName,
      customer_phone: customerPhone,
      governorate,
      city,
      delivery_address: address,
      payment_method: paymentMethod,
      payment_status: paymentMethod === 'COD' ? 'pending' : 'paid',
      order_status: 'pending',
      subtotal: finalSubtotal,
      shipping_fee: shippingFee,
      total_amount: grandTotal,
      total_supplier_cost: orderItems.reduce((acc, it) => acc + it.unit_cost * it.quantity, 0),
      shipping_cost_actual: 45,
      net_profit: grandTotal - orderItems.reduce((acc, it) => acc + it.unit_cost * it.quantity, 0) - 45,
      shipping_carrier: 'Bosta',
      tracking_number: `BST-${Date.now().toString().slice(-7)}`,
      customer_notes: notes || undefined,
      created_at: new Date().toISOString(),
      items: orderItems.map((it, idx) => ({
        id: `item-${idx}`,
        order_id: `ord-${Date.now()}`,
        ...it,
      })),
    };

    // Save order to isolated Supabase table
    try {
      await createSupabaseOrder({
        order_number: newOrder.order_number,
        customer_name: newOrder.customer_name,
        customer_phone: newOrder.customer_phone,
        governorate: newOrder.governorate,
        city: newOrder.city,
        delivery_address: newOrder.delivery_address,
        payment_method: newOrder.payment_method,
        subtotal: newOrder.subtotal,
        shipping_fee: newOrder.shipping_fee,
        total_amount: newOrder.total_amount,
        total_supplier_cost: newOrder.total_supplier_cost,
        shipping_cost_actual: newOrder.shipping_cost_actual,
        customer_notes: newOrder.customer_notes,
        items: newOrder.items || [],
      });
    } catch (err) {
      console.warn('[Cart Checkout] Supabase async sync notice:', err);
    }

    PixelEvents.purchase({
      orderNumber: newOrder.order_number,
      value: newOrder.total_amount,
      productTitle: items.map((i) => i.product.title).join(', '),
      numItems: totalCount,
    });

    setCompletedOrder(newOrder);
    clearCart();
    setIsSubmitting(false);
    setView('success');
  };

  // Generate WhatsApp Message text for current completed order
  const getWhatsAppOrderUrl = () => {
    if (!completedOrder) return '#';

    const itemsSummary = completedOrder.items
      ?.map(
        (it) =>
          `• ${it.product_title} (${it.size !== 'One Size' ? `مقاس ${it.size}` : it.size}) × ${it.quantity} = ${formatPrice(it.total_price)} ج.م`
      )
      .join('\n');

    const message = `*طلب شراء جديد من متجر SOLEVAULT 👟*
---------------------------------------
*رقم الأوردر:* ${completedOrder.order_number}
*اسم العميل:* ${completedOrder.customer_name}
*رقم الموبايل:* ${completedOrder.customer_phone}
*المحافظة:* ${completedOrder.governorate} - ${completedOrder.city}
*العنوان:* ${completedOrder.delivery_address}
---------------------------------------
*المنتجات المطلوبة:*
${itemsSummary}
---------------------------------------
*مصاريف الشحن:* ${completedOrder.shipping_fee} ج.م
*الإجمالي المطلوب تحصيله:* ${formatPrice(completedOrder.total_amount)} ج.م
*طريقة الدفع:* ${completedOrder.payment_method === 'COD' ? 'الدفع عند الاستلام (COD)' : 'تحويل عبر InstaPay'}
*ملاحظة:* العميل له حق المعاينة والقياس قبل دفع الحساب.
---------------------------------------`;

    return `https://wa.me/${whatsappSupportNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <>
      {/* Waybill / Shipping Label Modal */}
      {showShippingLabel && completedOrder && (
        <ShippingLabelModal
          order={completedOrder}
          onClose={() => setShowShippingLabel(false)}
        />
      )}

      {/* Slide-out Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Drawer Panel (RTL: Slide in from Left) */}
      <aside
        className="fixed top-0 bottom-0 left-0 z-50 flex w-full max-w-md flex-col border-r border-border bg-surface shadow-2xl transition-transform duration-300 ease-out"
        dir="rtl"
      >
        {/* DRAWER HEADER */}
        <div className="flex items-center justify-between border-b border-border/80 px-6 py-5 bg-background/50 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-background font-black shadow-md">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-foreground">
                سلة المشتريات{' '}
                {totalCount > 0 && (
                  <span className="text-xs text-accent font-bold">({totalCount} كوتشي)</span>
                )}
              </h3>
              <p className="text-[11px] text-muted">ضمان معاينة وقياس قبل الدفع</p>
            </div>
          </div>

          <button
            onClick={closeCart}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface-elevated text-muted hover:border-accent hover:text-accent transition-colors"
            aria-label="إغلاق السلة"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* FREE SHIPPING & TRIAL PROGRESS BADGE */}
        <div className="border-b border-border/60 bg-accent/10 px-6 py-2.5 text-xs font-bold text-accent flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Truck className="h-4 w-4 shrink-0" />
            <span>شحن سريع لجميع محافظات مصر (2 - 4 أيام)</span>
          </div>
          <span className="text-[10px] bg-accent text-background font-black px-2 py-0.5 rounded-full">
            معاينة مجانية
          </span>
        </div>

        {/* DRAWER BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {view === 'success' && completedOrder ? (
            /* 1. ORDER CONFIRMATION VIEW */
            <div className="space-y-6 text-center py-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success text-white shadow-xl">
                <CheckCircle2 className="h-9 w-9" />
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-black uppercase tracking-widest text-accent">
                  تم تأكيد الطلب بنجاح
                </span>
                <h4 className="text-2xl font-black text-foreground">
                  أهلاً بك في عائلة SOLEVAULT! 🎉
                </h4>
                <p className="text-xs text-muted">
                  رقم طلبك الرسمي:{' '}
                  <strong className="text-accent font-mono text-sm">
                    {completedOrder.order_number}
                  </strong>
                </p>
              </div>

              {/* Order Info Card */}
              <div className="rounded-2xl border border-border bg-background p-4 text-xs text-right space-y-2">
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted">العميل المستلم:</span>
                  <span className="font-bold text-foreground">{completedOrder.customer_name}</span>
                </div>
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted">المحافظة والعنوان:</span>
                  <span className="font-bold text-foreground">
                    {completedOrder.governorate} - {completedOrder.city}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted">طريقة الدفع:</span>
                  <span className="font-bold text-accent">
                    {completedOrder.payment_method === 'COD' ? '💵 دفع عند الاستلام' : '⚡ InstaPay'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black pt-1">
                  <span>المبلغ المطلوب عند الاستلام:</span>
                  <span className="text-accent">{formatPrice(completedOrder.total_amount)} ج.م</span>
                </div>
              </div>

              {/* ACTION 1: SEND DETAILS TO WHATSAPP IMMEDIATELY */}
              <a
                href={getWhatsAppOrderUrl()}
                data-testid="whatsapp-confirm-button"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-success py-4 text-sm font-black text-white hover:bg-success/90 transition-all shadow-xl hover:scale-[1.02] active:scale-98"
              >
                <Phone className="h-4 w-4" />
                <span>إرسال تفاصيل الأوردر لواتساب الإدارة فوراً 📱</span>
              </a>

              {/* ACTION 2: VIEW / PRINT AIR WAYBILL (AWB) */}
              <button
                type="button"
                data-testid="print-awb-button"
                onClick={() => setShowShippingLabel(true)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-accent bg-accent/10 py-3.5 text-xs font-black text-accent hover:bg-accent hover:text-background transition-all shadow-md"
              >
                <Printer className="h-4 w-4" />
                <span>عرض وطباعة بوليصة الشحن (AWB) 📄</span>
              </button>

              <div className="flex items-center justify-center gap-4 text-xs pt-2">
                <Link
                  href="/track"
                  onClick={closeCart}
                  className="text-muted hover:text-accent font-semibold underline underline-offset-4"
                >
                  تتبع حالة الشحنة ↗
                </Link>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => {
                    setView('cart');
                    closeCart();
                  }}
                  className="text-muted hover:text-accent font-semibold"
                >
                  متابعة التسوق
                </button>
              </div>
            </div>
          ) : view === 'checkout' ? (
            /* 2. FAST CHECKOUT INSIDE DRAWER */
            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/80 pb-3">
                <h4 className="text-sm font-black text-foreground flex items-center gap-1.5">
                  <Truck className="h-4 w-4 text-accent" />
                  <span>بيانات الشحن والاستلام</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setView('cart')}
                  className="text-xs text-accent font-bold hover:underline"
                >
                  العودة للأصناف ←
                </button>
              </div>

              {formError && (
                <div className="rounded-xl border border-danger/60 bg-danger/10 p-3 text-xs text-danger font-bold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Customer Name */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  الاسم ثلاثي <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: أحمد محمود الرفاعي"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted focus:border-accent focus:outline-none transition-colors"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  رقم الموبايل (واتساب متاح عليه) <span className="text-danger">*</span>
                </label>
                <input
                  type="tel"
                  required
                  dir="ltr"
                  placeholder="01012345678"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-right text-foreground placeholder:text-muted focus:border-accent focus:outline-none transition-colors font-mono"
                />
              </div>

              {/* Governorate and City */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    المحافظة <span className="text-danger">*</span>
                  </label>
                  <select
                    value={governorate}
                    onChange={(e) => setGovernorate(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-2.5 py-2.5 text-xs text-foreground focus:border-accent focus:outline-none transition-colors"
                  >
                    {EGYPT_GOVERNORATES.map((gov) => (
                      <option key={gov} value={gov} className="bg-surface text-foreground">
                        {gov}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    المنطقة / الحي <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: الدقي / سموحة"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs text-foreground placeholder:text-muted focus:border-accent focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  العنوان بالتفصيل (الشارع ورقم العمارة) <span className="text-danger">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="شارع ... عمارة ... الدور ... شقة ..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted focus:border-accent focus:outline-none transition-colors"
                />
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  طريقة الدفع:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`rounded-xl border p-2.5 text-center text-xs font-bold transition-all ${
                      paymentMethod === 'COD'
                        ? 'border-accent bg-accent/20 text-accent font-black shadow-sm'
                        : 'border-border bg-background text-muted'
                    }`}
                  >
                    💵 عند الاستلام (COD)
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('InstaPay')}
                    className={`rounded-xl border p-2.5 text-center text-xs font-bold transition-all ${
                      paymentMethod === 'InstaPay'
                        ? 'border-accent bg-accent/20 text-accent font-black shadow-sm'
                        : 'border-border bg-background text-muted'
                    }`}
                  >
                    ⚡ InstaPay
                  </button>
                </div>
              </div>

              {/* Mini Price Recalculation Box */}
              <div className="rounded-xl border border-border bg-background p-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-muted">
                  <span>إجمالي المنتجات ({totalCount} كوتشي):</span>
                  <span>{formatPrice(finalSubtotal)} ج.م</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>مصاريف الشحن لـ {governorate}:</span>
                  <span>{shippingFee} ج.م</span>
                </div>
                <div className="flex justify-between border-t border-border/60 pt-1.5 text-sm font-black text-foreground">
                  <span>المبلغ المطلوب عند الاستلام:</span>
                  <span className="text-accent">{formatPrice(grandTotal)} ج.م</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                data-testid="submit-order-button"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-accent py-3.5 text-sm font-black text-background transition-all hover:bg-accent-hover hover:scale-[1.02] active:scale-98 glow-accent disabled:opacity-50 shadow-xl"
              >
                {isSubmitting ? 'جاري تأكيد الطلب...' : 'تأكيد وشحن الكوتشي فوراً (معاينة قبل الدفع) ←'}
              </button>

              <p className="text-[10px] text-center text-muted">
                🔒 معاينة العلبة وقياس الكوتشي مع المندوب حقك 100% قبل دفع أي جنيه.
              </p>
            </form>
          ) : items.length === 0 ? (
            /* 3. EMPTY CART STATE */
            <div className="py-16 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-elevated text-muted">
                <ShoppingBag className="h-8 w-8 stroke-1" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-foreground">سلتك فارغة حالياً</h4>
                <p className="text-xs text-muted">
                  استكشف أحدث تشكيلة كوتشيات ستريتوير حصرية واختر مقاسك الآن.
                </p>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-xs font-black text-background hover:bg-accent-hover transition-all"
              >
                <span>تصفح الكوتشيات</span>
                <ArrowLeft className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            /* 4. CART ITEMS LIST */
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3.5 rounded-2xl border border-border bg-background p-3.5 shadow-sm"
                >
                  {/* Thumbnail */}
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-surface-elevated">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-foreground line-clamp-1">
                          {item.product.title}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-muted hover:text-danger transition-colors"
                          title="حذف من السلة"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="mt-1 flex items-center gap-2 text-[11px] text-muted">
                        <span className="rounded bg-surface-elevated px-2 py-0.5 font-bold text-accent border border-border">
                          مقاس {item.size}
                        </span>
                        <span>•</span>
                        <span>خامات ماستر كواليتي</span>
                      </div>
                    </div>

                    {/* Quantity controls & Price */}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center rounded-lg border border-border bg-surface">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="flex h-7 w-7 items-center justify-center text-muted hover:text-foreground"
                          aria-label="تقليل"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-7 text-center font-mono text-xs font-bold text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="flex h-7 w-7 items-center justify-center text-muted hover:text-foreground"
                          aria-label="زيادة"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <span className="font-mono text-sm font-black text-accent">
                        {formatPrice(item.price * item.quantity)} ج.م
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* UPSELL CROSS-SELL BOOSTER */}
              <div className="rounded-2xl border border-dashed border-accent/40 bg-accent/5 p-3.5 space-y-2.5">
                <span className="text-[11px] font-black uppercase text-accent flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>عروض التوفير الذكية (مع الكوتشي فقط):</span>
                </span>

                {/* Socks Upsell */}
                <label className="flex items-center justify-between gap-2 text-xs cursor-pointer p-2 rounded-xl bg-surface/60 hover:bg-surface border border-border/60 transition-colors">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={includeSocks}
                      onChange={(e) => setIncludeSocks(e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-border text-accent focus:ring-accent"
                    />
                    <span className="font-bold text-foreground text-[11px]">
                      3 أزواج شرابات قطنية قصيرة
                    </span>
                  </div>
                  <span className="font-bold text-accent text-xs">+99 ج.م</span>
                </label>

                {/* Foam Cleaner Upsell */}
                <label className="flex items-center justify-between gap-2 text-xs cursor-pointer p-2 rounded-xl bg-surface/60 hover:bg-surface border border-border/60 transition-colors">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={includeCleaner}
                      onChange={(e) => setIncludeCleaner(e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-border text-accent focus:ring-accent"
                    />
                    <span className="font-bold text-foreground text-[11px]">
                      عبوة فوم تنظيف وحماية مع فرشة
                    </span>
                  </div>
                  <span className="font-bold text-accent text-xs">+120 ج.م</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* DRAWER FOOTER (When in 'cart' view and items > 0) */}
        {view === 'cart' && items.length > 0 && (
          <div className="border-t border-border/80 bg-background/80 p-5 backdrop-blur-md space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-muted">
                <span>مجموع الكوتشيات:</span>
                <span>{formatPrice(finalSubtotal)} ج.م</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>مصاريف الشحن التقديرية:</span>
                <span>{shippingFee} ج.م</span>
              </div>
              <div className="flex justify-between border-t border-border/60 pt-2 text-sm font-black text-foreground">
                <span>الإجمالي التقريبي:</span>
                <span className="text-base text-accent">{formatPrice(grandTotal)} ج.م</span>
              </div>
            </div>

            <button
              type="button"
              data-testid="proceed-checkout-button"
              onClick={() => setView('checkout')}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-accent py-4 text-sm font-black text-background transition-all hover:bg-accent-hover hover:scale-[1.02] active:scale-98 glow-accent shadow-xl"
            >
              <span>إتمام الطلب السريع ←</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-muted">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" />
              <span>معاينة وقياس قبل الدفع • استبدال مقاس فوري خلال 14 يوم</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
