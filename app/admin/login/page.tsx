'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, KeyRound, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();

  // Multi-step authentication state (Password -> 2FA)
  const [step, setStep] = useState<'credentials' | '2fa'>('credentials');
  const [email, setEmail] = useState('admin@solevault.store');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('يرجى كتابة البريد الإلكتروني وكلمة المرور');
      return;
    }

    setIsLoading(true);

    // Simulate backend verification then transition to 2FA Step
    setTimeout(() => {
      setIsLoading(false);
      setStep('2fa');
    }, 700);
  };

  const handle2FASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (totpCode.length !== 6) {
      setErrorMsg('كود المصادقة الثنائية يجب أن يتكون من 6 أرقام');
      return;
    }

    setIsLoading(true);

    // Verify TOTP code (demo accepts 123456 or any 6 digits in demo mode)
    setTimeout(() => {
      setIsLoading(false);
      router.push('/admin/dashboard');
    }, 800);
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-border bg-surface p-8 sm:p-10 shadow-2xl">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 border border-accent/30 text-accent">
            <ShieldCheck className="h-7 w-7" />
          </div>

          <h2 className="text-2xl font-black text-foreground">
            تسجيل دخول الإدارة (Admin)
          </h2>
          
          <p className="text-xs text-muted">
            {step === 'credentials'
              ? 'بوابة الدخول الآمنة لنظام SOLEVAULT المركزي'
              : 'الخطوة 2: التحقق من كود المصادقة الثنائية (2FA Authenticator)'}
          </p>
        </div>

        {errorMsg && (
          <div className="rounded-xl border border-danger/40 bg-danger/10 p-3 text-xs text-danger font-bold text-center">
            {errorMsg}
          </div>
        )}

        {step === 'credentials' ? (
          /* STEP 1: EMAIL & PASSWORD */
          <form onSubmit={handleCredentialsSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                البريد الإلكتروني للإدارة
              </label>
              <input
                type="email"
                required
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  dir="ltr"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                />
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted" />
              </div>
            </div>

            <div className="rounded-xl border border-border/80 bg-surface-elevated p-3 text-xs text-muted space-y-1">
              <span className="font-bold text-foreground">معلومة للأمان:</span>
              <p>نظام SOLEVAULT مفعل عليه المصادقة الثنائية الإلزامية (TOTP 2FA) لحماية بيانات أرباحك وعملائك.</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-accent py-3.5 text-sm font-black text-background transition-all hover:bg-accent-hover hover:scale-[1.02] active:scale-98 glow-accent disabled:opacity-50"
            >
              {isLoading ? 'جاري التحقق...' : 'متابعة إلى خطوة التحقق الثنائي (2FA) ←'}
            </button>
          </form>
        ) : (
          /* STEP 2: 2FA TOTP VERIFICATION */
          <form onSubmit={handle2FASubmit} className="space-y-6">
            <div className="rounded-2xl border border-accent/30 bg-accent/10 p-4 text-center space-y-2">
              <KeyRound className="h-6 w-6 text-accent mx-auto" />
              <h4 className="text-sm font-bold text-foreground">
                افتح تطبيق Google Authenticator أو Authy
              </h4>
              <p className="text-xs text-muted">
                أدخل الكود المكون من 6 أرقام الموجود في تطبيق المصادقة على هاتفك.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-2 text-center">
                كود المصادقة الثنائية (TOTP Code)
              </label>
              <input
                type="text"
                maxLength={6}
                autoFocus
                dir="ltr"
                placeholder="123456"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                className="w-full rounded-2xl border-2 border-accent bg-background py-4 text-center text-3xl font-black tracking-[0.5em] text-accent placeholder:text-muted focus:outline-none"
              />
              <span className="block text-[11px] text-center text-muted mt-2">
                (للتجربة السريعة: اكتب أي 6 أرقام مثل 123456)
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading || totpCode.length !== 6}
              className="w-full rounded-xl bg-accent py-3.5 text-sm font-black text-background transition-all hover:bg-accent-hover hover:scale-[1.02] active:scale-98 glow-accent disabled:opacity-50"
            >
              {isLoading ? 'جاري التحقق من الكود...' : 'تأكيد الدخول إلى لوحة التحكم ←'}
            </button>

            <button
              type="button"
              onClick={() => setStep('credentials')}
              className="w-full text-center text-xs text-muted hover:text-foreground"
            >
              ← العودة لتعديل البريد أو كلمة المرور
            </button>
          </form>
        )}

        <div className="text-center pt-2">
          <Link href="/" className="text-xs text-muted hover:text-accent transition-colors">
            ← العودة لمتجر الكوتشيات الرئيسي
          </Link>
        </div>

      </div>
    </div>
  );
}
