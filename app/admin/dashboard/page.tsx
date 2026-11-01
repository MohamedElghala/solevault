'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Edit3,
  Trash2,
  Search,
  Tag,
  SlidersHorizontal,
  Check,
  Sparkles,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import {
  INITIAL_ORDERS,
  INITIAL_INVENTORY,
  INITIAL_PRODUCTS,
  calculateFinancialSummary,
} from '@/lib/mock-data';
import { Order, InventoryItem, Product } from '@/types';
import { ShippingLabelModal } from '@/components/ShippingLabelModal';
import { AdminProductModal } from '@/components/AdminProductModal';
import { QuickPriceModal } from '@/components/QuickPriceModal';
import { formatPrice } from '@/lib/utils';
import {
  getSupabaseOrders,
  getSupabaseInventory,
  updateSupabaseOrderStatus,
  isSupabaseConfigured,
} from '@/lib/supabase';

const STORAGE_KEY_PRODUCTS = 'solevault_admin_products_v2';
const STORAGE_KEY_INVENTORY = 'solevault_admin_inventory_v2';
const STORAGE_KEY_ORDERS = 'solevault_admin_orders_v2';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'inventory' | 'finance'>('orders');
  
  // Search & Filters
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [inventoryProductFilter, setInventoryProductFilter] = useState<string>('all');

  // Modals state
  const [selectedOrderForLabel, setSelectedOrderForLabel] = useState<Order | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productForQuickPrice, setProductForQuickPrice] = useState<Product | null>(null);

  const [isHydrated, setIsHydrated] = useState(false);
  const [isLoadingLive, setIsLoadingLive] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  // Restore from localStorage
  useEffect(() => {
    try {
      const storedProds = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      const storedInv = localStorage.getItem(STORAGE_KEY_INVENTORY);
      const storedOrds = localStorage.getItem(STORAGE_KEY_ORDERS);

      if (storedProds) setProducts(JSON.parse(storedProds));
      if (storedInv) setInventory(JSON.parse(storedInv));
      if (storedOrds) setOrders(JSON.parse(storedOrds));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage when state updates
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
      localStorage.setItem(STORAGE_KEY_INVENTORY, JSON.stringify(inventory));
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [products, inventory, orders, isHydrated]);

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
        if (liveOrders && liveOrders.length > 0) setOrders(liveOrders as any);
        if (liveInventory && liveInventory.length > 0) setInventory(liveInventory as any);
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

  // 1. ORDER ACTIONS
  const handleUpdateOrderStatus = async (orderId: string, newStatus: any) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, order_status: newStatus } : ord))
    );
    showNotification('تم تحديث حالة الطلب بنجاح');
    if (isSupabaseConfigured) {
      await updateSupabaseOrderStatus(orderId, newStatus);
    }
  };

  const handleUpdateTrackingNumber = (orderId: string, trackingNumber: string) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, tracking_number: trackingNumber } : ord))
    );
    showNotification('تم حفظ رقم بوليصة التتبع');
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الطلب من السجل؟')) {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      showNotification('تم حذف الطلب بنجاح');
    }
  };

  // 2. PRODUCT ACTIONS (Add, Edit, Delete, Quick Price)
  const handleSaveProduct = (
    savedProduct: Product,
    stockPerSize: Record<string, number>,
    supplierCost: number
  ) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === savedProduct.id);
      if (exists) {
        return prev.map((p) => (p.id === savedProduct.id ? savedProduct : p));
      } else {
        return [savedProduct, ...prev];
      }
    });

    // Update or generate inventory items for each size
    setInventory((prev) => {
      const remainingInv = prev.filter((item) => item.product_id !== savedProduct.id);
      const newItems: InventoryItem[] = Object.entries(stockPerSize).map(([size, qty], idx) => ({
        id: `inv-${savedProduct.id}-${size}`,
        product_id: savedProduct.id,
        sku: `SV-${savedProduct.slug.slice(0, 8).toUpperCase()}-${size}`,
        size,
        color: 'Default',
        stock_quantity: qty,
        low_stock_threshold: 3,
        supplier_cost: supplierCost || 950,
        selling_price: savedProduct.sale_price,
      }));
      return [...remainingInv, ...newItems];
    });

    showNotification(
      productToEdit ? `تم تعديل بيانات "${savedProduct.title}"` : `تم تدشين كوتشي "${savedProduct.title}" في المتجر!`
    );
  };

  const handleQuickPriceSave = (productId: string, newSalePrice: number, newBasePrice: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, sale_price: newSalePrice, base_price: newBasePrice } : p
      )
    );
    // Also update inventory selling price
    setInventory((prev) =>
      prev.map((item) =>
        item.product_id === productId ? { ...item, selling_price: newSalePrice } : item
      )
    );
    showNotification('تم تحديث السعر الجديد ونشره فوراً في المتجر!');
  };

  const handleDeleteProduct = (productId: string, productTitle: string) => {
    if (confirm(`هل أنت متأكد من رغبتك في إزالة كوتشي "${productTitle}" من المتجر والمخزون؟`)) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setInventory((prev) => prev.filter((i) => i.product_id !== productId));
      showNotification(`تمت إزالة "${productTitle}" من الكتالوج بنجاح`);
    }
  };

  // 3. INVENTORY ACTIONS
  const handleAdjustStock = (inventoryId: string, delta: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === inventoryId
          ? { ...item, stock_quantity: Math.max(0, item.stock_quantity + delta) }
          : item
      )
    );
  };

  // Reset to default factory data
  const handleResetToDemo = () => {
    if (confirm('هل ترغب في استعادة البيانات التجريبية الافتراضية للمتجر؟')) {
      setProducts(INITIAL_PRODUCTS);
      setInventory(INITIAL_INVENTORY);
      setOrders(INITIAL_ORDERS);
      localStorage.removeItem(STORAGE_KEY_PRODUCTS);
      localStorage.removeItem(STORAGE_KEY_INVENTORY);
      localStorage.removeItem(STORAGE_KEY_ORDERS);
      showNotification('تمت استعادة البيانات الافتراضية بنجاح');
    }
  };

  // Filters
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderStatusFilter === 'all' || o.order_status === orderStatusFilter;
    const q = orderSearchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      o.order_number.toLowerCase().includes(q) ||
      o.customer_name.toLowerCase().includes(q) ||
      o.customer_phone.includes(q) ||
      o.governorate.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  const filteredProducts = products.filter((p) => {
    const q = productSearchQuery.toLowerCase().trim();
    return !q || p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
  });

  const filteredInventory = inventory.filter((item) => {
    return inventoryProductFilter === 'all' || item.product_id === inventoryProductFilter;
  });

  const lowStockItems = inventory.filter((item) => item.stock_quantity <= item.low_stock_threshold);

  // In-transit revenue
  const shippedOrders = orders.filter((o) => o.order_status === 'shipped' || o.order_status === 'processing');
  const inTransitRevenue = shippedOrders.reduce((sum, o) => sum + o.total_amount, 0);

  return (
    <div className="min-h-screen bg-[#07070A] text-[#EDEDED] pb-24 selection:bg-accent selection:text-black">
      
      {/* Notifications Toast */}
      {actionSuccessMsg && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-2xl border border-accent/40 bg-[#14141E] px-5 py-3 text-sm font-black text-accent shadow-2xl backdrop-blur-xl animate-bounce">
          <CheckCircle2 className="h-4 w-4" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Shipping Label Modal */}
      <ShippingLabelModal
        order={selectedOrderForLabel}
        onClose={() => setSelectedOrderForLabel(null)}
      />

      {/* Add / Edit Product Modal */}
      <AdminProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setProductToEdit(null);
        }}
        productToEdit={productToEdit}
        onSave={handleSaveProduct}
      />

      {/* Quick Price Modal */}
      <QuickPriceModal
        product={productForQuickPrice}
        onClose={() => setProductForQuickPrice(null)}
        onSavePrice={handleQuickPriceSave}
      />

      {/* Top Admin Header */}
      <header className="border-b border-white/10 bg-[#0C0C12]/95 backdrop-blur-2xl sticky top-20 z-30 shadow-2xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-black font-black text-lg shadow-lg glow-accent">
              SV
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-black text-white tracking-tight">
                  غرفة عمليات SOLEVAULT المركزية
                </h1>
                <span className="rounded-full bg-accent/15 text-accent text-[10px] font-black px-2.5 py-0.5 border border-accent/30 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> 2FA Active
                </span>
                <span
                  className={`rounded-full text-[10px] font-bold px-2.5 py-0.5 border flex items-center gap-1 ${
                    isSupabaseConfigured
                      ? 'bg-accent/20 text-accent border-accent/40'
                      : 'bg-white/5 text-white/50 border-white/10'
                  }`}
                  title={isSupabaseConfigured ? 'متصل بـ Supabase Live' : 'يعمل بالذاكرة المحلية الفائقة Local Vault'}
                >
                  <Database className="h-3 w-3" />
                  {isSupabaseConfigured ? (isLoadingLive ? 'مزامنة...' : 'Supabase Live') : 'Local Vault'}
                </span>
              </div>
              <p className="text-xs text-white/50">
                إدارة الكتالوج، تعديل الأسعار، تتبع الشحنات، حساب الأرباح وجرد المخزون
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setProductToEdit(null);
                setIsProductModalOpen(true);
              }}
              className="flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-black text-black hover:bg-accent/90 transition-all shadow-lg glow-accent"
            >
              <Plus className="h-4 w-4" />
              <span>إضافة كوتشي جديد</span>
            </button>

            <button
              onClick={handleResetToDemo}
              title="استعادة البيانات الافتراضية للمتجر"
              className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">استعادة الديمو</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white/80 hover:text-accent hover:border-accent/40 transition-colors"
            >
              <span>المتجر الحي</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>

            <Link
              href="/admin/login"
              className="flex items-center gap-1.5 rounded-xl border border-danger/40 bg-danger/10 px-3 py-2 text-xs font-bold text-danger hover:bg-danger/20 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">خروج</span>
            </Link>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex gap-6 text-xs font-bold border-t border-white/10 overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3.5 border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'orders'
                ? 'border-accent text-accent font-black'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>الطلبات والتتبع ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`py-3.5 border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'products'
                ? 'border-accent text-accent font-black'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            <Tag className="h-4 w-4" />
            <span>الكتالوج وتعديل الأسعار ({products.length})</span>
            <span className="rounded-full bg-accent/20 text-accent px-1.5 py-0.2 text-[9px] font-mono">
              PRO
            </span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-3.5 border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'inventory'
                ? 'border-accent text-accent font-black'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            <Package className="h-4 w-4" />
            <span>المخزون والمقاسات</span>
            {lowStockItems.length > 0 && (
              <span className="rounded-full bg-danger px-1.5 py-0.2 text-[9px] text-white font-mono">
                {lowStockItems.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('finance')}
            className={`py-3.5 border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'finance'
                ? 'border-accent text-accent font-black'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            <DollarSign className="h-4 w-4" />
            <span>المالية واقتصاديات القطعة</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* 1. FINANCIAL KPI SUMMARY CARDS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Card 1: Gross Revenue */}
          <div className="rounded-3xl border border-white/10 bg-[#0C0C14] p-5 space-y-2 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between text-white/50 text-xs font-bold">
              <span>إجمالي المبيعات المحصلة</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/15 text-accent">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white tracking-tight">
              {formatPrice(financials.grossRevenue)} ج.م
            </div>
            <p className="text-[11px] text-white/40">
              من {financials.deliveredOrders} طلبات تم تسليمها بنجاح للعملاء
            </p>
          </div>

          {/* Card 2: In-Transit / Pending Collection */}
          <div className="rounded-3xl border border-white/10 bg-[#0C0C14] p-5 space-y-2 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between text-white/50 text-xs font-bold">
              <span>مبالغ قيد التحصيل مع المندوبين</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-400">
                <Truck className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-cyan-400 tracking-tight">
              {formatPrice(inTransitRevenue)} ج.م
            </div>
            <p className="text-[11px] text-white/40">
              في طريقها للتحصيل كاش أو انستاباي
            </p>
          </div>

          {/* Card 3: Net Profit */}
          <div className="rounded-3xl border-2 border-accent/60 bg-gradient-to-br from-[#12121C] to-[#0A0A10] p-5 space-y-2 shadow-2xl glow-accent">
            <div className="flex items-center justify-between text-accent text-xs font-black">
              <span>صافي الأرباح في جيبك (Net Profit)</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-black font-black">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-accent tracking-tight">
              +{formatPrice(financials.totalNetProfit)} ج.م
            </div>
            <div className="flex items-center justify-between text-[11px] font-bold text-white/70">
              <span>هامش الربح الصافي:</span>
              <span className="text-accent font-black">{financials.profitMarginPct}%</span>
            </div>
          </div>

          {/* Card 4: Orders & Returns Pipeline */}
          <div className="rounded-3xl border border-white/10 bg-[#0C0C14] p-5 space-y-2 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between text-white/50 text-xs font-bold">
              <span>حالة الطلبات والمرتجعات</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-white/60">
                <RefreshCw className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">{orders.length}</span>
              <span className="text-xs text-white/40">إجمالي الأوردرات</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-white/50">
              <span>نسبة المرتجع: {financials.returnRatePct}%</span>
              <span className="text-accent font-bold">{financials.pendingOrders} طلبات جديدة</span>
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* TAB 1: ORDERS & TRACKING MANAGEMENT                      */}
        {/* ======================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <span>قائمة طلبات العملاء والتتبع (Orders CRM)</span>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/70 font-mono">
                    {filteredOrders.length}
                  </span>
                </h2>
                <p className="text-xs text-white/50">
                  تواصل عبر واتساب بنقرة واحدة، اطبع بوليصة الشحن الحرارية AWB، وحدث رقم التتبع
                </p>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 sm:w-64">
                  <Search className="h-4 w-4 text-white/40 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="ابحث بالاسم، الموبايل، أو رقم الطلب..."
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] pr-9 pl-4 py-2 text-xs text-white placeholder:text-white/30 focus:border-accent focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-white/40" />
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="rounded-xl border border-white/10 bg-[#14141E] px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-accent"
                  >
                    <option value="all">جميع الحالات</option>
                    <option value="pending">⏳ قيد الانتظار (جديد)</option>
                    <option value="confirmed">📞 تم التأكيد</option>
                    <option value="processing">📦 جاري التجهيز</option>
                    <option value="shipped">🚚 تم الشحن مع المندوب</option>
                    <option value="delivered">✅ تم التسليم والتحصيل</option>
                    <option value="returned">↩️ مرتجع</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#0C0C14] shadow-2xl">
              <table className="w-full text-right text-xs">
                <thead className="border-b border-white/10 bg-white/[0.02] text-white/50 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-4">رقم الطلب</th>
                    <th className="p-4">بيانات العميل</th>
                    <th className="p-4">العنوان والمحافظة</th>
                    <th className="p-4">الكوتشي والمقاس</th>
                    <th className="p-4">طريقة الدفع</th>
                    <th className="p-4">المبلغ والربح</th>
                    <th className="p-4">الحالة وبوليصة الشحن</th>
                    <th className="p-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-12 text-center text-white/40 text-sm">
                        لا توجد طلبات تطابق معايير البحث الحالية
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const whatsappMsg = encodeURIComponent(
                        `مرحباً أستاذ ${order.customer_name}، معاك فريق SOLEVAULT بخصوص طلبك رقم ${order.order_number}. حابين نأكد ميعاد التوصيل لحضرتك في ${order.governorate}.`
                      );

                      return (
                        <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-4 font-mono font-bold text-accent">
                            {order.order_number}
                            <div className="text-[10px] text-white/40 font-normal">
                              {new Date(order.created_at).toLocaleDateString('ar-EG')}
                            </div>
                          </td>

                          <td className="p-4">
                            <div className="font-bold text-white">{order.customer_name}</div>
                            <div className="text-white/50 font-mono" dir="ltr">{order.customer_phone}</div>
                          </td>

                          <td className="p-4 max-w-xs">
                            <span className="font-bold text-white">{order.governorate}</span> - {order.city}
                            <p className="truncate text-white/40 text-[11px]">{order.delivery_address}</p>
                          </td>

                          <td className="p-4">
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="font-bold text-white">
                                {item.product_title}
                                <span className="mr-1.5 rounded bg-accent/20 text-accent px-1.5 py-0.5 text-[10px] font-mono">
                                  مقاس {item.size}
                                </span>
                              </div>
                            ))}
                          </td>

                          <td className="p-4">
                            <span className={`rounded-md px-2 py-1 text-[10px] font-bold ${
                              order.payment_method === 'COD'
                                ? 'bg-white/5 text-white/80 border border-white/10'
                                : 'bg-accent/20 text-accent border border-accent/40'
                            }`}>
                              {order.payment_method === 'COD' ? '💵 عند الاستلام' : '⚡ InstaPay'}
                            </span>
                          </td>

                          <td className="p-4">
                            <div className="font-bold text-white">{formatPrice(order.total_amount)} ج.م</div>
                            <div className="text-accent text-[11px] font-bold font-mono">
                              ربح: +{formatPrice(order.net_profit)} ج.م
                            </div>
                          </td>

                          <td className="p-4 space-y-1.5">
                            <select
                              value={order.order_status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              className="rounded-lg border border-white/10 bg-[#161622] px-2.5 py-1 text-[11px] font-bold text-white focus:outline-none focus:border-accent"
                            >
                              <option value="pending">⏳ قيد الانتظار</option>
                              <option value="confirmed">📞 تم التأكيد</option>
                              <option value="processing">📦 جاري التجهيز</option>
                              <option value="shipped">🚚 تم الشحن</option>
                              <option value="delivered">✅ تم التسليم</option>
                              <option value="returned">↩️ مرتجع</option>
                            </select>

                            {/* Tracking code input */}
                            <div className="flex items-center gap-1">
                              <Truck className="h-3 w-3 text-white/40" />
                              <input
                                type="text"
                                placeholder="رقم بوليصة الشحن..."
                                defaultValue={order.tracking_number || ''}
                                onBlur={(e) => handleUpdateTrackingNumber(order.id, e.target.value)}
                                className="w-28 rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-white/80 border border-white/10 focus:border-accent focus:outline-none font-mono"
                              />
                            </div>
                          </td>

                          <td className="p-4">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* WhatsApp Button */}
                              <a
                                href={`https://wa.me/2${order.customer_phone.replace(/^0/, '')}?text=${whatsappMsg}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-500 transition-colors shadow-sm"
                                title="تواصل مباشر على واتساب"
                              >
                                <Phone className="h-3 w-3" />
                                <span className="hidden sm:inline">واتساب</span>
                              </a>

                              {/* Print Waybill AWB Button */}
                              <button
                                type="button"
                                onClick={() => setSelectedOrderForLabel(order)}
                                className="inline-flex items-center gap-1 rounded-lg bg-white/5 border border-white/10 px-2.5 py-1.5 text-[11px] font-bold text-white hover:border-accent hover:text-accent transition-colors"
                                title="طباعة بوليصة الشحن الحرارية"
                              >
                                <Printer className="h-3 w-3 text-accent" />
                                <span className="hidden sm:inline">AWB</span>
                              </button>

                              {/* Delete Order Button */}
                              <button
                                type="button"
                                onClick={() => handleDeleteOrder(order.id)}
                                className="inline-flex items-center justify-center rounded-lg bg-danger/10 border border-danger/30 p-1.5 text-danger hover:bg-danger/20 transition-colors"
                                title="حذف الطلب"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: PRODUCTS CATALOG & PRICING ENGINE                 */}
        {/* ======================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <span>إدارة كتالوج الكوتشيات والأسعار (Products & Pricing Engine)</span>
                  <span className="rounded-full bg-accent/20 text-accent px-2 py-0.5 text-xs font-mono font-bold">
                    {products.length} موديلات
                  </span>
                </h2>
                <p className="text-xs text-white/50">
                  أضف كوتشيات جديدة، غير أسعار البيع فوراً، وتحكم في الخصومات والموديلات المعروضة
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-56">
                  <Search className="h-4 w-4 text-white/40 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="ابحث باسم الموديل..."
                    value={productSearchQuery}
                    onChange={(e) => setProductSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] pr-9 pl-4 py-2 text-xs text-white placeholder:text-white/30 focus:border-accent focus:outline-none"
                  />
                </div>

                <button
                  onClick={() => {
                    setProductToEdit(null);
                    setIsProductModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-black text-black hover:bg-accent/90 transition-all shadow-lg glow-accent shrink-0"
                >
                  <Plus className="h-4 w-4" />
                  <span>إضافة كوتشي</span>
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const discountPct = Math.round(
                  ((product.base_price - product.sale_price) / product.base_price) * 100
                );
                const productInventory = inventory.filter((i) => i.product_id === product.id);
                const totalStock = productInventory.reduce((sum, i) => sum + i.stock_quantity, 0);

                return (
                  <div
                    key={product.id}
                    className="rounded-3xl border border-white/10 bg-[#0C0C14] overflow-hidden shadow-2xl flex flex-col justify-between hover:border-white/20 transition-all group"
                  >
                    <div>
                      {/* Product Image Banner */}
                      <div className="relative aspect-[16/10] w-full bg-[#14141E] overflow-hidden">
                        <Image
                          src={product.images[0]}
                          alt={product.title}
                          fill
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C14] via-transparent to-transparent" />

                        {/* Badges */}
                        <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
                          {product.is_trending && (
                            <span className="rounded-full bg-accent text-black font-black text-[10px] px-2.5 py-0.5 shadow-md">
                              🔥 الأكثر مبيعاً
                            </span>
                          )}
                          {product.is_featured && (
                            <span className="rounded-full bg-white/20 text-white font-bold text-[10px] px-2.5 py-0.5 backdrop-blur-md">
                              ⭐ مميز
                            </span>
                          )}
                        </div>

                        <div className="absolute bottom-3 right-4">
                          <span className="text-[10px] font-mono uppercase text-accent font-bold tracking-widest">
                            {product.brand}
                          </span>
                          <h3 className="text-base font-black text-white leading-tight">
                            {product.title}
                          </h3>
                        </div>
                      </div>

                      {/* Pricing & Stock Details */}
                      <div className="p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                          <div>
                            <span className="text-[10px] text-white/50 block">سعر البيع الحالي:</span>
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-black text-accent">
                                {formatPrice(product.sale_price)} ج.م
                              </span>
                              <span className="text-xs text-white/40 line-through">
                                {formatPrice(product.base_price)} ج.م
                              </span>
                            </div>
                          </div>

                          <div className="text-left">
                            <span className="rounded-full bg-accent/15 text-accent text-xs font-black px-2.5 py-1 border border-accent/30 inline-block">
                              وفر {discountPct}%
                            </span>
                          </div>
                        </div>

                        {/* Total Stock Bar */}
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white/60">إجمالي المخزون (كافة المقاسات):</span>
                          <span className={`font-mono font-black ${
                            totalStock === 0 ? 'text-danger' : totalStock <= 8 ? 'text-amber-400' : 'text-emerald-400'
                          }`}>
                            {totalStock} قطعة
                          </span>
                        </div>

                        <p className="text-xs text-white/50 line-clamp-2">
                          {product.description}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-5 pt-0 border-t border-white/5 flex items-center justify-between gap-2 mt-2">
                      <button
                        onClick={() => setProductForQuickPrice(product)}
                        className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-accent/15 border border-accent/40 py-2 text-xs font-black text-accent hover:bg-accent hover:text-black transition-all"
                        title="تغيير سعر الكوتشي فوراً"
                      >
                        <DollarSign className="h-3.5 w-3.5" />
                        <span>تعديل السعر</span>
                      </button>

                      <button
                        onClick={() => {
                          setProductToEdit(product);
                          setIsProductModalOpen(true);
                        }}
                        className="flex items-center justify-center rounded-xl bg-white/5 border border-white/10 p-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                        title="تعديل المواصفات والصور"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(product.id, product.title)}
                        className="flex items-center justify-center rounded-xl bg-danger/10 border border-danger/30 p-2 text-danger hover:bg-danger/20 transition-colors"
                        title="إزالة الكوتشي من المتجر"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <Link
                        href={`/products/${product.slug}`}
                        target="_blank"
                        className="flex items-center justify-center rounded-xl bg-white/5 border border-white/10 p-2 text-white/50 hover:text-white transition-colors"
                        title="معاينة صفحة الهبوط"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: INVENTORY & SIZES MATRIX                          */}
        {/* ======================================================== */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <span>جرد المخزون وتفاصيل المقاسات (Inventory Matrix)</span>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/70 font-mono">
                    {filteredInventory.length} SKU
                  </span>
                </h2>
                <p className="text-xs text-white/50">
                  تتبع كميات كل مقاس من 40 إلى 45، ونبهات اقتراب النفاد، وتكلفة شراء المورد
                </p>
              </div>

              {/* Product Filter */}
              <div className="flex items-center gap-3">
                <select
                  value={inventoryProductFilter}
                  onChange={(e) => setInventoryProductFilter(e.target.value)}
                  className="rounded-xl border border-white/10 bg-[#14141E] px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-accent"
                >
                  <option value="all">كافة الكوتشيات والموديلات</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>

                {lowStockItems.length > 0 && (
                  <div className="flex items-center gap-1.5 rounded-xl border border-danger/40 bg-danger/10 px-3 py-1.5 text-xs text-danger font-bold">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{lowStockItems.length} مقاسات حرجة</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInventory.map((item) => {
                const product = products.find((p) => p.id === item.product_id);
                const profitPerItem = item.selling_price - item.supplier_cost;
                const marginPct = Math.round((profitPerItem / item.selling_price) * 100);
                const isLow = item.stock_quantity <= item.low_stock_threshold;
                const isOut = item.stock_quantity === 0;

                return (
                  <div
                    key={item.id}
                    className={`rounded-3xl border p-5 space-y-4 transition-all bg-[#0C0C14] ${
                      isOut
                        ? 'border-danger/80 bg-danger/[0.03]'
                        : isLow
                        ? 'border-danger/40'
                        : 'border-white/10'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{item.sku}</span>
                        <h4 className="font-bold text-sm text-white">{product?.title || 'كوتشي محذوف'}</h4>
                        <span className="text-xs font-bold text-accent">المقاس: {item.size} | اللون: {item.color}</span>
                      </div>

                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-black ${
                        isOut
                          ? 'bg-danger text-white'
                          : isLow
                          ? 'bg-danger/20 text-danger border border-danger/40'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}>
                        {isOut ? 'نفد من المخزن' : isLow ? 'مخزون حرج!' : 'متوفر'}
                      </span>
                    </div>

                    {/* Financial Breakdown per item */}
                    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3 space-y-1.5 text-xs">
                      <div className="flex justify-between text-white/50">
                        <span>سعر بيع العميل:</span>
                        <span className="font-bold text-white">{item.selling_price} ج.م</span>
                      </div>
                      <div className="flex justify-between text-white/50">
                        <span>تكلفة شراء المورد (دروب شيب):</span>
                        <span className="font-bold text-danger">{item.supplier_cost} ج.م</span>
                      </div>
                      <div className="flex justify-between border-t border-white/10 pt-1.5 font-bold">
                        <span className="text-accent">صافي ربح القطعة:</span>
                        <span className="text-accent font-mono">+{profitPerItem} ج.م ({marginPct}%)</span>
                      </div>
                    </div>

                    {/* Stock Counter with +/- Buttons */}
                    <div className="flex items-center justify-between border-t border-white/5 pt-3">
                      <span className="text-xs text-white/60">الكمية بالمخزن:</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleAdjustStock(item.id, -1)}
                          className="h-8 w-8 rounded-lg border border-white/10 bg-white/5 text-sm font-bold text-white hover:border-danger hover:text-danger hover:bg-danger/10 transition-colors"
                        >
                          -
                        </button>
                        <span className="text-base font-black font-mono text-white min-w-[24px] text-center">
                          {item.stock_quantity}
                        </span>
                        <button
                          onClick={() => handleAdjustStock(item.id, 1)}
                          className="h-8 w-8 rounded-lg border border-white/10 bg-white/5 text-sm font-bold text-white hover:border-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
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

        {/* ======================================================== */}
        {/* TAB 4: FINANCIAL REPORTS & UNIT ECONOMICS                */}
        {/* ======================================================== */}
        {activeTab === 'finance' && (
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-lg font-black text-white">
                تحليل الأرباح ونموذج الدروب شيبينج المالي (Financial Analytics)
              </h2>
              <p className="text-xs text-white/50">تفصيل الأرقام الفعلية ومعدل العائد على الاستثمار والسيولة النقدية</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Unit Economics Box */}
              <div className="rounded-3xl border border-white/10 bg-[#0C0C14] p-6 space-y-4 shadow-2xl">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-accent" />
                  <span>اقتصاديات القطعة الواحدة (Unit Economics):</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-white/60">متوسط سعر البيع للكوتشي:</span>
                    <span className="font-bold text-white">2,499 ج.م</span>
                  </div>

                  <div className="flex justify-between border-b border-white/5 pb-2 text-danger">
                    <span>- تكلفة شراء الكوتشي من المورد (دروب شيب):</span>
                    <span className="font-bold font-mono">-950 ج.م</span>
                  </div>

                  <div className="flex justify-between border-b border-white/5 pb-2 text-danger">
                    <span>- تكلفة الشحن الفعلي لشركة التوصيل (بوسطة):</span>
                    <span className="font-bold font-mono">-45 ج.م</span>
                  </div>

                  <div className="flex justify-between border-b border-white/5 pb-2 text-danger">
                    <span>- متوسط تكلفة الإعلان للطلب الناجح (Meta/TikTok CPA):</span>
                    <span className="font-bold font-mono">-150 ج.م</span>
                  </div>

                  <div className="flex justify-between pt-2 text-sm font-black text-accent bg-accent/10 p-3.5 rounded-2xl border border-accent/40 shadow-inner">
                    <span>صافي الربح الحقيقي لكل كوتشي:</span>
                    <span className="font-mono">+{formatPrice(1354)} ج.م (54.1%)</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods Breakdown */}
              <div className="rounded-3xl border border-white/10 bg-[#0C0C14] p-6 space-y-4 shadow-2xl">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-accent" />
                  <span>توزيع طرق الدفع والسيولة:</span>
                </h3>

                <div className="space-y-4 text-xs">
                  <div>
                    <div className="flex justify-between mb-1.5 font-bold">
                      <span className="text-white/80">الدفع عند الاستلام (COD):</span>
                      <span className="text-white">65% من المبيعات</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-white/70 rounded-full" style={{ width: '65%' }} />
                    </div>
                    <span className="text-[10px] text-white/40 mt-1 block">يتم تحصيله وتوريده أسبوعياً من شركة الشحن</span>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1.5 font-bold">
                      <span className="text-accent">التحويل الفوري (InstaPay):</span>
                      <span className="text-accent">35% من المبيعات</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-accent rounded-full" style={{ width: '35%' }} />
                    </div>
                    <span className="text-[10px] text-accent/70 mt-1 block">سيولة كاش فورية في حسابك البنكي دون انتظار</span>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                    <span>نصيحة ذهبية لزيادة السيولة:</span>
                  </h4>
                  <p className="text-[11px] text-white/50 leading-relaxed">
                    شجع عملاء إنستاباي بخصم 50 ج.م إضافي عند إتمام الطلب؛ ستوفر نسبة مرتجع بنسبة 99% وتضمن استلام الكاش فورياً.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

    </div>
  );
}
