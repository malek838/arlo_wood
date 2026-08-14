"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-[#c4a574] mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-[#3d2b1f] mb-2">السلة فارغة</h1>
        <p className="text-gray-600 mb-6">لم تضف أي منتجات بعد</p>
        <Link
          href="/products"
          className="inline-block bg-[#3d2b1f] text-[#f5e6d3] font-bold px-6 py-3 rounded-full hover:bg-[#5a4030] transition"
        >
          تصفح المنتجات
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#3d2b1f]">سلة المشتريات</h1>
        <button
          onClick={clearCart}
          className="text-red-600 text-sm hover:underline"
        >
          تفريغ السلة
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="flex gap-4 bg-white p-4 rounded-2xl shadow-sm border border-[#e8d5b7]/50"
            >
              <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-[#f5e6d3] shrink-0">
                <Image
                  src={item.product.image}
                  alt={item.product.nameAr}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[#3d2b1f] truncate">
                  {item.product.nameAr}
                </h3>
                <p className="text-sm text-gray-500">{item.product.woodType}</p>
                <p className="font-semibold text-[#5a4030] mt-1">
                  {formatPrice(item.product.price)}
                </p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2 bg-[#f5e6d3] rounded-full px-2 py-1">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="p-1 hover:bg-[#e8d5b7] rounded-full"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-6 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="p-1 hover:bg-[#e8d5b7] rounded-full"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e8d5b7]/50 h-fit sticky top-24">
          <h2 className="text-xl font-bold text-[#3d2b1f] mb-4">ملخص الطلب</h2>
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between">
              <span>عدد المنتجات</span>
              <span>{items.reduce((s, i) => s + i.quantity, 0)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>الإجمالي</span>
              <span className="text-[#5a4030]">{formatPrice(totalPrice())}</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            * رسوم الشحن سيتم تحديدها بعد تأكيد الطلب عبر الواتساب
          </p>
          <Link
            href="/checkout"
            className="block w-full text-center bg-[#3d2b1f] text-[#f5e6d3] font-bold py-3 rounded-full hover:bg-[#5a4030] transition"
          >
            إتمام الطلب
          </Link>
        </div>
      </div>
    </div>
  );
}
