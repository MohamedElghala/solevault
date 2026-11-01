'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Flame,
  Star,
  Clock,
  ArrowRight,
  Phone,
  Sparkles,
  Zap,
  Ruler,
  PlusCircle,
  ShoppingBag,
} from 'lucide-react';
import { INITIAL_PRODUCTS, INITIAL_INVENTORY } from '@/lib/mock-data';
import { SizeGuideModal } from '@/components/SizeGuideModal';
import { PixelEvents } from '@/lib/pixels';
import { createSupabaseOrder } from '@/lib/supabase';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/lib/cart-context';

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

export default function ProductLandingPage({
  params,
}: {
  params: { slug: string };
}) {
  const { addItem } = useCart();
  const product = INITIAL_PRODUCTS.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  // Pixel ViewContent event
  useEffect(() => {
    PixelEvents.viewContent({
      id: product.id,
      title: product.title,
      price: product.sale_price,
      brand: product.brand,
    });
  }, [product]);

  // Gallery State
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Sizing Modal State
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Selection States
  const [selectedSize, setSelectedSize] = useState('42');
  const [quantity, setQuantity] = useState(1);

  // Upsells / Cross-sell Options
  const [includeSocks, setIncludeSocks] = useState(false);
  const [includeCleaner, setIncludeCleaner] = useState(false);

  // Fast Checkout Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [governorate, setGovernorate] = useState('القاهرة');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'InstaPay' | 'PayMob'>('COD');
  
  // Validation & UI States
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<any>(null);

  // Inventory logic for selected size
  const inventoryItem = INITIAL_INVENTORY.find(
    (inv) => inv.product_id === product.id && inv.size === selectedSize
  );
  const stockAvailable = inventoryItem ? inventoryItem.stock_quantity : 5;

  const shippingFee = governorate === 'القاهرة' || governorate === 'الجيزة' ? 45 : 60;
  const upsellSocksPrice = includeSocks ? 99 : 0;
  const upsellCleanerPrice = includeCleaner ? 120 : 0;
  const subtotal = product.sale_price * quantity + upsellSocksPrice + upsellCleanerPrice;
  const totalAmount = subtotal + shippingFee;

  const handleSelectSize = (size: string) => {
    setSelectedSize(size);
    PixelEvents.addToCart({
      id: product.id,
      title: product.title,
      price: product.sale_price,
      size,
    });
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!customerName.trim()) {
      setFormError('يرجى كتابة اسمك ثلاثياً لإتمام بوليصة الشحن');
      return;
    }

    if (!customerPhone.trim() || !customerPhone.match(/^01[0125][0-9]{8}$/)) {
      setFormError('يرجى إدخال رقم هاتف محمول مصري صحيح (11 رقم يبدأ بـ 010 أو 011 أو 012 أو 015)');
      return;
    }

    if (!address.trim()) {
      setFormError('يرجى كتابة العنوان بالتفصيل (اسم الشارع، رقم العمارة، رقم الشقة)');
      return;
    }

    setIsSubmitting(true);
    PixelEvents.initiateCheckout(totalAmount);

    const orderNumber = `SV-${Date.now().toString().slice(-6)}`;
    const orderData = {
      orderNumber,
      productTitle: product.title,
      size: selectedSize,
      quantity,
      totalAmount,
      customerName,
      customerPhone,
      governorate,
      city,
      address,
      paymentMethod,
      date: new Date().toLocaleDateString('ar-EG'),
    };

    // Save to isolated Supabase orders table (solevault_orders)
    createSupabaseOrder({
      order_number: orderNumber,
      customer_name: customerName,
      customer_phone: customerPhone,
      governorate,
      city,
      delivery_address: address,
      payment_method: paymentMethod as any,
      subtotal,
      shipping_fee: shippingFee,
      total_amount: totalAmount,
      total_supplier_cost: (inventoryItem?.supplier_cost || 950) * quantity,
      shipping_cost_actual: 45,
      items: [{
        product_title: product.title,
        size: selectedSize,
        color: 'Original',
        unit_price: product.sale_price,
        unit_cost: inventoryItem?.supplier_cost || 950,
        quantity,
        total_price: product.sale_price * quantity,
      }]
    }).catch(err => console.warn('Supabase background sync notice:', err));

    setTimeout(() => {
      setSubmittedOrder(orderData);
      setIsSubmitting(false);

      // Dispatch Pixel Purchase event
      PixelEvents.purchase({
        orderNumber,
        value: totalAmount,
        productTitle: product.title,
      });
    }, 700);
  };

  return (
    <div className="pb-24 overflow-hidden">
      
      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        onSelectSize={handleSelectSize}
      />

      {/* 1. TOP URGENCY NOTIFICATION BAR */}
      <div className="sticky top-20 z-40 bg-accent text-background px-4 py-2.5 text-center text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-lg backdrop-blur-md">
        <Flame className="h-4 w-4 shrink-0 animate-bounce" />
        <span>عرض خاص لفترة محدودة: وفر 700 جنيه + معاينة العلبة وقياس الكوتشي قبل الدفع!</span>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-semibold text-muted mb-6">
          <Link href="/" className="hover:text-accent transition-colors">الرئيسية</Link>
          <span>/</span>
          <Link href="/#products" className="hover:text-accent transition-colors">الكوتشيات</Link>
          <span>/</span>
          <span className="text-foreground">{product.title}</span>
        </div>

        {/* MAIN PRODUCT HERO SECTION */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
          
          {/* LEFT: IMAGE GALLERY (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Main Image */}
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-surface-elevated to-surface shadow-2xl group">
              <Image
                src={product.images[activeImageIndex]}
                alt={product.title}
                fill
                priority
                className="object-cover object-center transition-all duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 600px"
              />
              <div className="absolute top-4 right-4 rounded-full bg-danger px-3.5 py-1 text-xs font-black text-white shadow-lg">
                وفر {product.base_price - product.sale_price} جنيه اليوم
              </div>
              <div className="absolute top-4 left-4 rounded-full bg-background/80 backdrop-blur-md border border-white/10 px-3 py-1 text-[11px] font-bold text-accent">
                ✨ خامات ماستر كواليتي
              </div>
            </div>

            {/* Interactive Thumbnails */}
            <div className="grid grid-cols-3 gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative aspect-square overflow-hidden rounded-2xl border transition-all duration-300 ${
                    activeImageIndex === idx
                      ? 'border-accent ring-2 ring-accent scale-[1.03] shadow-lg'
                      : 'border-border opacity-70 hover:opacity-100 hover:border-white/40'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Quick Guarantees Box */}
            <div className="rounded-3xl border border-border bg-surface p-6 space-y-3.5 text-xs text-muted shadow-lg">
              <div className="flex items-center gap-3 text-foreground font-bold">
                <ShieldCheck className="h-5 w-5 text-accent shrink-0" />
                <span>حق المعاينة: افتح الكرتونة وقيس واتأكد من جودة الكوتشي قبل الدفع.</span>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-accent shrink-0" />
                <span>شحن وتوصيل سريع لباب بيتك (من 2 إلى 4 أيام لكافة المحافظات).</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-accent shrink-0" />
                <span>استبدال مجاني للمقاس لو طلع مش مظبوط في خلال 14 يوم.</span>
              </div>
            </div>
          </div>

          {/* RIGHT: DETAILS & FAST ORDER FORM (6 Cols) */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* Title & Price Header */}
            <div className="border-b border-border pb-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-accent flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" /> {product.brand}
                </span>
                <div className="flex items-center gap-1 text-accent text-xs font-bold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-accent" />
                  ))}
                  <span className="text-muted mr-1.5">(4.9/5 بناءً على 128 تقييم)</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-foreground">
                {product.title}
              </h1>

              {/* Price Banner */}
              <div className="flex items-baseline gap-4 pt-2">
                <span className="text-3xl sm:text-4xl font-black text-accent">
                  {formatPrice(product.sale_price)} ج.م
                </span>
                <span className="text-lg line-through text-muted font-bold">
                  {formatPrice(product.base_price)} ج.م
                </span>
                <span className="rounded-full bg-accent/10 border border-accent/30 px-3 py-1 text-xs font-bold text-accent">
                  خصم 22% لفترة محدودة
                </span>
              </div>

              {/* Dynamic Stock Scarcity Trigger */}
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-surface-elevated border border-border p-3 text-xs font-bold">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-danger"></span>
                </span>
                <span className="text-danger">
                  تنبيه: متبقي فقط {stockAvailable > 0 ? stockAvailable : 2} قطع في المخزن من مقاس {selectedSize}!
                </span>
              </div>
            </div>

            {/* SIZE SELECTOR WITH LIVE INTERACTION + SIZE GUIDE BUTTON */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-foreground">
                  اختر المقاس المناسب:
                </label>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="flex items-center gap-1 text-xs font-bold text-accent hover:underline"
                >
                  <Ruler className="h-3.5 w-3.5" />
                  <span>جدول المقاسات بالسنتيمتر 📏</span>
                </button>
              </div>

              <div className="grid grid-cols-6 gap-2 sm:gap-3">
                {['40', '41', '42', '43', '44', '45'].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSelectSize(size)}
                    className={`h-12 rounded-2xl text-sm font-black transition-all duration-200 ${
                      selectedSize === size
                        ? 'bg-accent text-background shadow-lg scale-105 border-2 border-accent glow-accent'
                        : 'border border-border bg-surface text-foreground hover:border-accent/60'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {/* Add To Cart Drawer CTA */}
              <button
                type="button"
                onClick={() => addItem(product, selectedSize, quantity)}
                className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-accent bg-accent/10 py-3 text-sm font-black text-accent hover:bg-accent hover:text-background transition-all shadow-md active:scale-98"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>إضافة مقاس {selectedSize} للسلة وتصفح المزيد 🛒</span>
              </button>
            </div>

            {/* UPSELL CROSS-SELL ADD-ONS */}
            <div className="rounded-2xl border border-border bg-surface-elevated/80 p-4 space-y-3">
              <span className="text-xs font-bold text-accent flex items-center gap-1.5">
                <PlusCircle className="h-4 w-4" />
                <span>إضافات مميزة ومفيدة مع الكوتشي (عرض خاص):</span>
              </span>

              <div className="space-y-2">
                {/* Upsell 1 */}
                <label className="flex items-center justify-between rounded-xl border border-border/80 bg-background/80 p-3 text-xs cursor-pointer hover:border-accent transition-colors">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={includeSocks}
                      onChange={(e) => setIncludeSocks(e.target.checked)}
                      className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                    />
                    <div>
                      <span className="font-bold text-foreground block">3 أزواج شرابات قطنية قصيرة مضادة للتعرق</span>
                      <span className="text-[11px] text-muted">خامة قطن مصري 100% مريحة للقدم</span>
                    </div>
                  </div>
                  <span className="font-bold text-accent">+99 ج.م</span>
                </label>

                {/* Upsell 2 */}
                <label className="flex items-center justify-between rounded-xl border border-border/80 bg-background/80 p-3 text-xs cursor-pointer hover:border-accent transition-colors">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={includeCleaner}
                      onChange={(e) => setIncludeCleaner(e.target.checked)}
                      className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                    />
                    <div>
                      <span className="font-bold text-foreground block">عبوة فوم تنظيف وحماية للكوتشي مع فرشة</span>
                      <span className="text-[11px] text-muted">تحافظ على بياض ولمعان الكوتشي كالجديد</span>
                    </div>
                  </div>
                  <span className="font-bold text-accent">+120 ج.م</span>
                </label>
              </div>
            </div>

            {/* FAST CHECKOUT ORDER FORM */}
            <div className="rounded-3xl border-2 border-accent/60 bg-surface p-6 sm:p-8 space-y-6 shadow-2xl relative">
              <div className="border-b border-border/80 pb-4">
                <h3 className="text-xl font-black text-foreground flex items-center gap-2">
                  <span>طلب فوري — املأ بياناتك للشحن السريع</span>
                  <Truck className="h-5 w-5 text-accent" />
                </h3>
                <p className="text-xs text-muted mt-1">
                  مش هتدفع أي مليم غير لما تستلم وتفتح العلبة وتتأكد بنفسك.
                </p>
              </div>

              {/* Inline Form Error Notification */}
              {formError && (
                <div className="rounded-2xl border border-danger/60 bg-danger/10 p-3.5 text-xs text-danger font-bold flex items-center gap-2 animate-pulse">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {submittedOrder ? (
                /* SUCCESS STATE */
                <div className="rounded-3xl border border-success/40 bg-success/10 p-6 text-center space-y-4 shadow-xl">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success text-white shadow-lg">
                    <CheckCircle2 className="h-9 w-9" />
                  </div>
                  <h4 className="text-2xl font-black text-foreground">
                    تم تسجيل طلبك بنجاح! 🎉
                  </h4>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed">
                    رقم الأوردر: <strong className="text-accent font-mono text-base">{submittedOrder.orderNumber}</strong>
                    <br />
                    فريق المتابعة هيتواصل مع حضرتك هاتفياً أو عبر الواتساب على رقم{' '}
                    <strong className="text-foreground font-mono" dir="ltr">{submittedOrder.customerPhone}</strong> لتأكيد ميعاد التوصيل لـ {submittedOrder.governorate}.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-3">
                    <a
                      href={`https://wa.me/201000000000?text=مرحباً،%20أنا%20طلبت%20أوردر%20رقم%20${submittedOrder.orderNumber}%20لكوتشي%20${encodeURIComponent(product.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-success px-8 py-3.5 text-sm font-black text-white hover:bg-success/90 transition-all shadow-lg hover:scale-105 active:scale-95"
                    >
                      <Phone className="h-4 w-4" />
                      <span>تأكيد الشحن فوراً عبر الواتساب</span>
                    </a>

                    <Link
                      href={`/track`}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-surface-elevated px-6 py-3.5 text-xs font-bold text-foreground hover:border-accent hover:text-accent transition-all"
                    >
                      <span>تتبع خط سير الشحنة ↗</span>
                    </Link>
                  </div>
                </div>
              ) : (
                /* ORDER FORM */
                <form onSubmit={handleSubmitOrder} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1.5">
                      الاسم بالكامل <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="اكتب اسمك ثلاثي هنا"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1.5">
                      رقم الموبايل (واتساب متاح عليه) <span className="text-danger">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      dir="ltr"
                      placeholder="01012345678"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-sm text-right text-foreground placeholder:text-muted focus:border-accent focus:outline-none transition-colors font-mono"
                    />
                  </div>

                  {/* Governorate and City Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1.5">
                        المحافظة <span className="text-danger">*</span>
                      </label>
                      <select
                        value={governorate}
                        onChange={(e) => setGovernorate(e.target.value)}
                        className="w-full rounded-2xl border border-border bg-background px-3 py-3.5 text-sm text-foreground focus:border-accent focus:outline-none transition-colors"
                      >
                        {EGYPT_GOVERNORATES.map((gov) => (
                          <option key={gov} value={gov} className="bg-surface text-foreground">
                            {gov}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1.5">
                        المنطقة / الحي / المركز <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: مدينة نصر / سموحة"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1.5">
                      العنوان بالتفصيل (اسم الشارع ورقم العمارة) <span className="text-danger">*</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="شارع ... عمارة رقم ... الدور ... شقة رقم ..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Payment Method Selector */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-foreground mb-2">
                      اختر طريقة الدفع المناسبة لك:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('COD')}
                        className={`rounded-2xl border p-3 text-center text-xs font-bold transition-all ${
                          paymentMethod === 'COD'
                            ? 'border-accent bg-accent/15 text-accent font-black shadow-md'
                            : 'border-border bg-background text-muted hover:text-foreground'
                        }`}
                      >
                        💵 الدفع عند الاستلام
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('InstaPay')}
                        className={`rounded-2xl border p-3 text-center text-xs font-bold transition-all ${
                          paymentMethod === 'InstaPay'
                            ? 'border-accent bg-accent/15 text-accent font-black shadow-md'
                            : 'border-border bg-background text-muted hover:text-foreground'
                        }`}
                      >
                        ⚡ انستا باي (InstaPay)
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('PayMob')}
                        className={`rounded-2xl border p-3 text-center text-xs font-bold transition-all ${
                          paymentMethod === 'PayMob'
                            ? 'border-accent bg-accent/15 text-accent font-black shadow-md'
                            : 'border-border bg-background text-muted hover:text-foreground'
                        }`}
                      >
                        💳 فيزا / كارت بنكي
                      </button>
                    </div>

                    {paymentMethod === 'InstaPay' && (
                      <div className="mt-3 rounded-2xl border border-accent/40 bg-accent/10 p-3.5 text-xs text-foreground space-y-1">
                        <p className="font-bold text-accent">بيانات التحويل عبر InstaPay:</p>
                        <p>رقم الحساب / IPA: <strong className="text-foreground font-mono">solevault@instapay</strong></p>
                        <p className="text-[11px] text-muted">بعد إرسال الطلب هيتم تحويلك لرفع سكرين شوت التحويل وتأكيد الشحن فوراً.</p>
                      </div>
                    )}
                  </div>

                  {/* Order Summary Pricing Box */}
                  <div className="rounded-2xl border border-border/80 bg-background/80 p-4 space-y-2 text-xs">
                    <div className="flex justify-between text-muted">
                      <span>سعر الكوتشي (مقاس {selectedSize}):</span>
                      <span>{formatPrice(product.sale_price)} ج.م</span>
                    </div>

                    {includeSocks && (
                      <div className="flex justify-between text-muted">
                        <span>3 أزواج شرابات رياضية قطنية:</span>
                        <span>+99 ج.م</span>
                      </div>
                    )}

                    {includeCleaner && (
                      <div className="flex justify-between text-muted">
                        <span>عبوة فوم تنظيف الكوتشي:</span>
                        <span>+120 ج.م</span>
                      </div>
                    )}

                    <div className="flex justify-between text-muted">
                      <span>مصاريف الشحن لـ {governorate}:</span>
                      <span>{shippingFee} ج.م</span>
                    </div>

                    <div className="flex justify-between border-t border-border/60 pt-2 text-sm font-black text-foreground">
                      <span>الإجمالي المطلوب عند الاستلام:</span>
                      <span className="text-accent text-base">{formatPrice(totalAmount)} ج.م</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-2xl bg-accent py-4 text-base font-black text-background transition-all hover:bg-accent-hover hover:scale-[1.02] active:scale-98 glow-accent disabled:opacity-50 shadow-xl"
                  >
                    {isSubmitting ? 'جاري تسجيل طلبك...' : 'تأكيد طلب الكوتشي الآن (معاينة قبل الدفع) ←'}
                  </button>

                  <p className="text-[11px] text-center text-muted">
                    🔒 بياناتك مشفرة ومحمية 100%. لا نطلب أي بيانات بنكية سرية.
                  </p>
                </form>
              )}
            </div>

          </div>

        </div>

        {/* DETAILED DESCRIPTION & SPECS */}
        <div className="mt-20 border-t border-border pt-12 space-y-8">
          <div className="max-w-3xl space-y-4">
            <h2 className="text-2xl font-black text-foreground">
              مواصفات وتفاصيل كوتشي {product.title}
            </h2>
            <p className="text-sm leading-relaxed text-muted">
              {product.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-border bg-surface p-6 space-y-4 shadow-lg">
              <h3 className="text-base font-bold text-foreground">أبرز المميزات:</h3>
              <ul className="space-y-2.5 text-xs text-muted">
                {product.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-border bg-surface p-6 space-y-4 shadow-lg">
              <h3 className="text-base font-bold text-foreground">إرشادات اختيار المقاس:</h3>
              <p className="text-xs leading-relaxed text-muted">
                مقاسات هذا الموديل مطابقة للمقاسات الأوروبية القياسية (True to Size). ننصح باختيار نفس مقاس كوتشياتك الرياضية العادية. في حالة الشك بين مقاسين، اطلب المقاس الأكبر، ومعاك المندوب يعاين ويقيس قبل الدفع.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
