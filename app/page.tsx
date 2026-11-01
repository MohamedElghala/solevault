import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Star, ShieldCheck, Zap, Flame, CheckCircle2, Sparkles, TrendingUp } from 'lucide-react';
import { INITIAL_PRODUCTS } from '@/lib/mock-data';
import { CinematicShoeViewer } from '@/components/CinematicShoeViewer';
import { ProductCatalog } from '@/components/ProductCatalog';
import { HomepageInteractiveSections } from '@/components/HomepageInteractiveSections';
import { formatPrice } from '@/lib/utils';

export default function HomePage() {
  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative overflow-hidden border-b border-white/5 bg-gradient-to-b from-[#0E0E14]/80 via-[#060608] to-[#060608] pt-12 pb-24 lg:pt-16 lg:pb-28">
        
        {/* Editorial Watermark Backdrop */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 select-none pointer-events-none text-[13vw] font-black uppercase tracking-[0.25em] text-white/[0.02] whitespace-nowrap z-0 font-mono">
          SOLEVAULT ARCHIVE
        </div>

        {/* Ambient Atmospheric Glows */}
        <div className="absolute -top-32 right-1/4 h-[500px] w-[500px] rounded-full bg-accent/10 blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 -left-32 h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-[140px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            
            {/* Left/Text Content */}
            <div className="lg:col-span-7 space-y-6 text-right">
              
              {/* Drop Release Badge */}
              <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-black text-white shadow-xl backdrop-blur-xl">
                <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
                <span className="tracking-wide">إصدارات شتاء 2026 الحصرية</span>
                <span className="text-white/30">•</span>
                <span className="text-accent font-mono">[ DROP 01 ]</span>
              </div>

              <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.12]">
                أندر الكوتشيات..{' '}
                <span className="text-accent inline-block relative">
                  بأعلى جودة
                  <span className="absolute bottom-1.5 inset-x-0 h-2 bg-accent/20 -z-10 rounded-full blur-xs" />
                </span>{' '}
                في مصر.
              </h1>

              <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-muted/90 font-medium">
                مش مجرد كوتشي، دي تفاصيل بتكمل هيبتك ومظهرك. راحة فندقية فائقة لقدميك طوال اليوم مع خامات مستوردة وضمان كامل لمعاينة العلبة وقياس المقاس بنفسك مع المندوب قبل دفع أي جنيه.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-3">
                <Link
                  href="#products"
                  className="flex items-center justify-center gap-3 rounded-2xl bg-accent px-8 py-4 text-sm font-black text-background transition-all hover:bg-accent-hover hover:scale-105 active:scale-95 glow-accent"
                >
                  <span>استكشف كوتشيات الخزنة</span>
                  <ArrowLeft className="h-4 w-4" />
                </Link>

                <Link
                  href={`/products/${INITIAL_PRODUCTS[0].slug}`}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl px-6 py-4 text-sm font-bold text-white transition-all hover:border-accent/40 hover:bg-white/[0.07]"
                >
                  <Zap className="h-4 w-4 text-accent" />
                  <span>الأكثر طلباً: Air Phantom</span>
                </Link>
              </div>

              {/* Mini Guarantees Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 text-xs font-bold text-muted/90 border-t border-white/8">
                <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 rounded-xl p-2.5">
                  <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                  <span>معاينة وقياس قبل الدفع</span>
                </div>
                <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 rounded-xl p-2.5">
                  <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                  <span>دفع عند الاستلام أو انستا باي</span>
                </div>
                <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 rounded-xl p-2.5">
                  <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                  <span>استبدال فوري خلال 14 يوم</span>
                </div>
              </div>
            </div>

            {/* Right: 3D Floating Interactive Sneaker Card */}
            <div className="lg:col-span-5">
              <CinematicShoeViewer
                imageSrc={INITIAL_PRODUCTS[0].images[0]}
                images={INITIAL_PRODUCTS[0].images}
                title={INITIAL_PRODUCTS[0].title}
                price={INITIAL_PRODUCTS[0].sale_price}
                originalPrice={INITIAL_PRODUCTS[0].base_price}
              />
            </div>

          </div>
        </div>
      </section>

      {/* 2. INFINITE CINEMATIC RUNWAY TICKER */}
      <div className="relative -my-12 overflow-hidden border-y border-white/10 bg-[#0A0A0E]/90 py-4 backdrop-blur-2xl shadow-2xl">
        <div className="animate-marquee whitespace-nowrap text-xs sm:text-sm font-black tracking-widest text-accent uppercase flex items-center gap-8 font-mono">
          <span>✦ SOLEVAULT ARCHIVE CAIRO</span>
          <span>•</span>
          <span>معاينة وقياس حقيقي قبل الدفع 100%</span>
          <span>•</span>
          <span>توصيل بوسطة السريع (2 - 4 أيام)</span>
          <span>•</span>
          <span>دفع كاش COD أو INSTAPAY</span>
          <span>•</span>
          <span>ضمان استبدال فوري للمقاس 14 يوم</span>
          <span>•</span>
          <span>خامات ماستر كواليتي مستوردة</span>
          <span>•</span>
          <span>✦ SOLEVAULT ARCHIVE CAIRO</span>
          <span>•</span>
          <span>معاينة وقياس حقيقي قبل الدفع 100%</span>
          <span>•</span>
          <span>توصيل بوسطة السريع (2 - 4 أيام)</span>
          <span>•</span>
          <span>دفع كاش COD أو INSTAPAY</span>
          <span>•</span>
          <span>ضمان استبدال فوري للمقاس 14 يوم</span>
        </div>
      </div>

      {/* 3. PRODUCTS CATALOG SECTION */}
      <section id="products" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-accent flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" /> THE VAULT COLLECTION
            </span>
            <h2 className="mt-1 text-3xl font-black text-foreground sm:text-4xl">
              الكوتشيات الجاهزة للشحن الفوري
            </h2>
          </div>
          <p className="text-sm text-muted">
            جميع الموديلات متوفرة بمقاسات من 40 إلى 45
          </p>
        </div>

        {/* Product Cards Grid with Interactive Cart & Size Selector */}
        <ProductCatalog products={INITIAL_PRODUCTS} />
      </section>

      {/* 4. WHY CHOOSE SOLEVAULT */}
      <section id="why-us" className="border-y border-white/5 bg-[#09090D]/80 py-24 backdrop-blur-2xl relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-accent/5 blur-[160px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-black uppercase tracking-widest text-accent font-mono">
              [ THE SOLEVAULT STANDARD ]
            </span>
            <h2 className="mt-2 text-3xl font-black text-white sm:text-5xl">
              ليه تشتري من سول فولت وأنت مطمن 100%؟
            </h2>
            <p className="mt-4 text-sm text-muted/90 font-medium">
              صممنا تجربة الشراء عشان تناسب السوق المصري وتحل كل المشاكل اللي بتقابلك في الأونلاين بهيبة واحترافية كاملة.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-[2rem] border border-white/8 bg-[#0E0E14]/75 p-8 transition-all duration-300 hover:border-accent/40 hover:bg-[#14141C]/90 hover:shadow-2xl hover:-translate-y-1">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent border border-accent/20">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-lg font-black text-white">
                المعاينة والقياس قبل دفع مليم
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted/90 font-medium">
                المندوب بيوصلك لحد البيت أو الشغل، بتفتح العلبة وتشوف الخامات وتلبس الكوتشي بنفسك وتتأكد من المقاس. عجبك بتدفع، معجبكش بترجعه فوراً بدون إحراج.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/8 bg-[#0E0E14]/75 p-8 transition-all duration-300 hover:border-accent/40 hover:bg-[#14141C]/90 hover:shadow-2xl hover:-translate-y-1">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent border border-accent/20">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-lg font-black text-white">
                خامات ماستر كواليتي مستوردة
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted/90 font-medium">
                مش بنبيع درجات رديئة! كوتشياتنا بتتصنع بنعل ممتص للصدمات وتبطين طبي مريح للظهر والركبة وخياطة دوبل تعيش معاك في كل مشاويرك.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/8 bg-[#0E0E14]/75 p-8 transition-all duration-300 hover:border-accent/40 hover:bg-[#14141C]/90 hover:shadow-2xl hover:-translate-y-1">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent border border-accent/20">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-lg font-black text-white">
                دعم وخدمة ما بعد البيع
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted/90 font-medium">
                فريق خدمة العملاء متاح معاك على الواتساب خطوة بخطوة من أول تسجيل الأوردر لحد ما تستلم وتطمن إن المقاس مظبوط بالمللي.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. STATS SUMMARY SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2.5rem] border border-white/8 bg-[#0A0A0E]/90 p-8 sm:p-12 shadow-2xl backdrop-blur-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl sm:text-5xl font-black text-accent font-mono">50K+</div>
              <div className="text-xs text-muted/90 font-bold mt-1 uppercase tracking-wider">عميل سعيد في مصر</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-black text-white font-mono">48hr</div>
              <div className="text-xs text-muted/90 font-bold mt-1 uppercase tracking-wider">متوسط وقت التوصيل</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-black text-accent font-mono">100%</div>
              <div className="text-xs text-muted/90 font-bold mt-1 uppercase tracking-wider">معاينة قبل الدفع</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-black text-white font-mono">14 يوم</div>
              <div className="text-xs text-muted/90 font-bold mt-1 uppercase tracking-wider">ضمان استبدال المقاس</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. REAL CUSTOMER REVIEWS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-black uppercase tracking-widest text-accent font-mono">
            [ REVIEWS & PROOF ]
          </span>
          <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">
            آراء عملائنا الحقيقيين
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-white/8 bg-[#0E0E14]/75 p-6 shadow-xl backdrop-blur-xl">
            <div className="flex items-center gap-1 text-accent">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-accent" />
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/90">
              "الكوتشي حقيقي فاجئني بالراحة بتاعته! النعل طري جداً ومش حاسس بأي تعب بعد يوم كامل في الجامعة. وفتحت العلبة قست قدام المندوب في مدينة نصر والمقاس جه مظبوط بالظبط."
            </p>
            <div className="mt-4 border-t border-white/8 pt-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-white">محمود عادل</h4>
                <p className="text-xs text-muted">القاهرة (طلب Air Phantom)</p>
              </div>
              <span className="text-[10px] rounded-full bg-success/20 border border-success/30 text-success font-black px-2.5 py-0.5">
                مشتري موثق ✓
              </span>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/8 bg-[#0E0E14]/75 p-6 shadow-xl backdrop-blur-xl">
            <div className="flex items-center gap-1 text-accent">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-accent" />
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/90">
              "دفعت انستا باي والأوردر اتأكد في نفس اللحظة ووصلني الإسكندرية في يومين بالظبط. التغليف والعلبة شيك جداً وكأنك شاري من براند عالمي. تسلم إيديكم."
            </p>
            <div className="mt-4 border-t border-white/8 pt-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-white">طارق إبراهيم</h4>
                <p className="text-xs text-muted">الإسكندرية (طلب Retro Cream)</p>
              </div>
              <span className="text-[10px] rounded-full bg-success/20 border border-success/30 text-success font-black px-2.5 py-0.5">
                مشتري موثق ✓
              </span>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/8 bg-[#0E0E14]/75 p-6 shadow-xl backdrop-blur-xl">
            <div className="flex items-center gap-1 text-accent">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-accent" />
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-foreground">
              "أنا كنت قلقان من المقاس عشان رجلي عريضة شوية، كلمت الدعم على الواتساب نصحوني بمقاس 43 وفعلاً طلع ممتاز ومريح جداً. خدمة محترمة وسريعة."
            </p>
            <div className="mt-4 border-t border-border/60 pt-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-foreground">يوسف حسام</h4>
                <p className="text-xs text-muted">الجيزة (طلب Neon Pulse)</p>
              </div>
              <span className="text-[10px] rounded-full bg-success/20 text-success font-bold px-2.5 py-0.5">
                مشتري موثق ✓
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. EXPANDED INTERACTIVE SECTIONS (FIT FINDER + QUALITY MATRIX + FAQ + VIP WHATSAPP) */}
      <HomepageInteractiveSections />

      {/* 8. URGENT CALL TO ACTION BANNER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-accent/40 bg-gradient-to-r from-surface-elevated via-surface to-surface-elevated p-10 sm:p-14 text-center glow-accent">
          <div className="mx-auto max-w-2xl space-y-4">
            <span className="rounded-full bg-accent/10 border border-accent/30 px-3 py-1 text-xs font-bold text-accent">
              ⚡ باقة العرض الخاص
            </span>
            <h2 className="text-3xl font-black text-foreground sm:text-4xl">
              جاهز ترتقي بستايلك خطوة للأمام؟
            </h2>
            <p className="text-sm leading-relaxed text-muted">
              اطلب دلوقتي واستفيد بخصم يصل لـ 700 جنيه وشحن لباب بيتك مع ميزة المعاينة قبل الاستلام. الكميات محدودة لكل مقاس!
            </p>
            <div className="pt-4 flex justify-center">
              <Link
                href="#products"
                className="rounded-2xl bg-accent px-10 py-4 text-sm font-black text-background transition-all hover:bg-accent-hover hover:scale-105 active:scale-95 glow-accent"
              >
                اختر كوتشيك واطلب الآن
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
