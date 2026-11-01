'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Stealth protection: silently redirect any unauthorized visitor to home
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-8xl font-black text-white/10 font-mono tracking-tighter">404</h1>
      <h2 className="text-2xl font-black text-white mt-4">الصفحة المطلوبة غير موجودة</h2>
      <p className="text-xs text-white/40 mt-2">
        تم نقل هذه الصفحة أو أنها غير متاحة.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-bold text-white hover:bg-white/10 transition-colors"
      >
        العودة للمتجر
      </Link>
    </div>
  );
}
