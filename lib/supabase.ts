import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/**
 * 100% Isolated Database Table Names
 * Prefixed strictly with 'solevault_' to guarantee zero collisions with any other projects on Supabase.
 */
export const DB_TABLES = {
  products: 'solevault_products',
  inventory: 'solevault_inventory',
  orders: 'solevault_orders',
  order_items: 'solevault_order_items',
  customers: 'solevault_customers',
  profiles: 'solevault_profiles',
} as const;

/**
 * Supabase Order Service
 */
export async function createSupabaseOrder(orderData: {
  order_number: string;
  customer_name: string;
  customer_phone: string;
  governorate: string;
  city: string;
  delivery_address: string;
  payment_method: 'COD' | 'InstaPay' | 'PayMob';
  subtotal: number;
  shipping_fee: number;
  total_amount: number;
  total_supplier_cost: number;
  shipping_cost_actual: number;
  customer_notes?: string;
  items: Array<{
    product_title: string;
    size: string;
    color: string;
    unit_price: number;
    unit_cost: number;
    quantity: number;
    total_price: number;
  }>;
}) {
  if (!isSupabaseConfigured) {
    return { success: true, isMock: true, order_number: orderData.order_number };
  }

  try {
    const { data: order, error: orderError } = await supabase
      .from(DB_TABLES.orders)
      .insert({
        order_number: orderData.order_number,
        customer_name: orderData.customer_name,
        customer_phone: orderData.customer_phone,
        governorate: orderData.governorate,
        city: orderData.city,
        delivery_address: orderData.delivery_address,
        payment_method: orderData.payment_method,
        subtotal: orderData.subtotal,
        shipping_fee: orderData.shipping_fee,
        total_amount: orderData.total_amount,
        total_supplier_cost: orderData.total_supplier_cost,
        shipping_cost_actual: orderData.shipping_cost_actual,
        customer_notes: orderData.customer_notes || null,
        order_status: 'pending',
      })
      .select()
      .single();

    if (orderError) throw orderError;

    if (order && orderData.items.length > 0) {
      const itemsToInsert = orderData.items.map(item => ({
        order_id: order.id,
        product_title: item.product_title,
        size: item.size,
        color: item.color,
        unit_price: item.unit_price,
        unit_cost: item.unit_cost,
        quantity: item.quantity,
        total_price: item.total_price,
      }));

      const { error: itemsError } = await supabase
        .from(DB_TABLES.order_items)
        .insert(itemsToInsert);

      if (itemsError) console.warn('[Supabase] Items insert warning:', itemsError);
    }

    return { success: true, isMock: false, data: order };
  } catch (err: any) {
    console.error('[Supabase Order Error]:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Supabase Tracking Service
 */
export async function getSupabaseOrderByQuery(query: string) {
  if (!isSupabaseConfigured) {
    return null;
  }

  try {
    const isOrderNumber = query.toUpperCase().startsWith('SV-');
    const column = isOrderNumber ? 'order_number' : 'customer_phone';

    const { data, error } = await supabase
      .from(DB_TABLES.orders)
      .select(`
        *,
        items: ${DB_TABLES.order_items} (*)
      `)
      .eq(column, query)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

/**
 * Fetch all orders for Admin Dashboard (with fallback to mock if unconfigured)
 */
export async function getSupabaseOrders() {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from(DB_TABLES.orders)
      .select(`
        *,
        items: ${DB_TABLES.order_items} (*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('[Supabase] Failed to fetch orders:', err);
    return null;
  }
}

/**
 * Fetch inventory stock items for Admin Dashboard
 */
export async function getSupabaseInventory() {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from(DB_TABLES.inventory)
      .select('*')
      .order('sku', { ascending: true });

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('[Supabase] Failed to fetch inventory:', err);
    return null;
  }
}

/**
 * Update order status in Supabase
 */
export async function updateSupabaseOrderStatus(orderId: string, newStatus: string) {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase
      .from(DB_TABLES.orders)
      .update({ order_status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    return !error;
  } catch {
    return false;
  }
}

/**
 * 2FA / MFA Helper Functions
 */
export async function enrollMFA() {
  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: 'totp',
  });
  return { data, error };
}

export async function verifyMFA(factorId: string, code: string) {
  const { data, error } = await supabase.auth.mfa.challengeAndVerify({
    factorId,
    code,
  });
  return { data, error };
}

export async function checkMFAStatus() {
  const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  return {
    currentLevel: data?.currentLevel,
    nextLevel: data?.nextLevel,
    error,
  };
}
