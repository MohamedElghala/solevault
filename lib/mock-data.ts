import { Product, InventoryItem, Order, FinancialSummary } from '@/types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Air Phantom Edge "Ghost Black"',
    slug: 'air-phantom-edge-ghost-black',
    brand: 'SOLEVAULT LAB',
    description: 'كوتشي هجين مصمم خصيصاً ليجمع بين راحة المشي الرياضية والفخامة الحضرية. نعل أوسط ممتص للصدمات بتقنية Air Cushioning المزدوجة مع خامات جلدية وشبك تنفسي مقاوم للتآكل.',
    base_price: 3200,
    sale_price: 2499,
    images: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=85',
    ],
    features: [
      'نعل سفلي مضاد للانزلاق عالي الثبات على الأسفلت والسيراميك',
      'تبطين داخلي Memory Foam لراحة فائقة تدوم طوال اليوم',
      'خامات علوية مسامية تسمح بالتهوية وتمنع التعرق',
      'تصميم ستريتوير مستقبلي يلفت الأنظار فوراً',
    ],
    is_trending: true,
    is_featured: true,
  },
  {
    id: 'prod-2',
    title: 'Apex Runner "Neon Pulse"',
    slug: 'apex-runner-neon-pulse',
    brand: 'SOLEVAULT LAB',
    description: 'إصدار الجري الحصري بلمسات الفسفوري النيون Electric Lime. خفة وزن مذهلة مع استجابة ارتدادية فائقة لكل خطوة.',
    base_price: 2800,
    sale_price: 2199,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&w=1000&q=85',
    ],
    features: [
      'هيكل خفيف الوزن (أقل من 320 جرام)',
      'أربطة عاكسة للضوء (Reflective 3M)',
      'نعل ارتدادي فائق المرونة',
    ],
    is_trending: true,
    is_featured: false,
  },
  {
    id: 'prod-3',
    title: 'Shadow Vault "Retro Cream"',
    slug: 'shadow-vault-retro-cream',
    brand: 'SOLEVAULT ARCHIVE',
    description: 'كلاسيكية الثمانينات معالجة بروح معاصرة. درجات البيج الكريمي الفاخر مع لمسات الجلد الطبيعي المعتق.',
    base_price: 3600,
    sale_price: 2899,
    images: [
      'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=85',
    ],
    features: [
      'جلد طبيعي معالج مقاوم للماء والأوساخ',
      'نعل كلاسيكي خياطة متينة ومزدوجة',
      'طراز حصري لمحبي الهيب هوب والفاشون الراقي',
    ],
    is_trending: false,
    is_featured: true,
  },
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  // Product 1 Sizes
  { id: 'inv-1', product_id: 'prod-1', sku: 'SV-GHOST-40', size: '40', color: 'Black/Lime', stock_quantity: 8, low_stock_threshold: 3, supplier_cost: 950, selling_price: 2499 },
  { id: 'inv-2', product_id: 'prod-1', sku: 'SV-GHOST-41', size: '41', color: 'Black/Lime', stock_quantity: 12, low_stock_threshold: 3, supplier_cost: 950, selling_price: 2499 },
  { id: 'inv-3', product_id: 'prod-1', sku: 'SV-GHOST-42', size: '42', color: 'Black/Lime', stock_quantity: 5, low_stock_threshold: 3, supplier_cost: 950, selling_price: 2499 },
  { id: 'inv-4', product_id: 'prod-1', sku: 'SV-GHOST-43', size: '43', color: 'Black/Lime', stock_quantity: 2, low_stock_threshold: 3, supplier_cost: 950, selling_price: 2499 }, // Low stock!
  { id: 'inv-5', product_id: 'prod-1', sku: 'SV-GHOST-44', size: '44', color: 'Black/Lime', stock_quantity: 9, low_stock_threshold: 3, supplier_cost: 950, selling_price: 2499 },
  { id: 'inv-6', product_id: 'prod-1', sku: 'SV-GHOST-45', size: '45', color: 'Black/Lime', stock_quantity: 1, low_stock_threshold: 3, supplier_cost: 950, selling_price: 2499 }, // Low stock!

  // Product 2 Sizes
  { id: 'inv-7', product_id: 'prod-2', sku: 'SV-NEON-41', size: '41', color: 'Red/Pulse', stock_quantity: 6, low_stock_threshold: 3, supplier_cost: 850, selling_price: 2199 },
  { id: 'inv-8', product_id: 'prod-2', sku: 'SV-NEON-42', size: '42', color: 'Red/Pulse', stock_quantity: 14, low_stock_threshold: 3, supplier_cost: 850, selling_price: 2199 },
  { id: 'inv-9', product_id: 'prod-2', sku: 'SV-NEON-43', size: '43', color: 'Red/Pulse', stock_quantity: 4, low_stock_threshold: 3, supplier_cost: 850, selling_price: 2199 },

  // Product 3 Sizes
  { id: 'inv-10', product_id: 'prod-3', sku: 'SV-CREAM-41', size: '41', color: 'Vintage Cream', stock_quantity: 7, low_stock_threshold: 3, supplier_cost: 1100, selling_price: 2899 },
  { id: 'inv-11', product_id: 'prod-3', sku: 'SV-CREAM-42', size: '42', color: 'Vintage Cream', stock_quantity: 3, low_stock_threshold: 3, supplier_cost: 1100, selling_price: 2899 },
  { id: 'inv-12', product_id: 'prod-3', sku: 'SV-CREAM-43', size: '43', color: 'Vintage Cream', stock_quantity: 0, low_stock_threshold: 3, supplier_cost: 1100, selling_price: 2899 }, // Out of stock!
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    order_number: 'SV-2026-101',
    customer_name: 'أحمد محمود الرفاعي',
    customer_phone: '01012345678',
    governorate: 'القاهرة',
    city: 'مدينة نصر',
    delivery_address: 'عمارة 14 شارع عباس العقاد، الدور الرابع شقة 8',
    payment_method: 'COD',
    payment_status: 'paid',
    order_status: 'delivered',
    subtotal: 2499,
    shipping_fee: 50,
    total_amount: 2549,
    total_supplier_cost: 950,
    shipping_cost_actual: 45,
    net_profit: 1554, // 2549 - 950 - 45 = 1554 EGP Net Profit!
    shipping_carrier: 'Bosta',
    tracking_number: 'BST-CAI-99821',
    created_at: '2026-10-17T11:30:00Z',
    items: [
      {
        id: 'item-1',
        order_id: 'ord-101',
        product_title: 'Air Phantom Edge "Ghost Black"',
        size: '42',
        color: 'Black/Lime',
        unit_price: 2499,
        unit_cost: 950,
        quantity: 1,
        total_price: 2499,
      },
    ],
  },
  {
    id: 'ord-102',
    order_number: 'SV-2026-102',
    customer_name: 'عمر شريف الجندي',
    customer_phone: '01198765432',
    governorate: 'الجيزة',
    city: 'الشيخ زايد',
    delivery_address: 'كمبوند الياسمين، فيلا 22ب',
    payment_method: 'InstaPay',
    payment_status: 'paid',
    order_status: 'shipped',
    subtotal: 2899,
    shipping_fee: 0, // Free shipping promotion
    total_amount: 2899,
    total_supplier_cost: 1100,
    shipping_cost_actual: 50,
    net_profit: 1749, // 2899 - 1100 - 50 = 1749 EGP
    shipping_carrier: 'J&T Express',
    tracking_number: 'JT-EG-445129',
    created_at: '2026-10-18T09:15:00Z',
    items: [
      {
        id: 'item-2',
        order_id: 'ord-102',
        product_title: 'Shadow Vault "Retro Cream"',
        size: '43',
        color: 'Vintage Cream',
        unit_price: 2899,
        unit_cost: 1100,
        quantity: 1,
        total_price: 2899,
      },
    ],
  },
  {
    id: 'ord-103',
    order_number: 'SV-2026-103',
    customer_name: 'كريم عبد الرحمن',
    customer_phone: '01234567890',
    governorate: 'الإسكندرية',
    city: 'سموحة',
    delivery_address: 'شارع فوزي معاذ، أمام نادي سموحة، برج الصفوة',
    payment_method: 'COD',
    payment_status: 'pending',
    order_status: 'confirmed',
    subtotal: 2199,
    shipping_fee: 60,
    total_amount: 2259,
    total_supplier_cost: 850,
    shipping_cost_actual: 55,
    net_profit: 1354,
    shipping_carrier: 'Bosta',
    created_at: '2026-10-18T13:40:00Z',
    items: [
      {
        id: 'item-3',
        order_id: 'ord-103',
        product_title: 'Apex Runner "Neon Pulse"',
        size: '41',
        color: 'Red/Pulse',
        unit_price: 2199,
        unit_cost: 850,
        quantity: 1,
        total_price: 2199,
      },
    ],
  },
  {
    id: 'ord-104',
    order_number: 'SV-2026-104',
    customer_name: 'طارق صلاح الدين',
    customer_phone: '01555566677',
    governorate: 'الدقهلية',
    city: 'المنصورة',
    delivery_address: 'شارع المشاية السفلية، بجوار المحكمة',
    payment_method: 'COD',
    payment_status: 'pending',
    order_status: 'pending',
    subtotal: 2499,
    shipping_fee: 65,
    total_amount: 2564,
    total_supplier_cost: 950,
    shipping_cost_actual: 60,
    net_profit: 1554,
    created_at: '2026-10-18T15:20:00Z',
    items: [
      {
        id: 'item-4',
        order_id: 'ord-104',
        product_title: 'Air Phantom Edge "Ghost Black"',
        size: '44',
        color: 'Black/Lime',
        unit_price: 2499,
        unit_cost: 950,
        quantity: 1,
        total_price: 2499,
      },
    ],
  },
];

export function calculateFinancialSummary(orders: Order[]): FinancialSummary {
  const delivered = orders.filter((o) => o.order_status === 'delivered');
  const returned = orders.filter((o) => o.order_status === 'returned');
  const pending = orders.filter((o) => o.order_status === 'pending');

  const grossRevenue = delivered.reduce((sum, o) => sum + o.total_amount, 0);
  const totalSupplierCost = delivered.reduce((sum, o) => sum + o.total_supplier_cost, 0);
  const totalNetProfit = delivered.reduce((sum, o) => sum + o.net_profit, 0);
  const profitMarginPct = grossRevenue > 0 ? (totalNetProfit / grossRevenue) * 100 : 0;
  const returnRatePct = orders.length > 0 ? (returned.length / orders.length) * 100 : 0;

  return {
    totalOrders: orders.length,
    deliveredOrders: delivered.length,
    returnedOrders: returned.length,
    pendingOrders: pending.length,
    grossRevenue,
    totalSupplierCost,
    totalNetProfit,
    profitMarginPct: Number(profitMarginPct.toFixed(1)),
    returnRatePct: Number(returnRatePct.toFixed(1)),
  };
}
