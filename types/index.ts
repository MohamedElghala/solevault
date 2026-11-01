export interface Product {
  id: string;
  title: string;
  slug: string;
  brand: string;
  description: string;
  base_price: number;
  sale_price: number;
  images: string[];
  features: string[];
  is_trending?: boolean;
  is_featured?: boolean;
}

export interface InventoryItem {
  id: string;
  product_id: string;
  sku: string;
  size: string;
  color: string;
  stock_quantity: number;
  low_stock_threshold: number;
  supplier_cost: number;
  selling_price: number;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_title: string;
  size: string;
  color: string;
  unit_price: number;
  unit_cost: number;
  quantity: number;
  total_price: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  governorate: string;
  city: string;
  delivery_address: string;
  payment_method: 'COD' | 'InstaPay' | 'PayMob';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  order_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'returned' | 'cancelled';
  subtotal: number;
  shipping_fee: number;
  total_amount: number;
  total_supplier_cost: number;
  shipping_cost_actual: number;
  net_profit: number;
  shipping_carrier?: string;
  tracking_number?: string;
  customer_notes?: string;
  created_at: string;
  items?: OrderItem[];
}

export interface FinancialSummary {
  totalOrders: number;
  deliveredOrders: number;
  returnedOrders: number;
  pendingOrders: number;
  grossRevenue: number;
  totalSupplierCost: number;
  totalNetProfit: number;
  profitMarginPct: number;
  returnRatePct: number;
}
