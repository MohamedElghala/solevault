import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 space-y-12">
      <div className="border-b border-border pb-6 space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-accent">
          LEGAL & TERMS
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-foreground">
          الشروط والأحكام العامة
        </h1>
        <p className="text-xs text-muted">
          اتفاقية استخدام وشراء المنتجات عبر موقع SOLEVAULT Egypt
        </p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed text-muted">
        <div className="rounded-2xl border border-border bg-surface p-6 space-y-3">
          <h2 className="text-lg font-bold text-foreground">1. الأسعار والعروض الترويجية</h2>
          <p>
            جميع الأسعار المعروضة على الموقع بالجنيه المصري (EGP). يحق لإدارة المتجر تعديل الأسعار أو إنهاء العروض الترويجية وفقاً لحالة المخزون وتكاليف الشحن.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 space-y-3">
          <h2 className="text-lg font-bold text-foreground">2. جدية الطلبات والدفع عند الاستلام (COD)</h2>
          <p>
            خدمة الدفع عند الاستلام تتطلب التزام العميل ببيانات صحيحة وتواجد في العنوان المتفق عليه لاستلام الشحنة وتفادي تكبيد شركة الشحن أي نفقات عبثية.
          </p>
        </div>
      </div>

      <div className="border-t border-border pt-6 flex justify-between items-center text-xs">
        <Link href="/" className="text-accent font-bold hover:underline">
          ← العودة لتسوق الكوتشيات
        </Link>
      </div>
    </div>
  );
}
