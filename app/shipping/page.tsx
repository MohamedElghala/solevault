import React from 'react';
import Link from 'next/link';
import { Truck, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 space-y-12">
      <div className="border-b border-border pb-6 space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-accent">
          SOLEVAULT EGYPT
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-foreground">
          سياسة الشحن والتوصيل والمعاينة
        </h1>
        <p className="text-xs text-muted">
          آخر تحديث: أكتوبر 2026 — نغطي كافة محافظات جمهورية مصر العربية
        </p>
      </div>

      <div className="space-y-8 text-sm leading-relaxed text-muted">
        
        {/* Section 1 */}
        <div className="rounded-2xl border border-border bg-surface p-6 space-y-3">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Truck className="h-5 w-5 text-accent" />
            <span>1. مدة التوصيل لكافة المحافظات</span>
          </h2>
          <p>
            نعمل مع كبرى شركات الشحن السريع في مصر (بوسطة، J&T Express، وأرامكس) لضمان وصول شحنتك بأقصى سرعة وأمان:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs pt-2">
            <li><strong>محافظات القاهرة الكبرى (القاهرة، الجيزة، القليوبية):</strong> من 24 إلى 48 ساعة عمل.</li>
            <li><strong>محافظات الوجه البحري والإسكندرية ومدن القناة:</strong> من 2 إلى 3 أيام عمل.</li>
            <li><strong>محافظات الصعيد والبحر الأحمر والمناطق النائية:</strong> من 3 إلى 5 أيام عمل.</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="rounded-2xl border border-border bg-surface p-6 space-y-3">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-accent" />
            <span>2. ميزة المعاينة قبل الاستلام (Inspect Before Pay)</span>
          </h2>
          <p>
            من حق كل عميل في SOLEVAULT فتح العلبة وفحص الكوتشي وقياسه والتأكد من المقاس وجودة الخامات قبل دفع أي مليم للمندوب. في حال وجود أي مشكلة بالمقاس، يتم رفض الاستلام أو طلب استبدال المقاس فوراً.
          </p>
        </div>

        {/* Section 3 */}
        <div className="rounded-2xl border border-border bg-surface p-6 space-y-3">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Clock className="h-5 w-5 text-accent" />
            <span>3. مصاريف الشحن</span>
          </h2>
          <p>
            مصاريف الشحن رمزية وثابتة: 45 ج.م لمحافظات القاهرة والجيزة، و60 ج.م لباقي المحافظات. وعند تفعيل عروض الشحن المجاني، يظهر الخصم تلقائياً في صفحة الطلب.
          </p>
        </div>

      </div>

      <div className="border-t border-border pt-6 flex justify-between items-center text-xs">
        <Link href="/" className="text-accent font-bold hover:underline">
          ← العودة لتسوق الكوتشيات
        </Link>
        <Link href="/returns" className="text-muted hover:text-foreground">
          الاطلاع على سياسة الاسترجاع والاستبدال →
        </Link>
      </div>
    </div>
  );
}
