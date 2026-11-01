/**
 * Meta (Facebook) & TikTok Pixel Tracking Utilities
 * Dispatches standard e-commerce events for ads attribution
 */

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    ttq?: {
      track: (event: string, params?: Record<string, any>) => void;
      page: () => void;
    };
  }
}

export const PixelEvents = {
  // 1. PageView
  pageView: () => {
    if (typeof window !== 'undefined') {
      if (window.fbq) window.fbq('track', 'PageView');
      if (window.ttq) window.ttq.page();
      console.log('[Pixel] PageView tracked');
    }
  },

  // 2. ViewContent (when a customer views a product page)
  viewContent: (product: { id: string; title: string; price: number; brand: string }) => {
    if (typeof window !== 'undefined') {
      const data = {
        content_name: product.title,
        content_ids: [product.id],
        content_type: 'product',
        value: product.price,
        currency: 'EGP',
      };
      if (window.fbq) window.fbq('track', 'ViewContent', data);
      if (window.ttq) window.ttq.track('ViewContent', data);
      console.log('[Pixel] ViewContent tracked:', data);
    }
  },

  // 3. AddToCart
  addToCart: (product: { id: string; title: string; price: number; size?: string }) => {
    if (typeof window !== 'undefined') {
      const data = {
        content_name: product.title,
        content_ids: [product.id],
        content_type: 'product',
        value: product.price,
        currency: 'EGP',
        size: product.size,
      };
      if (window.fbq) window.fbq('track', 'AddToCart', data);
      if (window.ttq) window.ttq.track('AddToCart', data);
      console.log('[Pixel] AddToCart tracked:', data);
    }
  },

  // 4. InitiateCheckout
  initiateCheckout: (value: number, numItems: number = 1) => {
    if (typeof window !== 'undefined') {
      const data = {
        value,
        currency: 'EGP',
        num_items: numItems,
      };
      if (window.fbq) window.fbq('track', 'InitiateCheckout', data);
      if (window.ttq) window.ttq.track('InitiateCheckout', data);
      console.log('[Pixel] InitiateCheckout tracked:', data);
    }
  },

  // 5. Purchase (High Priority - sent after order completion)
  purchase: (order: {
    orderNumber: string;
    value: number;
    productTitle: string;
    numItems?: number;
  }) => {
    if (typeof window !== 'undefined') {
      const data = {
        content_name: order.productTitle,
        order_id: order.orderNumber,
        value: order.value,
        currency: 'EGP',
        num_items: order.numItems || 1,
      };
      if (window.fbq) window.fbq('track', 'Purchase', data);
      if (window.ttq) window.ttq.track('CompletePayment', data);
      console.log('[Pixel] Purchase tracked:', data);
    }
  },
};
