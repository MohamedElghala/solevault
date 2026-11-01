'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ShieldCheck,
  Sparkles,
  PhoneCall,
  Ruler,
  Zap,
} from 'lucide-react';

const FAQS = [
  {
    q: 'إزاي بعاين وأقيس الكوتشي قبل ما أدفع أي جنيه للمندوب؟',
    a: 'المندوب بيوصلك لحد باب البيت أو الشغل، بتفتح العلبة قدامه وتفحص التقفيل والخامات وتلبس الكوتشي في رجلك وتتمشى بيه خطوتين. عجبك والمقاس مظبوط بتدفع الحساب نقداً أو بتحول انستا باي. لو حابب تلغي أو المقاس مش مظبوط بترجعه فوراً مع المندوب ومبتدفعش أي مليم.',
  },
  {
    q: 'التوصيل بياخد كام يوم في القاهرة والمحافظات؟',
    a: 'الشحن داخل القاهرة والجيزة بيتم في خلال 24 إلى 48 ساعة كحد أقصى. لباقي محافظات مصر (الإسكندرية، الدلتا، القناة، والصعيد) بيتم من يومين لـ 4 أيام عبر شركة بوسطة Bosta الرسمية للشحن السريع.',
  },
  {
    q: 'إيه هي طرق الدفع المتاحة؟',
    a: 'بنوفر لك كل الطرق المريحة: 1) الدفع عند الاستلام كاش (COD) بعد المعاينة، 2) التحويل اللحظي عبر InstaPay، 3) الدفع بالبطاقات الائتمانية عبر بوابات الدفع الإلكترونية المعتمدة.',
  },
  {
    q: 'لو استلمت الكوتشي وبعدها حبيت أبدل المقاس أعمل إيه؟',
    a: 'معاك ضمان استبدال مجاني للمقاس لمدة 14 يوم كاملة من تاريخ الاستلام! كل اللي عليك إنك بتبعت رسالة على رقم خدمة العملاء على الواتساب، وبنبعتلك مندوب يبدلك المقاس لحد باب بيتك فوراً وبدون أي تعقيد.',
  },
  {
    q: 'إيه الفرق بين كوتشيات سول فولت وأي كوتشي تاني في السوق؟',
    a: 'سول فولت مش بتبيع درجات تجارية رديئة. خاماتنا ماستر كواليتي مستوردة بمواصفات تقنية: نعل أوسط Air Matrix مبطن ممتص للصدمات، نعل سفلي مقاوم للانزلاق، بطانة Memory Foam مريحة جداً لمرضى آلام الظهر، وخياطة يدوية مزدوجة تعيش معاك سنين.',
  },
];

export function HomepageInteractiveSections() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedFootLength, setSelectedFootLength] = useState<number>(26.5);

  const calculateRecommendedSize = (cm: number) => {
    if (cm <= 25.0) return '40';
    if (cm <= 25.8) return '41';
    if (cm <= 26.5) return '42';
    if (cm <= 27.3) return '43';
    if (cm <= 28.0) return '44';
    return '45';
  };

  const recommendedSize = calculateRecommendedSize(selectedFootLength);

  return (
    <div className="space-y-24">
      
      {/* 1. INTERACTIVE FIT & SIZE FINDER TOOL */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-[#121218] via-[#0A0A0E] to-[#060608] p-8 sm:p-14 shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-4 text-right">
              <span className="text-xs font-black uppercase tracking-widest text-accent font-mono">
                [ PRECISION FIT FINDER ]
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                مش متأكد من مقاسك؟ قيس طول رجلك بالمللي واحنا نحدد لك المقاس المثالي.
              </h2>
              <p className="text-sm leading-relaxed text-muted/90 font-medium">
                مقاسات كوتشيات سول فولت مطابقة للمقاسات الأوروبية القياسية (True to Size). حرك المؤشر أدناه لمعرفة مقاسك المناسب تماماً.
              </p>

              {/* Slider Control */}
              <div className="pt-6 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-muted">طول القدم بالسنتيمتر:</span>
                  <span className="text-accent font-mono text-base font-black">{selectedFootLength.toFixed(1)} سم</span>
                </div>
                <input
                  type="range"
                  min="24.5"
                  max="29.0"
                  step="0.5"
                  value={selectedFootLength}
                  onChange={(e) => setSelectedFootLength(parseFloat(e.target.value))}
                  className="w-full accent-[#C9FF00] h-2 bg-white/10 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-muted font-mono">
                  <span>24.5 سم (مقاس 40)</span>
                  <span>26.5 سم (مقاس 42)</span>
                  <span>29.0 سم (مقاس 45)</span>
                </div>
              </div>
            </div>

            {/* Result Badge Box */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 rounded-3xl border border-accent/30 bg-[#0E0E14]/90 backdrop-blur-xl text-center space-y-3 glow-accent">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <Ruler className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold text-muted uppercase tracking-wider">
                المقاس الموصى به لك:
              </span>
              <div className="text-6xl font-black text-accent font-mono">
                {recommendedSize}
              </div>
              <div className="text-xs text-white/90 font-bold bg-white/5 border border-white/10 rounded-full px-4 py-1.5">
                ✓ مضمون بالمعاينة والقياس مع المندوب
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. THE QUALITY COMPARISON MATRIX */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center space-y-3 mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-accent font-mono">
            [ THE BATTLE OF QUALITY ]
          </span>
          <h2 className="text-3xl font-black text-white sm:text-5xl">
            الفرق بين كوتشيات سول فولت وباقي السوق
          </h2>
          <p className="text-sm text-muted/90 font-medium">
            مقارنة صريحة ومباشرة توضح لك ليه استثمارك في كوتشي سول فولت هو الاختيار الأذكى في مصر.
          </p>
        </div>

        <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0E0E14]/80 shadow-2xl backdrop-blur-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-xs font-black uppercase text-muted font-mono">
                  <th className="p-5 sm:p-6">وجه المقارنة</th>
                  <th className="p-5 sm:p-6 text-accent bg-accent/5 border-x border-accent/20">كوتشيات SOLEVAULT 👟</th>
                  <th className="p-5 sm:p-6 text-muted">كوتشيات السوق العادية ❌</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs sm:text-sm font-medium">
                <tr>
                  <td className="p-5 sm:p-6 font-bold text-white">الخامات والتصنيع</td>
                  <td className="p-5 sm:p-6 bg-accent/5 border-x border-accent/20 text-white font-bold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                    <span>جلد طبيعي مسامي مع خياطة يدوية مزدوجة متينة</span>
                  </td>
                  <td className="p-5 sm:p-6 text-muted/80">جلد صناعي رخيص يتقشر ويتشقق بعد أسابيع</td>
                </tr>
                <tr>
                  <td className="p-5 sm:p-6 font-bold text-white">راحة النعل والمشي</td>
                  <td className="p-5 sm:p-6 bg-accent/5 border-x border-accent/20 text-white font-bold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                    <span>تقنية Air Matrix ممتصة للصدمات مع بطانة طبية</span>
                  </td>
                  <td className="p-5 sm:p-6 text-muted/80">نعل بلاستيكي قاسي يسبب إجهاد للركبة وأسفل الظهر</td>
                </tr>
                <tr>
                  <td className="p-5 sm:p-6 font-bold text-white">سياسة المعاينة قبل الدفع</td>
                  <td className="p-5 sm:p-6 bg-accent/5 border-x border-accent/20 text-white font-bold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                    <span>معاينة حقيقية وقياس مع المندوب قبل دفع مليم</span>
                  </td>
                  <td className="p-5 sm:p-6 text-muted/80">دفع أعمى للمندوب بدون فتح الشحنة وممنوع المعاينة</td>
                </tr>
                <tr>
                  <td className="p-5 sm:p-6 font-bold text-white">ضمان استبدال المقاس</td>
                  <td className="p-5 sm:p-6 bg-accent/5 border-x border-accent/20 text-white font-bold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                    <span>استبدال مجاني وفوري لحد باب البيت لمدة 14 يوم</span>
                  </td>
                  <td className="p-5 sm:p-6 text-muted/80">تجاهل بعد البيع ورفض الاسترجاع أو الاستبدال</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 3. FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION) */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-accent font-mono">
            [ CLARITY & TRUST ]
          </span>
          <h2 className="text-3xl font-black text-white sm:text-5xl">
            الأسئلة الشائعة والأهم لك
          </h2>
          <p className="text-sm text-muted/90 font-medium">
            كل ما يدور في ذهنك بخصوص الاستلام، المقاسات، وسياسة الدفع الآمن.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-white/8 bg-[#0E0E14]/80 backdrop-blur-xl transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-right font-black text-white text-base hover:text-accent transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xs font-mono text-accent font-black">0{idx + 1}.</span>
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-accent transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-6 pt-0 text-sm leading-relaxed text-muted/90 font-medium border-t border-white/5 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. VIP CONCIERGE WHATSAPP SUPPORT BANNER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2.5rem] border border-success/30 bg-gradient-to-r from-[#0C1610] via-[#09120C] to-[#0A0A0E] p-8 sm:p-12 shadow-2xl backdrop-blur-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-right">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-success bg-success/10 border border-success/20 px-3 py-1 rounded-full">
              <span className="h-2 w-2 rounded-full bg-success animate-ping" />
              <span>فريق خدمة العملاء متصل الآن على الواتساب</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              محتاج ترشيح لموديل معين أو استشارة مقاس خاصة؟
            </h3>
            <p className="text-xs sm:text-sm text-muted font-medium max-w-xl">
              تحدث مباشرة مع خبير كوتشيات سول فولت على الواتساب، وساعدنا نختار لك الكوتشي والمقاس الأنسب لستايلك.
            </p>
          </div>

          <a
            href="https://wa.me/201000000000?text=مرحباً%20سول%20فولت،%20محتاج%20استشارة%20بخصوص%20اختيار%20كوتشي%20ومقاس"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl bg-success px-8 py-4 text-sm font-black text-black shadow-xl hover:bg-success/90 transition-all active:scale-95 shrink-0"
          >
            <PhoneCall className="h-4 w-4" />
            <span>تواصل مع خبير الواتساب</span>
          </a>
        </div>
      </section>

    </div>
  );
}
