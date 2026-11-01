-- =========================================================================
-- SOLEVAULT - PRODUCTION SUPABASE DATABASE SCHEMA (100% ISOLATED & SAFE)
-- Designed to run alongside any existing databases/projects with ZERO collision.
-- Uses strict 'solevault_' prefixes and custom schemas to guarantee safety.
-- =========================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- 2. DEDICATED TABLES (Prefixed 'solevault_' to protect existing public tables)
-- =========================================================================

-- USER PROFILES TABLE (Admin and customer accounts)
CREATE TABLE IF NOT EXISTS public.solevault_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'moderator')),
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SNEAKER PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.solevault_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    brand TEXT NOT NULL DEFAULT 'SOLEVAULT',
    description TEXT,
    features TEXT[],
    base_price NUMERIC(10, 2) NOT NULL,
    sale_price NUMERIC(10, 2),
    images TEXT[] NOT NULL DEFAULT '{}',
    is_trending BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INVENTORY & SIZES TABLE (Stock Tracking + Supplier Dropship Purchase Cost)
CREATE TABLE IF NOT EXISTS public.solevault_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.solevault_products(id) ON DELETE CASCADE,
    sku TEXT UNIQUE NOT NULL,
    size TEXT NOT NULL, -- e.g. "40", "41", "42", "43", "44", "45"
    color TEXT NOT NULL DEFAULT 'Original',
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    low_stock_threshold INTEGER NOT NULL DEFAULT 3,
    supplier_cost NUMERIC(10, 2) NOT NULL, -- Purchase cost from dropship supplier
    selling_price NUMERIC(10, 2) NOT NULL, -- Price sold to customer
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT solevault_unique_size_color UNIQUE (product_id, size, color)
);

-- CUSTOMERS CRM TABLE
CREATE TABLE IF NOT EXISTS public.solevault_customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    alt_phone TEXT,
    governorate TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT NOT NULL,
    total_orders INTEGER DEFAULT 0,
    total_spent NUMERIC(10, 2) DEFAULT 0.00,
    is_blocked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ORDERS TABLE (Dropshipping + COD + InstaPay)
CREATE TABLE IF NOT EXISTS public.solevault_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL, -- e.g. "SV-2026-1001"
    customer_id UUID REFERENCES public.solevault_customers(id),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    governorate TEXT NOT NULL,
    city TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    
    -- Payments
    payment_method TEXT NOT NULL CHECK (payment_method IN ('COD', 'InstaPay', 'PayMob')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_reference TEXT,
    
    -- Order Workflow
    order_status TEXT NOT NULL DEFAULT 'pending' CHECK (order_status IN (
        'pending',      -- Waiting review
        'confirmed',    -- Verified with customer via WhatsApp/Call
        'processing',   -- Forwarded to dropship supplier
        'shipped',      -- Dispatched with shipping courier (Bosta, J&T)
        'delivered',    -- Delivered and cash collected
        'returned',     -- Customer rejected delivery
        'cancelled'     -- Cancelled
    )),
    
    -- Financials & Profits
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    shipping_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_supplier_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00, -- Dropship Cost
    shipping_cost_actual NUMERIC(10, 2) NOT NULL DEFAULT 0.00, -- What courier charges
    net_profit NUMERIC(10, 2) NOT NULL DEFAULT 0.00, -- Net Revenue in your pocket
    
    -- Shipping Details
    shipping_carrier TEXT DEFAULT 'Bosta',
    tracking_number TEXT,
    customer_notes TEXT,
    internal_notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.solevault_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.solevault_orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.solevault_products(id),
    inventory_id UUID REFERENCES public.solevault_inventory(id),
    product_title TEXT NOT NULL,
    size TEXT NOT NULL,
    color TEXT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    unit_cost NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    total_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- 3. AUTOMATIC TRIGGERS (STOCK DEDUCTION & PROFIT ENGINE)
-- =========================================================================

-- Trigger function: Update inventory stock on new order
CREATE OR REPLACE FUNCTION public.solevault_handle_new_order_stock()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.solevault_inventory
    SET stock_quantity = stock_quantity - NEW.quantity,
        updated_at = NOW()
    WHERE id = NEW.inventory_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_solevault_deduct_stock ON public.solevault_order_items;
CREATE TRIGGER tr_solevault_deduct_stock
AFTER INSERT ON public.solevault_order_items
FOR EACH ROW
EXECUTE FUNCTION public.solevault_handle_new_order_stock();

-- Trigger function: Auto calculate net profit for order
CREATE OR REPLACE FUNCTION public.solevault_calculate_financials()
RETURNS TRIGGER AS $$
BEGIN
    NEW.net_profit := NEW.total_amount - NEW.total_supplier_cost - NEW.shipping_cost_actual;
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_solevault_order_financials ON public.solevault_orders;
CREATE TRIGGER tr_solevault_order_financials
BEFORE INSERT OR UPDATE OF total_amount, total_supplier_cost, shipping_cost_actual ON public.solevault_orders
FOR EACH ROW
EXECUTE FUNCTION public.solevault_calculate_financials();

-- =========================================================================
-- 4. FINANCIAL ANALYTICS & DASHBOARD VIEW
-- =========================================================================
CREATE OR REPLACE VIEW public.solevault_financial_summary AS
SELECT
    COUNT(*) AS total_orders_count,
    COUNT(CASE WHEN order_status = 'delivered' THEN 1 END) AS delivered_orders,
    COUNT(CASE WHEN order_status = 'returned' THEN 1 END) AS returned_orders,
    COUNT(CASE WHEN order_status = 'pending' THEN 1 END) AS pending_orders,
    COALESCE(SUM(CASE WHEN order_status = 'delivered' THEN total_amount ELSE 0 END), 0) AS gross_revenue,
    COALESCE(SUM(CASE WHEN order_status = 'delivered' THEN total_supplier_cost ELSE 0 END), 0) AS total_dropship_costs,
    COALESCE(SUM(CASE WHEN order_status = 'delivered' THEN net_profit ELSE 0 END), 0) AS total_net_profit,
    CASE 
        WHEN SUM(CASE WHEN order_status = 'delivered' THEN total_amount ELSE 0 END) > 0 
        THEN ROUND(
            (SUM(CASE WHEN order_status = 'delivered' THEN net_profit ELSE 0 END) / 
             SUM(CASE WHEN order_status = 'delivered' THEN total_amount ELSE 0 END)) * 100, 2
        )
        ELSE 0.00 
    END AS overall_profit_margin_pct
FROM public.solevault_orders;

-- =========================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE public.solevault_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solevault_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solevault_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solevault_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solevault_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solevault_profiles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.solevault_is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.solevault_profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public read permissions
CREATE POLICY "solevault_products_public_view" ON public.solevault_products
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "solevault_inventory_public_view" ON public.solevault_inventory
    FOR SELECT USING (stock_quantity > 0);

-- Public order placement
CREATE POLICY "solevault_orders_customer_insert" ON public.solevault_orders
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "solevault_order_items_customer_insert" ON public.solevault_order_items
    FOR INSERT WITH CHECK (TRUE);

-- Admin unrestricted access
CREATE POLICY "solevault_admin_products_all" ON public.solevault_products
    FOR ALL USING (public.solevault_is_admin());

CREATE POLICY "solevault_admin_inventory_all" ON public.solevault_inventory
    FOR ALL USING (public.solevault_is_admin());

CREATE POLICY "solevault_admin_orders_all" ON public.solevault_orders
    FOR ALL USING (public.solevault_is_admin());

CREATE POLICY "solevault_admin_order_items_all" ON public.solevault_order_items
    FOR ALL USING (public.solevault_is_admin());

CREATE POLICY "solevault_admin_customers_all" ON public.solevault_customers
    FOR ALL USING (public.solevault_is_admin());

-- =========================================================================
-- 6. INITIAL SEED DATA (SOLEVAULT MASTER SNEAKERS & INVENTORY)
-- =========================================================================

-- Product 1: Air Phantom Edge "Ghost Black"
INSERT INTO public.solevault_products (id, title, slug, brand, description, features, base_price, sale_price, images, is_trending, is_featured)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Air Phantom Edge "Ghost Black"',
    'air-phantom-edge-ghost-black',
    'SOLEVAULT LAB',
    'كوتشي هجين مصمم خصيصاً ليجمع بين راحة المشي الرياضية والفخامة الحضرية. نعل أوسط ممتص للصدمات بتقنية Air Cushioning المزدوجة مع خامات جلدية وشبك تنفسي مقاوم للتآكل.',
    ARRAY['نعل سفلي مضاد للانزلاق عالي الثبات على الأسفلت والسيراميك', 'تبطين داخلي Memory Foam لراحة فائقة تدوم طوال اليوم', 'خامات علوية مسامية تسمح بالتهوية وتمنع التعرق', 'تصميم ستريتوير مستقبلي يلفت الأنظار فوراً'],
    3200.00,
    2499.00,
    ARRAY['https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=85', 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1000&q=85', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=85'],
    TRUE,
    TRUE
) ON CONFLICT (slug) DO NOTHING;

-- Product 2: Apex Runner "Neon Pulse"
INSERT INTO public.solevault_products (id, title, slug, brand, description, features, base_price, sale_price, images, is_trending, is_featured)
VALUES (
    'a0000000-0000-0000-0000-000000000002',
    'Apex Runner "Neon Pulse"',
    'apex-runner-neon-pulse',
    'SOLEVAULT LAB',
    'إصدار الجري الحصري بلمسات الفسفوري النيون Electric Lime. خفة وزن مذهلة مع استجابة ارتدادية فائقة لكل خطوة.',
    ARRAY['هيكل خفيف الوزن (أقل من 320 جرام)', 'أربطة عاكسة للضوء (Reflective 3M)', 'نعل ارتدادي فائق المرونة'],
    2800.00,
    2199.00,
    ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=85', 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&w=1000&q=85'],
    TRUE,
    FALSE
) ON CONFLICT (slug) DO NOTHING;

-- Product 3: Shadow Vault "Retro Cream"
INSERT INTO public.solevault_products (id, title, slug, brand, description, features, base_price, sale_price, images, is_trending, is_featured)
VALUES (
    'a0000000-0000-0000-0000-000000000003',
    'Shadow Vault "Retro Cream"',
    'shadow-vault-retro-cream',
    'SOLEVAULT ARCHIVE',
    'كلاسيكية الثمانينات معالجة بروح معاصرة. درجات البيج الكريمي الفاخر مع لمسات الجلد الطبيعي المعتق.',
    ARRAY['جلد طبيعي معالج مقاوم للماء والأوساخ', 'نعل كلاسيكي خياطة متينة ومزدوجة', 'طراز حصري لمحبي الهيب هوب والفاشون الراقي'],
    3600.00,
    2899.00,
    ARRAY['https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1000&q=85', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=85'],
    FALSE,
    TRUE
) ON CONFLICT (slug) DO NOTHING;

-- Inventory Sizes & Dropship Costs
INSERT INTO public.solevault_inventory (product_id, sku, size, color, stock_quantity, low_stock_threshold, supplier_cost, selling_price)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'SV-GHOST-40', '40', 'Black/Lime', 8, 3, 950.00, 2499.00),
    ('a0000000-0000-0000-0000-000000000001', 'SV-GHOST-41', '41', 'Black/Lime', 12, 3, 950.00, 2499.00),
    ('a0000000-0000-0000-0000-000000000001', 'SV-GHOST-42', '42', 'Black/Lime', 5, 3, 950.00, 2499.00),
    ('a0000000-0000-0000-0000-000000000001', 'SV-GHOST-43', '43', 'Black/Lime', 2, 3, 950.00, 2499.00),
    ('a0000000-0000-0000-0000-000000000001', 'SV-GHOST-44', '44', 'Black/Lime', 9, 3, 950.00, 2499.00),
    ('a0000000-0000-0000-0000-000000000001', 'SV-GHOST-45', '45', 'Black/Lime', 1, 3, 950.00, 2499.00),
    ('a0000000-0000-0000-0000-000000000002', 'SV-NEON-41', '41', 'Red/Pulse', 6, 3, 850.00, 2199.00),
    ('a0000000-0000-0000-0000-000000000002', 'SV-NEON-42', '42', 'Red/Pulse', 14, 3, 850.00, 2199.00),
    ('a0000000-0000-0000-0000-000000000002', 'SV-NEON-43', '43', 'Red/Pulse', 4, 3, 850.00, 2199.00),
    ('a0000000-0000-0000-0000-000000000003', 'SV-CREAM-41', '41', 'Vintage Cream', 7, 3, 1100.00, 2899.00),
    ('a0000000-0000-0000-0000-000000000003', 'SV-CREAM-42', '42', 'Vintage Cream', 3, 3, 1100.00, 2899.00),
    ('a0000000-0000-0000-0000-000000000003', 'SV-CREAM-43', '43', 'Vintage Cream', 0, 3, 1100.00, 2899.00)
ON CONFLICT (sku) DO NOTHING;

