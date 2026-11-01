'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  DollarSign,
  Package,
  ShoppingBag,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Filter,
  Plus,
  RefreshCw,
  LogOut,
  Truck,
  ArrowUpRight,
  ShieldCheck,
  Printer,
  Database,
} from 'lucide-react';
import {
  INITIAL_ORDERS,
  INITIAL_INVENTORY,
  INITIAL_PRODUCTS,
  calculateFinancialSummary,
} from '@/lib/mock-data';
import { Order, InventoryItem } from '@/types';
import { ShippingLabelModal } from '@/components/ShippingLabelModal';
import { formatPrice } from '@/lib/utils';
import {
  getSupabaseOrders,
  getSupabaseInventory,
  updateSupabaseOrderStatus,
  isSupabaseConfigured,
} from '@/lib/supabase';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'finance'>('orders');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [isLoadingLive, setIsLoadingLive] = useState(false);
  
  // Waybill / AWB Modal State
  const [selectedOrderForLabel, setSelectedOrderForLabel] = useState<Order | null>(null);

  // Load real Supabase data if configured
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let isMounted = true;
    async function fetchLiveRecords() {
      setIsLoadingLive(true);
      try {
        const [liveOrders, liveInventory] = await Promise.all([
          getSupabaseOrders(),
          getSupabaseInventory(),
        ]);
        if (!isMounted) return;
        if (liveOrders && liveOrders.length > 0) {
          setOrders(liveOrders as any);
        }
        if (liveInventory && liveInventory.length > 0) {
          setInventory(liveInventory as any);
        }
      } catch (err) {
        console.warn('Live fetch error:', err);
      } finally {
        if (isMounted) setIsLoadingLive(false);
      }
    }

    fetchLiveRecords();
    return () => {
      isMounted = false;
    };
  }, []);

  const financials = calculateFinancialSummary(orders);

  // Quick order status updater
  const handleUpdateOrderStatus = async (orderId: string, newStatus: any) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, order_status: newStatus } : ord))
    );
    if (isSupabaseConfigured) {
      await updateSupabaseOrderStatus(orderId, newStatus);
    }
  };

  // Quick inventory stock adjuster
  const handleAdjustStock = (inventoryId: string, delta: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === inventoryId
          ? { ...item, stock_quantity: Math.max(0, item.stock_quantity + delta) }
          : item
      )
    );
  };

  const filteredOrders = orders.filter((o) =>
    orderStatusFilter === 'all' ? true : o.order_status === orderStatusFilter
  );

  const lowStockItems = inventory.filter((item) => item.stock_quantity <= item.low_stock_threshold);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      
      {/* Shipping Label Modal */}
      <ShippingLabelModal
        order={selectedOrderForLabel}
        onClose={() => setSelectedOrderForLabel(null)}
      />

      {/* Top Admin Header */}
      <div className="border-b border-border bg-surface sticky top-20 z-30">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-background font-black">
              SV
            </div>
            <div>
              <h1 className="text-xl font-black text-foreground flex items-center gap-2">
                <span>لوحة تحكم SOLEVAULT المركزية</span>
                <span className="rounded-full bg-success/20 text-success text-[10px] font-bold px-2 py-0.5 border border-success/30 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> 2FA Active
                </span>
                <span
                  className={`rounded-full text-[10px] font-bold px-2.5 py-0.5 border flex items-center gap-1 ${
                    isSupabaseConfigured
                      ? 'bg-accent/20 text-accent border-accent/40'
                      : 'bg-muted/20 text-muted border-border'
                  }`}
                  title={isSupabaseConfigured ? 'متصل بقاعدة بيانات Supabase الحية' : 'يعمل بنمط الذاكرة المحلية (Local Mode)'}
                >
                  <Database className="h-3 w-3" />
                  {isSupabaseConfigured ? (isLoadingLive ? 'جاري المزامنة...' : 'Supabase Live') : 'Local Mode'}
                </span>
              </h1>
              <p className="text-xs text-muted">إدارة الطلبات، متابعة الدروب شيبينج، جرد المخزون، وحساب الأرباح</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/track"
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-bold text-foreground hover:border-accent hover:text-accent"
            >
              صفحة تتبع الشحنات ↗
            </Link>
            <Link
              href="/"
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-bold text-foreground hover:border-accent hover:text-accent"
            >
              عرض المتجر للعملاء ↗
            </Link>
            <Link
              href="/admin/login"
              className="flex items-center gap-1.5 rounded-lg border border-danger/40 bg-danger/10 px-3 py-1.5 text-xs font-bold text-danger hover:bg-danger/20"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>خروج</span>
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex gap-6 text-xs font-bold border-t border-border/60">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-accent text-accent'
                : 'border-transparent text-muted hover:text-foreground'
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>إدارة الطلبات ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-3 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'inventory'
                ? 'border-accent text-accent'
                : 'border-transparent text-muted hover:text-foreground'
            }`}
          >
            <Package className="h-4 w-4" />
            <span>حساب المخزون والمقاسات</span>
            {lowStockItems.length > 0 && (
              <span className="rounded-full bg-danger px-1.5 py-0.2 text-[9px] text-white">
                {lowStockItems.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('finance')}
            className={`py-3 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'finance'
                ? 'border-accent text-accent'
                : 'border-transparent text-muted hover:text-foreground'
            }`}
          >
            <DollarSign className="h-4 w-4" />
            <span>الأرباح والتكاليف والتقارير</span>
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* 1. FINANCIAL KPI SUMMARY CARDS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Card 1: Gross Revenue */}
          <div className="rounded-2xl border border-border bg-surface p-5 space-y-2">
            <div className="flex items-center justify-between text-muted text-xs font-bold">
              <span>إجمالي المبيعات المحصلة</span>
              <DollarSign className="h-4 w-4 text-accent" />
            </div>
            <div className="text-2xl font-black text-foreground">
              {formatPrice(financials.grossRevenue)} ج.م
            </div>
            <p className="text-[11px] text-muted">
              من {financials.deliveredOrders} طلبات تم تسليمها بنجاح
            </p>
          </div>

          {/* Card 2: Total Supplier Cost */}
          <div className="rounded-2xl border border-border bg-surface p-5 space-y-2">
            <div className="flex items-center justify-between text-muted text-xs font-bold">
              <span>تكلفة شراء الكوتشيات (المورد)</span>
              <Truck className="h-4 w-4 text-muted" />
            </div>
            <div className="text-2xl font-black text-danger">
              {formatPrice(financials.totalSupplierCost)} ج.م
            </div>
            <p className="text-[11px] text-muted">
              شامل شحن المورد والدروب شيبينج
            </p>
          </div>

          {/* Card 3: Net Profit */}
          <div className="rounded-2xl border-2 border-accent bg-surface-elevated p-5 space-y-2 shadow-lg glow-accent">
            <div className="flex items-center justify-between text-accent text-xs font-black">
              <span>صافي الأرباح في جيبك (Net Profit)</span>
              <TrendingUp className="h-4 w-4 text-accent" />
            </div>
            <div className="text-3xl font-black text-accent">
              +{formatPrice(financials.totalNetProfit)} ج.م
            </div>
            <div className="flex items-center justify-between text-[11px] font-bold text-foreground">
              <span>هامش الربح الصافي:</span>
              <span className="text-accent">{financials.profitMarginPct}%</span>
            </div>
          </div>

          {/* Card 4: Orders & Returns Pipeline */}
          <div className="rounded-2xl border border-border bg-surface p-5 space-y-2">
            <div className="flex items-center justify-between text-muted text-xs font-bold">
              <span>حالة الطلبات والمرتجعات</span>
              <RefreshCw className="h-4 w-4 text-muted" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-foreground">{orders.length}</span>
              <span className="text-xs text-muted">إجمالي الأوردرات</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-muted">
              <span>نسبة المرتجع: {financials.returnRatePct}%</span>
              <span className="text-success font-bold">{financials.pendingOrders} طلبات جديدة</span>
            </div>
          </div>

        </div>

        {/* 2. TAB CONTENT: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <h2 className="text-lg font-black text-foreground">
                  قائمة طلبات العملاء (Orders CRM)
                </h2>
                <p className="text-xs text-muted">تابع كل طلب، تواصل بنقرة واحدة عبر واتساب، واطبع بوليصة الشحن (AWB)</p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted" />
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="rounded-xl border border-border bg-surface px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:border-accent"
                >
                  <option value="all">جميع الحالات ({orders.length})</option>
                  <option value="pending">قيد الانتظار (جديد)</option>
                  <option value="confirmed">تم التأكيد مع العميل</option>
                  <option value="shipped">تم الشحن مع المندوب</option>
                  <option value="delivered">تم التسليم والتحصيل</option>
                  <option value="returned">مرتجع</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
              <table className="w-full text-right text-xs">
                <thead className="border-b border-border bg-surface-elevated text-muted uppercase">
                  <tr>
                    <th className="p-4">رقم الطلب</th>
                    <th className="p-4">بيانات العميل</th>
                    <th className="p-4">المحافظة والعنوان</th>
                    <th className="p-4">الموديل والمقاس</th>
                    <th className="p-4">طريقة الدفع</th>
                    <th className="p-4">المبلغ والربح</th>
                    <th className="p-4">الحالة</th>
                    <th className="p-4">إجراءات سريعة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredOrders.map((order) => {
                    const whatsappMsg = encodeURIComponent(
                      `مرحباً أستاذ ${order.customer_name}، معاك فريق SOLEVAULT بخصوص طلبك رقم ${order.order_number}. حابين نأكد ميعاد التوصيل لحضرتك في ${order.governorate}.`
                    );

                    return (
                      <tr key={order.id} className="hover:bg-surface-elevated/50 transition-colors">
                        <td className="p-4 font-mono font-bold text-accent">
                          {order.order_number}
                        </td>

                        <td className="p-4">
                          <div className="font-bold text-foreground">{order.customer_name}</div>
                          <div className="text-muted font-mono" dir="ltr">{order.customer_phone}</div>
                        </td>

                        <td className="p-4 max-w-xs">
                          <span className="font-bold text-foreground">{order.governorate}</span> - {order.city}
                          <p className="truncate text-muted text-[11px]">{order.delivery_address}</p>
                        </td>

                        <td className="p-4">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="font-bold text-foreground">
                              {item.product_title}
                              <span className="mr-1.5 rounded bg-accent/20 text-accent px-1.5 py-0.5 text-[10px]">
                                مقاس {item.size}
                              </span>
                            </div>
                          ))}
                        </td>

                        <td className="p-4">
                          <span className={`rounded-md px-2 py-1 text-[10px] font-bold ${
                            order.payment_method === 'COD'
                              ? 'bg-surface-elevated text-foreground border border-border'
                              : 'bg-accent/20 text-accent border border-accent/40'
                          }`}>
                            {order.payment_method === 'COD' ? '💵 عند الاستلام' : '⚡ InstaPay'}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="font-bold text-foreground">{formatPrice(order.total_amount)} ج.م</div>
                          <div className="text-accent text-[11px] font-bold">ربح: +{formatPrice(order.net_profit)} ج.م</div>
                        </td>

                        <td className="p-4">
                          <select
                            value={order.order_status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className="rounded-lg border border-border bg-background px-2 py-1 text-[11px] font-bold text-foreground focus:outline-none focus:border-accent"
                          >
                            <option value="pending">⏳ قيد الانتظار</option>
                            <option value="confirmed">📞 تم التأكيد</option>
                            <option value="processing">📦 جاري التجهيز</option>
                            <option value="shipped">🚚 تم الشحن</option>
                            <option value="delivered">✅ تم التسليم</option>
                            <option value="returned">↩️ مرتجع</option>
                          </select>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {/* WhatsApp Button */}
                            <a
                              href={`https://wa.me/2${order.customer_phone.replace(/^0/, '')}?text=${whatsappMsg}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-lg bg-success px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-success/90 transition-colors"
                              title="تواصل مباشر على واتساب"
                            >
                              <Phone className="h-3 w-3" />
                              <span>واتساب</span>
                            </a>

                            {/* Print Waybill AWB Button */}
                            <button
                              type="button"
                              onClick={() => setSelectedOrderForLabel(order)}
                              className="inline-flex items-center gap-1 rounded-lg bg-surface-elevated border border-border px-2.5 py-1.5 text-[11px] font-bold text-foreground hover:border-accent hover:text-accent transition-colors"
                              title="طباعة بوليصة الشحن الحرارية"
                            >
                              <Printer className="h-3 w-3 text-accent" />
                              <span>بوليصة AWB</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. TAB CONTENT: INVENTORY MANAGEMENT */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="border-b border-border pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-foreground">
                  جرد المخزون والمقاسات (Inventory)
                </h2>
                <p className="text-xs text-muted">تتبع الكميات المتوفرة وتكاليف المورد وهامش الربح لكل مقاس</p>
              </div>

              {lowStockItems.length > 0 && (
                <div className="flex items-center gap-2 rounded-xl border border-danger/40 bg-danger/10 px-3 py-1.5 text-xs text-danger font-bold">
                  <AlertTriangle className="h-4 w-4" />
                  <span>تنبيه: {lowStockItems.length} مقاسات أوشكت على النفاد!</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inventory.map((item) => {
                const product = INITIAL_PRODUCTS.find((p) => p.id === item.product_id);
                const profitPerItem = item.selling_price - item.supplier_cost;
                const marginPct = Math.round((profitPerItem / item.selling_price) * 100);
                const isLow = item.stock_quantity <= item.low_stock_threshold;
                const isOut = item.stock_quantity === 0;

                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border p-5 space-y-4 transition-all bg-surface ${
                      isOut
                        ? 'border-danger/80 bg-danger/5'
                        : isLow
                        ? 'border-danger/40'
                        : 'border-border'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-muted uppercase">{item.sku}</span>
                        <h4 className="font-bold text-sm text-foreground">{product?.title}</h4>
                        <span className="text-xs font-bold text-accent">المقاس: {item.size} | اللون: {item.color}</span>
                      </div>

                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-black ${
                        isOut
                          ? 'bg-danger text-white'
                          : isLow
                          ? 'bg-danger/20 text-danger border border-danger/40'
                          : 'bg-success/20 text-success border border-success/40'
                      }`}>
                        {isOut ? 'نفد من المخزن' : isLow ? 'مخزون حرج!' : 'متوفر'}
                      </span>
                    </div>

                    {/* Financial Breakdown per item */}
                    <div className="rounded-xl border border-border/80 bg-background/80 p-3 space-y-1.5 text-xs">
                      <div className="flex justify-between text-muted">
                        <span>سعر بيع العميل:</span>
                        <span className="font-bold text-foreground">{item.selling_price} ج.م</span>
                      </div>
                      <div className="flex justify-between text-muted">
                        <span>تكلفة شراء المورد (دروب شيب):</span>
                        <span className="font-bold text-danger">{item.supplier_cost} ج.م</span>
                      </div>
                      <div className="flex justify-between border-t border-border/60 pt-1.5 font-bold">
                        <span className="text-accent">صافي ربح القطعة:</span>
                        <span className="text-accent">+{profitPerItem} ج.م ({marginPct}%)</span>
                      </div>
                    </div>

                    {/* Stock Counter with +/- Buttons */}
                    <div className="flex items-center justify-between border-t border-border/60 pt-3">
                      <span className="text-xs text-muted">الكمية بالمخزن:</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleAdjustStock(item.id, -1)}
                          className="h-8 w-8 rounded-lg border border-border bg-background text-sm font-bold text-foreground hover:border-danger hover:text-danger"
                        >
                          -
                        </button>
                        <span className="text-base font-black font-mono text-foreground min-w-[20px] text-center">
                          {item.stock_quantity}
                        </span>
                        <button
                          onClick={() => handleAdjustStock(item.id, 1)}
                          className="h-8 w-8 rounded-lg border border-border bg-background text-sm font-bold text-foreground hover:border-success hover:text-success"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. TAB CONTENT: FINANCIAL REPORTS */}
        {activeTab === 'finance' && (
          <div className="space-y-6">
            <div className="border-b border-border pb-4">
              <h2 className="text-lg font-black text-foreground">
                تحليل الأرباح ونموذج الدروب شيبينج المالي
              </h2>
              <p className="text-xs text-muted">تفصيل الأرقام الفعلية ومعدل العائد على الاستثمار</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Unit Economics Box */}
              <div className="rounded-2xl border border-border bg-surface p-6 space-y-4">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-accent" />
                  <span>اقتصاديات القطعة الواحدة (Unit Economics):</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between border-b border-border/60 pb-2">
                    <span className="text-muted">متوسط سعر البيع للكوتشي:</span>
                    <span className="font-bold text-foreground">2,499 ج.م</span>
                  </div>

                  <div className="flex justify-between border-b border-border/60 pb-2 text-danger">
                    <span>- تكلفة شراء الكوتشي من المورد (دروب شيب):</span>
                    <span className="font-bold">-950 ج.م</span>
                  </div>

                  <div className="flex justify-between border-b border-border/60 pb-2 text-danger">
                    <span>- تكلفة الشحن الفعلي لشركة التوصيل (بوسطة):</span>
                    <span className="font-bold">-45 ج.م</span>
                  </div>

                  <div className="flex justify-between border-b border-border/60 pb-2 text-danger">
                    <span>- متوسط تكلفة الإعلان للطلب الناجح (Meta/TikTok CPA):</span>
                    <span className="font-bold">-150 ج.م</span>
                  </div>

                  <div className="flex justify-between pt-2 text-sm font-black text-accent bg-accent/10 p-3 rounded-xl border border-accent/40">
                    <span>صافي الربح الحقيقي لكل كوتشي:</span>
                    <span>+1,354 ج.م (54.1%)</span>
                  </div>
                </div>
              </div>

              {/* Dropshipping Advice & Optimization */}
              <div className="rounded-2xl border border-border bg-surface p-6 space-y-4">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-accent" />
                  <span>توصيات تقليل المرتجعات وزيادة الأرباح:</span>
                </h3>

                <ul className="space-y-3 text-xs text-muted leading-relaxed">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <span><strong>الاتصال للتأكيد قبل الشحن:</strong> اتصال سريع أو رسالة واتساب للعميل تقلل نسبة الرجوع من 35% إلى أقل من 8%.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <span><strong>تشجيع الدفع عبر InstaPay:</strong> قدم خصم رمزي 50 جنيه لمن يدفع عبر InstaPay مسبقاً، هذا يضمن استلام الأوردر بنسبة 100%.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <span><strong>ربط المخزون مع المورد يومياً:</strong> تأكد من المقاسات المتوفرة عند موردك قبل تشغيل الحملات الإعلانية الممولة.</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}
