'use client';

import React from 'react';
import { X, Printer, ShieldCheck, QrCode } from 'lucide-react';
import { Order } from '@/types';
import { formatPrice } from '@/lib/utils';

interface ShippingLabelModalProps {
  order: Order | null;
  onClose: () => void;
}

export function ShippingLabelModal({ order, onClose }: ShippingLabelModalProps) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl border border-white/20 bg-surface p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Modal Controls */}
        <div className="flex items-center justify-between border-b border-border/80 pb-4">
          <div className="flex items-center gap-2">
            <Printer className="h-5 w-5 text-accent" />
            <h3 className="font-bold text-foreground">بوليصة الشحن (Air Waybill - AWB)</h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-elevated text-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Printable Label (Standard 10x15cm Aspect) */}
        <div
          id="printable-label"
          className="rounded-2xl border-2 border-dashed border-border bg-white text-black p-6 space-y-4 font-sans text-xs shadow-inner"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-black pb-3">
            <div>
              <span className="text-xl font-black tracking-tighter">
                SOLE<span className="text-lime-600">VAULT</span>
              </span>
              <span className="block text-[10px] text-gray-600">Cairo, Egypt • Official Shipment</span>
            </div>

            <div className="text-left font-mono">
              <span className="text-xs font-bold bg-black text-white px-2 py-0.5 rounded">
                {order.shipping_carrier || 'BOSTA'}
              </span>
              <div className="text-[10px] text-gray-500 mt-1">
                AWB: {order.tracking_number || order.order_number}
              </div>
            </div>
          </div>

          {/* Barcode Simulation */}
          <div className="py-2 text-center bg-gray-50 border border-gray-200 rounded">
            <div className="font-mono text-2xl tracking-[0.3em] font-black">
              ||| | ||||| || |||| |||
            </div>
            <span className="font-mono text-[10px] text-gray-600">{order.order_number}</span>
          </div>

          {/* Recipient Details */}
          <div className="border border-black rounded-lg p-3 space-y-1.5">
            <span className="text-[10px] font-bold uppercase text-gray-500 block">بيانات العميل المستلم:</span>
            <div className="text-sm font-black">{order.customer_name}</div>
            <div className="font-mono font-bold text-sm" dir="ltr">{order.customer_phone}</div>
            <div className="font-bold">{order.governorate} - {order.city}</div>
            <div className="text-gray-700 text-[11px] leading-tight">{order.delivery_address}</div>
          </div>

          {/* Contents and Size */}
          <div className="grid grid-cols-2 gap-2 text-[11px] bg-gray-100 p-2.5 rounded border border-gray-300">
            <div>
              <span className="text-gray-500 block text-[9px]">المحتوى:</span>
              <strong className="truncate block">
                {order.items?.[0]?.product_title || 'كوتشي ستريتوير'}
              </strong>
            </div>
            <div>
              <span className="text-gray-500 block text-[9px]">المقاس:</span>
              <strong className="text-sm font-black">
                مقاس {order.items?.[0]?.size || '42'}
              </strong>
            </div>
          </div>

          {/* Cash On Delivery Collection Box */}
          <div className="border-2 border-black rounded-lg p-3 flex items-center justify-between bg-lime-50">
            <div>
              <span className="text-[10px] font-bold text-gray-600 block">المبلغ المطلوب تحصيله:</span>
              <span className="text-xl font-black text-black">
                {formatPrice(order.total_amount)} ج.م
              </span>
            </div>
            <div className="text-right">
              <span className="rounded bg-black text-white px-2 py-1 text-[10px] font-bold block text-center">
                {order.payment_method === 'COD' ? 'دفع عند الاستلام (COD)' : 'مدفوع إلكترونياً'}
              </span>
              <span className="text-[9px] text-green-700 font-bold block mt-1">
                ✓ مسموح بالمعاينة والقياس
              </span>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center text-[9px] text-gray-500 pt-1">
            في حالة وجود مشكلة يرجى الاتصال بخدمة عملاء SOLEVAULT فورا
          </div>
        </div>

        {/* Action Button */}
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="flex-grow flex items-center justify-center gap-2 rounded-2xl bg-accent py-3.5 text-sm font-black text-background hover:bg-accent-hover transition-all hover:scale-[1.02] active:scale-98 shadow-xl glow-accent"
          >
            <Printer className="h-4 w-4" />
            <span>طباعة البوليصة الآن (Thermal Printer)</span>
          </button>
        </div>

      </div>
    </div>
  );
}
