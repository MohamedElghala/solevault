import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Star, ShieldCheck, Zap, Flame, CheckCircle2, Sparkles, TrendingUp } from 'lucide-react';
import { INITIAL_PRODUCTS } from '@/lib/mock-data';
import { CinematicShoeViewer } from '@/components/CinematicShoeViewer';
import { ProductCatalog } from '@/components/ProductCatalog';
import { formatPrice } from '@/lib/utils';

export default function HomePage() {
  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative overflow-hidden border-b border-border/80 bg-gradient-to-b from-surface via-background to-background pt-12 pb-24 lg:pt-20 lg:pb-32">
        
        {/* Ambient Neon Backlights */}
        <div className="absolute top-1/4 -right-24 h-96 w-96 rounded-full bg-accent/10 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 -left-24 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            
            {/* Left/Text Content */}
            <div className="lg:col-span-7 space-y-6 text-right">
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-black text-accent shadow-sm backdrop-blur-md">
                <Flame className="h-4 w-4 text-accent animate-pulse" />
                <span>إصدارات شتاء 2026 الحصرية — شحن مجاني لفترة محدودة</span>
              </div>

              <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-6xl lg:text-7xl leading-[1.12]">
                أندر الكوتشيات..{' '}
                <span className="text-accent inline-block underline decoration-accent/40 decoration-8 underline-offset-8">
                  بأعلى جودة
                </span>{' '}
                في مصر.
              </h1>

              <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-muted">
                مش مجرد كوتشي، دي تفاصيل بتكمل مظهرك وشخصيتك. راحة فندقية لقدميك طوال اليوم مع خامات ممتازة وضمان معاينة العلبة وقياس المقاس بنفسك مع المندوب قبل دفع أي جنيه.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href="#products"
                  className="flex items-center justify-center gap-3 rounded-2xl bg-accent px-8 py-4 text-sm font-black text-background transition-all hover:bg-accent-hover hover:scale-105 active:scale-95 glow-accent"
                >
                  <span>استكشف الكوتشيات المتاحة</span>
                  <ArrowLeft className="h-4 w-4" />
                </Link>

                <Link
                  href={`/products/${INITIAL_PRODUCTS[0].slug}`}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-surface-elevated/80 backdrop-blur-md px-6 py-4 text-sm font-bold text-foreground transition-all hover:border-accent hover:text-accent"
                >
                  <Zap className="h-4 w-4 text-accent" />
                  <span>الأكثر مبيعاً: Air Phantom</span>
                </Link>
              </div>

              {/* Mini Guarantees Bar */}
              <div className="flex flex-wrap items-center gap-6 pt-6 text-xs font-semibold text-muted border-t border-border/60">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                  <span>معاينة حقيقية قبل الدفع</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                  <span>دفع عند الاستلام (COD) أو انستا باي</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                  <span>استبدال مقاس فوري خلال 14 يوم</span>
                </div>
              </div>
            </div>

            {/* Right: 3D Floating Interactive Sneaker Card */}
            <div className="lg:col-span-5">
              <CinematicShoeViewer
                imageSrc={INITIAL_PRODUCTS[0].images[0]}
                title={INITIAL_PRODUCTS[0].title}
                price={INITIAL_PRODUCTS[0].sale_price}
                originalPrice={INITIAL_PRODUCTS[0].base_price}
              />
            </div>

          </div>
        </div>
      </section>

      {/* 2. INFINITE CINEMATIC MARQUEE BANNER */}
      <div className="relative -my-12 overflow-hidden border-y border-border/80 bg-surface/80 py-3.5 backdrop-blur-md">
        <div className="animate-marquee whitespace-nowrap text-xs sm:text-sm font-black tracking-widest text-accent uppercase flex items-center gap-8">
          <span>⚡ أحدث كوتشيات الستريتوير في مصر</span>
          <span>•</span>
          <span>معاينة وقياس قبل الدفع 100%</span>
          <span>•</span>
          <span>توصيل سريع من 2 إلى 4 أيام</span>
          <span>•</span>
          <span>دفع كاش أو InstaPay أو فيزا</span>
          <span>•</span>
          <span>ضمان استبدال واسترجاع 14 يوم</span>
          <span>•</span>
          <span>خامات ماستر كواليتي مستوردة</span>
          <span>•</span>
          <span>⚡ أحدث كوتشيات الستريتوير في مصر</span>
          <span>•</span>
          <span>معاينة وقياس قبل الدفع 100%</span>
          <span>•</span>
          <span>توصيل سريع من 2 إلى 4 أيام</span>
          <span>•</span>
          <span>دفع كاش أو InstaPay أو فيزا</span>
          <span>•</span>
          <span>ضمان استبدال واسترجاع 14 يوم</span>
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
      <section id="why-us" className="border-y border-border bg-surface/50 py-20 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">
              THE SOLEVAULT STANDARD
            </span>
            <h2 className="mt-2 text-3xl font-black text-foreground sm:text-4xl">
              ليه تشتري من سول فولت وأنت مطمن 100%؟
            </h2>
            <p className="mt-4 text-sm text-muted">
              صممنا تجربة الشراء عشان تناسب السوق المصري وتحل كل المشاكل اللي بتقابلك في الأونلاين.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-3xl border border-border bg-surface p-8 transition-all hover:border-accent/80 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-lg font-bold text-foreground">
                المعاينة والقياس قبل دفع مليم
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                المندوب بيوصلك لحد البيت أو الشغل، بتفتح العلبة وتشوف الخامات وتلبس الكوتشي بنفسك وتتأكد من المقاس. عجبك بتدفع، معجبكش بترجعه فوراً بدون إحراج.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-surface p-8 transition-all hover:border-accent/80 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-lg font-bold text-foreground">
                خامات ماستر كواليتي مستوردة
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                مش بنبيع درجات رديئة! كوتشياتنا بتتصنع بنعل ممتص للصدمات وتبطين طبي مريح للظهر والركبة وخياطة دوبل تعيش معاك في كل مشاويرك.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-surface p-8 transition-all hover:border-accent/80 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-lg font-bold text-foreground">
                دعم وخدمة ما بعد البيع
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                فريق خدمة العملاء متاح معاك على الواتساب خطوة بخطوة من أول تسجيل الأوردر لحد ما تستلم وتطمن إن المقاس مظبوط بالمللي.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. STATS SUMMARY SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border/80 bg-surface-elevated/60 p-8 sm:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl sm:text-5xl font-black text-accent">50K+</div>
              <div className="text-xs text-muted font-bold mt-1 uppercase">عميل سعيد في مصر</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-black text-foreground">48hr</div>
              <div className="text-xs text-muted font-bold mt-1 uppercase">متوسط وقت التوصيل</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-black text-accent">100%</div>
              <div className="text-xs text-muted font-bold mt-1 uppercase">معاينة قبل الدفع</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-black text-foreground">14 يوم</div>
              <div className="text-xs text-muted font-bold mt-1 uppercase">ضمان استبدال المقاس</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. REAL CUSTOMER REVIEWS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-accent">
            REVIEWS & PROOF
          </span>
          <h2 className="mt-2 text-3xl font-black text-foreground sm:text-4xl">
            آراء عملائنا الحقيقيين
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl border border-border bg-surface p-6 shadow-lg">
            <div className="flex items-center gap-1 text-accent">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-accent" />
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-foreground">
              "الكوتشي حقيقي فاجئني بالراحة بتاعته! النعل طري جداً ومش حاسس بأي تعب بعد يوم كامل في الجامعة. وفتحت العلبة قست قدام المندوب في مدينة نصر والمقاس جه مظبوط بالظبط."
            </p>
            <div className="mt-4 border-t border-border/60 pt-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-foreground">محمود عادل</h4>
                <p className="text-xs text-muted">القاهرة (طلب Air Phantom)</p>
              </div>
              <span className="text-[10px] rounded-full bg-success/20 text-success font-bold px-2.5 py-0.5">
                مشتري موثق ✓
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-surface p-6 shadow-lg">
            <div className="flex items-center gap-1 text-accent">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-accent" />
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-foreground">
              "دفعت انستا باي والأوردر اتأكد في نفس اللحظة ووصلني الإسكندرية في يومين بالظبط. التغليف والعلبة شيك جداً وكأنك شاري من براند عالمي. تسلم إيديكم."
            </p>
            <div className="mt-4 border-t border-border/60 pt-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-foreground">طارق إبراهيم</h4>
                <p className="text-xs text-muted">الإسكندرية (طلب Retro Cream)</p>
              </div>
              <span className="text-[10px] rounded-full bg-success/20 text-success font-bold px-2.5 py-0.5">
                مشتري موثق ✓
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-surface p-6 shadow-lg">
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

      {/* 7. URGENT CALL TO ACTION BANNER */}
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
