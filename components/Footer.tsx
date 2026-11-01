import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, RotateCcw, Lock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface text-foreground">
      {/* Trust Highlights Bar */}
      <div className="border-b border-border/60 py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 rounded-xl border border-border/80 bg-background/50 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-foreground">معاينة قبل الدفع</h4>
              <p className="text-xs text-muted">افتح العلبة وقيس وتأكد من الجودة براحتك</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-border/80 bg-background/50 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-foreground">شحن سريع لكل مصر</h4>
              <p className="text-xs text-muted">توصيل من 2 إلى 4 أيام عمل لباب بيتك</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-border/80 bg-background/50 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <RotateCcw className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-foreground">استبدال واسترجاع 14 يوم</h4>
              <p className="text-xs text-muted">المقاس مش مظبوط؟ بنبدلهولك في أسرع وقت</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-border/80 bg-background/50 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Lock className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-foreground">دفع آمن 100%</h4>
              <p className="text-xs text-muted">كاش عند الاستلام أو انستا باي أو فيزا</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          
          {/* Brand Info */}
          <div className="md:col-span-2">
            <span className="text-3xl font-black tracking-tighter text-foreground">
              SOLE<span className="text-accent">VAULT</span>
            </span>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
              الوجهة الأولى في مصر لأندر وأقوى كوتشيات الستريتوير والهيب هوب العصرية. جودة تصنيع فائقة، راحة لا تُقارن، وخامات تم اختيارها بعناية لتناسب أناقتك اليومية.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-bold text-accent">
              <span className="rounded-md border border-border bg-background px-3 py-1">💵 الدفع عند الاستلام (COD)</span>
              <span className="rounded-md border border-border bg-background px-3 py-1">⚡ InstaPay فوري</span>
              <span className="rounded-md border border-border bg-background px-3 py-1">💳 فيزا وماستر كارد</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">روابط هامة</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              <li>
                <Link href="/#products" className="transition-colors hover:text-accent">
                  جميع الموديلات
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="transition-colors hover:text-accent">
                  تفاصيل الشحن والتوصيل
                </Link>
              </li>
              <li>
                <Link href="/returns" className="transition-colors hover:text-accent">
                  سياسة الاسترجاع والاستبدال
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Policies */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">السياسات والضمان</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              <li>
                <Link href="/privacy" className="transition-colors hover:text-accent">
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition-colors hover:text-accent">
                  الشروط والأحكام
                </Link>
              </li>
              <li>
                <span className="text-xs text-muted block pt-2">
                  خدمة العملاء: يومياً من 10 صباحاً حتى 10 مساءً
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-border/60 pt-8 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} SOLEVAULT Egypt. جميع الحقوق محفوظة.</p>
          <p className="mt-2 sm:mt-0 font-medium">
            Built for High Performance & Maximum Conversion
          </p>
        </div>
      </div>
    </footer>
  );
}
