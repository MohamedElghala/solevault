import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_PRODUCTS, INITIAL_INVENTORY, INITIAL_ORDERS, calculateFinancialSummary } from '@/lib/mock-data';

const MASTER_API_KEY = process.env.VAULT_MASTER_KEY || 'sv_helmy_master_vault_2026';

// In-memory runtime cache for server-side persistence fallback
let runtimeProducts = [...INITIAL_PRODUCTS];
let runtimeInventory = [...INITIAL_INVENTORY];
let runtimeOrders = [...INITIAL_ORDERS];

export async function POST(req: NextRequest) {
  try {
    const authKey = req.headers.get('x-vault-master-key') || req.headers.get('authorization')?.replace('Bearer ', '');
    const body = await req.json();

    // Verify Master Key
    if (authKey !== MASTER_API_KEY && body?.master_key !== MASTER_API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid Master Vault Key' },
        { status: 401 }
      );
    }

    const { action, payload } = body;

    switch (action) {
      case 'GET_STORE_DATA': {
        const financials = calculateFinancialSummary(runtimeOrders);
        return NextResponse.json({
          success: true,
          products: runtimeProducts,
          inventory: runtimeInventory,
          orders: runtimeOrders,
          financials,
        });
      }

      case 'UPDATE_PRODUCT_PRICE': {
        const { product_id, sale_price, base_price } = payload;
        runtimeProducts = runtimeProducts.map((p) =>
          p.id === product_id
            ? { ...p, sale_price: Number(sale_price), base_price: Number(base_price) }
            : p
        );
        // update inventory
        runtimeInventory = runtimeInventory.map((i) =>
          i.product_id === product_id ? { ...i, selling_price: Number(sale_price) } : i
        );
        return NextResponse.json({
          success: true,
          message: 'Price updated successfully',
          products: runtimeProducts,
        });
      }

      case 'ADD_PRODUCT': {
        const newProduct = payload.product;
        const stockPerSize = payload.stockPerSize || {};
        const supplierCost = Number(payload.supplierCost || 950);

        runtimeProducts = [newProduct, ...runtimeProducts];

        // Generate inventory items
        const newInvItems = Object.entries(stockPerSize).map(([size, qty]) => ({
          id: `inv-${newProduct.id}-${size}`,
          product_id: newProduct.id,
          sku: `SV-${newProduct.slug.slice(0, 8).toUpperCase()}-${size}`,
          size,
          color: 'Default',
          stock_quantity: Number(qty),
          low_stock_threshold: 3,
          supplier_cost: supplierCost,
          selling_price: newProduct.sale_price,
        }));

        runtimeInventory = [...runtimeInventory, ...newInvItems];

        return NextResponse.json({
          success: true,
          message: 'Product added successfully',
          products: runtimeProducts,
          inventory: runtimeInventory,
        });
      }

      case 'DELETE_PRODUCT': {
        const { product_id } = payload;
        runtimeProducts = runtimeProducts.filter((p) => p.id !== product_id);
        runtimeInventory = runtimeInventory.filter((i) => i.product_id !== product_id);
        return NextResponse.json({
          success: true,
          message: 'Product deleted successfully',
          products: runtimeProducts,
        });
      }

      case 'UPDATE_ORDER_STATUS': {
        const { order_id, order_status, tracking_number } = payload;
        runtimeOrders = runtimeOrders.map((o) =>
          o.id === order_id
            ? {
                ...o,
                order_status: order_status || o.order_status,
                tracking_number: tracking_number !== undefined ? tracking_number : o.tracking_number,
              }
            : o
        );
        return NextResponse.json({
          success: true,
          message: 'Order updated successfully',
          orders: runtimeOrders,
        });
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Allow CORS so external apps or Portfolio can connect smoothly
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-vault-master-key',
    },
  });
}
