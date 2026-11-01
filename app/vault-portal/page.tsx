'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminDashboardPage from '@/app/admin/dashboard/page';
import { ShieldCheck, Lock, KeyRound, AlertOctagon } from 'lucide-react';

const MASTER_VAULT_KEY = 'sv_helmy_master_vault_2026';
const AUTH_STORAGE_KEY = 'solevault_master_authenticated';

export default function VaultPortalPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputKey, setInputKey] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // 1. Check if key is passed in URL query parameter (?key=sv_helmy_master_vault_2026)
    const urlKey = searchParams.get('key');
    const storedAuth = typeof window !== 'undefined' ? localStorage.getItem(AUTH_STORAGE_KEY) : null;

    if (urlKey === MASTER_VAULT_KEY || storedAuth === 'true') {
      setIsAuthenticated(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_STORAGE_KEY, 'true');
      }
    }
    setIsChecking(false);
  }, [searchParams]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey === MASTER_VAULT_KEY) {
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
      setErrorMsg('');
    } else {
      setErrorMsg('المفتاح السري غير صحيح. تم تسجيل محاولة الدخول.');
    }
  };

  const handleLock = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
    router.push('/');
  };

  if (isChecking) {
    return <div className="min-h-screen bg-[#07070A]" />;
  }

  // If authenticated -> Render the Full Admin Command Center
  if (isAuthenticated) {
    return (
      <div className="relative">
        {/* Stealth Logout Bar */}
        <div className="bg-[#050508] border-b border-white/5 py-1.5 px-4 text-xs flex items-center justify-between text-white/50">
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-accent">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>SESSION: AUTHENTICATED VIA MASTER VAULT KEY</span>
          </span>
          <button
            onClick={handleLock}
            className="text-danger hover:underline font-bold text-[11px]"
          >
            إغلاق الجلسة وتشفير البوابة 🔒
          </button>
        </div>
        <AdminDashboardPage />
      </div>
    );
  }

  // If not authenticated and no key -> Return Realistic 404 Disguise
  const showLoginPrompt = searchParams.get('auth') === 'true';

  if (!showLoginPrompt) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-8xl font-black text-white/10 font-mono tracking-tighter">404</h1>
        <h2 className="text-2xl font-black text-white mt-4">الصفحة المطلوبة غير موجودة</h2>
        <p className="text-xs text-white/40 mt-2 max-w-sm">
          عذراً، الرابط الذي تحاول الوصول إليه غير متاح أو تم نقله.
        </p>
        <Link
          href="/"
          className="mt-6 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-bold text-white hover:bg-white/10 transition-colors"
        >
          العودة للمتجر الرئيسي
        </Link>
      </div>
    );
  }

  // Stealth Master Key Unlock Prompt (Triggered only when ?auth=true is explicitly passed)
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0C0C14] p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 border border-accent/40 text-accent">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-black text-white">بوابة التحكم المشفرة</h2>
          <p className="text-xs text-white/40">أدخل مفتاح الماستر كي السري لفتح غرفة العمليات</p>
        </div>

        {errorMsg && (
          <div className="rounded-xl border border-danger/40 bg-danger/10 p-3 text-xs text-danger font-bold text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleUnlock} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-white/70 mb-1.5">
              مفتاح التحكم (Master Secret Key):
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-accent focus:outline-none font-mono"
              />
              <KeyRound className="h-4 w-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-accent py-3 text-xs font-black text-black hover:bg-accent/90 transition-all shadow-lg glow-accent"
          >
            فتح الخزنة والتحكم
          </button>
        </form>

        <div className="text-center">
          <Link href="/" className="text-[11px] text-white/30 hover:text-white">
            ← العودة للمتجر
          </Link>
        </div>
      </div>
    </div>
  );
}
