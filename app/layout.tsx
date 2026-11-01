import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LiveSalesTicker } from '@/components/LiveSalesTicker';
import { AnalyticsScripts } from '@/components/AnalyticsScripts';
import { CartProvider } from '@/lib/cart-context';
import { CartDrawer } from '@/components/CartDrawer';

export const metadata: Metadata = {
  title: 'SOLEVAULT — متجر الكوتشيات الحصري في مصر',
  description: 'أحدث كوتشيات الستريتوير والهيب هوب العصرية بجودة تصنيع فائقة. شحن سريع لكافة محافظات مصر مع إمكانية المعاينة قبل الاستلام والدفع عند الاستلام أو انستا باي.',
  keywords: ['كوتشيات', 'أحذية رياضية', 'سنيكرز مصر', 'كوتشي شبابي', 'شراء كوتشي أونلاين', 'كوتشيات نادرة'],
};

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="dark scroll-smooth">
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-accent selection:text-background flex flex-col justify-between relative bg-grid-pattern">
        <CartProvider>
          <AnalyticsScripts />
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <LiveSalesTicker />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
