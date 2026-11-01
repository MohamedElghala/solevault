import React from 'react';
import Link from 'next/link';
import { RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 space-y-12">
      <div className="border-b border-border pb-6 space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-accent">
          SOLEVAULT GUARANTEE
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-foreground">
          سياسة الاستبدال والاسترجاع (14 يوماً)
        </h1>
        <p className="text-xs text-muted">
          وفقاً لقانون حماية المستهلك المصري رقم 181 لسنة 2018
        </p>
      </div>

      <div className="space-y-8 text-sm leading-relaxed text-muted">
        
        <div className="rounded-2xl border border-border bg-surface p-6 space-y-3">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-accent" />
            <span>1. شروط الاستبدال والاسترجاع</span>
          </h2>
          <ul className="list-disc list-inside space-y-2 text-xs pt-1">
            <li>يحق للعميل استبدال مقاس الكوتشي أو استرجاعه بالكامل خلال 14 يوماً من تاريخ الاستلام.</li>
            <li>يشترط أن يكون الكوتشي بحالته الأصلية غير مستخدم في الشارع ومرفقاً بعلبته وتاجاته الأصلية.</li>
            <li>في حالة وجود عيب مصنعي في الكوتشي، نتحمل مصاريف الشحن بالكامل ذهاباً وإياباً دون أي تكلفة على العميل.</li>
            <li>في حالة طلب استبدال المقاس بناءً على رغبة العميل، يتم دفع مصاريف شحن المندوب فقط.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 space-y-3">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-accent" />
            <span>2. خطوات طلب الاستبدال أو الاسترجاع</span>
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-xs pt-1">
            <li>تواصل مع فريق الدعم عبر الواتساب على مدار الساعة.</li>
            <li>أرسل رقم طلبك (مثال: SV-2026-101) وصورة للكوتشي والمقاس المطلوب بدلاً منه.</li>
            <li>يصلك مندوب الشحن ومعه المقاس الجديد لاستلام الكوتشي القديم فوراً.</li>
          </ol>
        </div>

      </div>

      <div className="border-t border-border pt-6 flex justify-between items-center text-xs">
        <Link href="/" className="text-accent font-bold hover:underline">
          ← العودة للمتجر الرئيسي
        </Link>
        <Link href="/privacy" className="text-muted hover:text-foreground">
          سياسة الخصوصية →
        </Link>
      </div>
    </div>
  );
}
