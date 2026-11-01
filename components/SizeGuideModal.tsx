'use client';

import React from 'react';
import { X, Ruler, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSize?: (size: string) => void;
}

const SIZE_CHART = [
  { eu: '40', cm: '25.0 سم', us: '7.5', fits: 'طول قدم 24.6 - 25.0 سم' },
  { eu: '41', cm: '26.0 سم', us: '8.5', fits: 'طول قدم 25.5 - 26.0 سم' },
  { eu: '42', cm: '26.5 سم', us: '9.0', fits: 'طول قدم 26.1 - 26.5 سم' },
  { eu: '43', cm: '27.5 سم', us: '10.0', fits: 'طول قدم 27.0 - 27.5 سم' },
  { eu: '44', cm: '28.0 سم', us: '10.5', fits: 'طول قدم 27.6 - 28.0 سم' },
  { eu: '45', cm: '29.0 سم', us: '11.5', fits: 'طول قدم 28.5 - 29.0 سم' },
];

export function SizeGuideModal({ isOpen, onClose, onSelectSize }: SizeGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/15 bg-surface p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 flex h-9 w-9 items-center justify-center rounded-full bg-surface-elevated border border-border text-muted hover:text-foreground transition-colors"
          aria-label="إغلاق دليل المقاسات"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-right space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1 text-xs font-bold text-accent">
            <Ruler className="h-3.5 w-3.5" />
            <span>دليل المقاسات الدقيق للقدم</span>
          </div>
          <h3 className="text-2xl font-black text-foreground">
            ازاي تختار مقاسك المظبوط بالمللي؟
          </h3>
          <p className="text-xs text-muted">
            جميع كوتشيات SOLEVAULT مطابقة للمقاسات الأوروبية القياسية (True To Size).
          </p>
        </div>

        {/* How to measure mini-steps */}
        <div className="rounded-2xl border border-border bg-surface-elevated/80 p-4 space-y-2 text-xs text-muted">
          <span className="font-bold text-foreground block">طريقة القياس بالمسطرة في 30 ثانية:</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
            <div className="rounded-xl bg-background p-2.5 border border-border">
              <span className="font-bold text-accent">1. ضع ورقة بيضاء</span>
              <p className="text-muted mt-1">على الأرض بجوار الحائط وثبت كعب قدمك عليه.</p>
            </div>
            <div className="rounded-xl bg-background p-2.5 border border-border">
              <span className="font-bold text-accent">2. علّم بالقلم</span>
              <p className="text-muted mt-1">عند أطول إصبع في قدمك (غالباً الإبهام).</p>
            </div>
            <div className="rounded-xl bg-background p-2.5 border border-border">
              <span className="font-bold text-accent">3. قيس بالمسطرة</span>
              <p className="text-muted mt-1">المسافة من الكعب للعلامة وقارنها بالجدول أدناه.</p>
            </div>
          </div>
        </div>

        {/* Sizing Table */}
        <div className="overflow-x-auto rounded-2xl border border-border bg-background">
          <table className="w-full text-right text-xs">
            <thead className="border-b border-border bg-surface-elevated text-muted uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3">المقاس (EU)</th>
                <th className="p-3">طول القدم (سم)</th>
                <th className="p-3">المقاس الأمريكي (US)</th>
                <th className="p-3 text-center">اختيار المقاس</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-semibold">
              {SIZE_CHART.map((row) => (
                <tr key={row.eu} className="hover:bg-surface-elevated/60 transition-colors">
                  <td className="p-3 text-accent font-black text-sm">{row.eu}</td>
                  <td className="p-3 text-foreground font-mono">{row.cm}</td>
                  <td className="p-3 text-muted font-mono">{row.us}</td>
                  <td className="p-3 text-center">
                    {onSelectSize && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectSize(row.eu);
                          onClose();
                        }}
                        className="rounded-lg bg-surface-elevated border border-border px-3 py-1 text-[11px] font-bold text-foreground hover:border-accent hover:text-accent transition-colors"
                      >
                        اختر {row.eu}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Guarantee Reminder */}
        <div className="rounded-xl border border-success/40 bg-success/10 p-3.5 flex items-center gap-3 text-xs text-foreground">
          <ShieldCheck className="h-5 w-5 text-success shrink-0" />
          <p>
            <strong>مش متأكد من مقاسك؟</strong> المندوب معاه الأوردر بتفتح وتلبس وتقيس براحتك، ولو طلع المقاس واسع أو ضيق بنبدلهولك فوراً بدون أي تعقيد.
          </p>
        </div>

      </div>
    </div>
  );
}
