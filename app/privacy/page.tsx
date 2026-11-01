import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 space-y-12">
      <div className="border-b border-border pb-6 space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-accent">
          SECURITY & PRIVACY
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-foreground">
          سياسة الخصوصية وحماية بيانات العملاء
        </h1>
        <p className="text-xs text-muted">
          حماية بياناتك الشخصية وأمان معاملاتك على رأس أولوياتنا
        </p>
      </div>

      <div className="space-y-8 text-sm leading-relaxed text-muted">
        <div className="rounded-2xl border border-border bg-surface p-6 space-y-3">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Lock className="h-5 w-5 text-accent" />
            <span>1. البيانات التي نجمعها ولماذا</span>
          </h2>
          <p>
            نجمع فقط البيانات الضرورية لشحن وتوصيل كوتشيك بنجاح: اسمك، رقم الهاتف للتواصل عبر واتساب أو الاتصال، والعنوان التفصيلي لتوجيه مندوب الشحن.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 space-y-3">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-accent" />
            <span>2. التشفير وعدم مشاركة البيانات</span>
          </h2>
          <p>
            لا نقوم ببيع أو تأجير بيانات عملائنا لأي طرف ثالث. جميع البيانات مخزنة في قواعد بيانات سحابية مشفرة بتشفير AES-256 ومحمية بجدار ناري سحابي.
          </p>
        </div>
      </div>

      <div className="border-t border-border pt-6 flex justify-between items-center text-xs">
        <Link href="/" className="text-accent font-bold hover:underline">
          ← العودة للمتجر الرئيسي
        </Link>
        <Link href="/terms" className="text-muted hover:text-foreground">
          الشروط والأحكام →
        </Link>
      </div>
    </div>
  );
}
