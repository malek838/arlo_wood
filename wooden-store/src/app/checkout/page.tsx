"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import { paymentMethods } from "@/lib/data";
import { formatPrice, generateWhatsAppLink } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    paymentMethod: "vodafone_cash" as const,
    otherPayment: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">السلة فارغة</h1>
        <Link href="/products" className="text-[#c4a574] underline">
          العودة للمنتجات
        </Link>
      </div>
    );
  }

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "الاسم مطلوب";
    if (!form.phone.trim() || form.phone.length < 10) e.phone = "رقم هاتف صحيح مطلوب";
    if (!form.address.trim()) e.address = "العنوان مطلوب";
    if (!form.city.trim()) e.city = "المدينة مطلوبة";
    if (form.paymentMethod === "other" && !form.otherPayment.trim()) {
      e.otherPayment = "يرجى كتابة طريقة الدفع";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const link = generateWhatsAppLink(items, form);
    clearCart();
    window.open(link, "_blank");
    router.push("/order-success");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/cart"
        className="inline-flex items-center gap-1 text-[#5a4030] hover:text-[#c4a574] mb-6"
      >
        <ArrowRight className="w-4 h-4" />
        العودة للسلة
      </Link>

      <h1 className="text-3xl font-bold text-[#3d2b1f] mb-8">إتمام الطلب</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e8d5b7]/50">
            <h2 className="text-xl font-bold text-[#3d2b1f] mb-4">بيانات العميل</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">الاسم الكامل *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] focus:outline-none focus:ring-2 focus:ring-[#c4a574]"
                  placeholder="مثال: أحمد محمد"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">رقم الهاتف *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] focus:outline-none focus:ring-2 focus:ring-[#c4a574]"
                  placeholder="01xxxxxxxxx"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">العنوان بالتفصيل *</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] focus:outline-none focus:ring-2 focus:ring-[#c4a574]"
                  placeholder="الشارع، رقم العقار، الدور..."
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">المدينة / المحافظة *</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] focus:outline-none focus:ring-2 focus:ring-[#c4a574]"
                  placeholder="القاهرة، الجيزة..."
                />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ملاحظات (اختياري)</label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] focus:outline-none focus:ring-2 focus:ring-[#c4a574]"
                  placeholder="أي ملاحظات إضافية"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e8d5b7]/50">
            <h2 className="text-xl font-bold text-[#3d2b1f] mb-4">طريقة الدفع</h2>
            <p className="text-sm text-gray-600 mb-4">
              اختر طريقة الدفع المفضلة. سيتم تأكيد الطلب ورسوم الشحن عبر الواتساب.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${
                    form.paymentMethod === method.id
                      ? "border-[#c4a574] bg-[#f5e6d3]/50"
                      : "border-[#e8d5b7] hover:border-[#c4a574]/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={form.paymentMethod === method.id}
                    onChange={() =>
                      setForm({
                        ...form,
                        paymentMethod: method.id as typeof form.paymentMethod,
                      })
                    }
                    className="accent-[#5a4030]"
                  />
                  <span className="text-xl">{method.icon}</span>
                  <span className="font-medium">{method.name}</span>
                </label>
              ))}
            </div>
            {form.paymentMethod === "other" && (
              <div className="mt-4">
                <input
                  type="text"
                  value={form.otherPayment}
                  onChange={(e) => setForm({ ...form, otherPayment: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] focus:outline-none focus:ring-2 focus:ring-[#c4a574]"
                  placeholder="اكتب طريقة الدفع..."
                />
                {errors.otherPayment && (
                  <p className="text-red-500 text-xs mt-1">{errors.otherPayment}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e8d5b7]/50 h-fit sticky top-24">
          <h2 className="text-xl font-bold text-[#3d2b1f] mb-4">ملخص الطلب</h2>
          <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between text-sm">
                <span>
                  {item.product.nameAr} × {item.quantity}
                </span>
                <span>{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 flex justify-between font-bold text-lg">
            <span>الإجمالي</span>
            <span className="text-[#5a4030]">{formatPrice(totalPrice())}</span>
          </div>
          <p className="text-xs text-gray-500 mt-2 mb-6">
            * رسوم الشحن هتتحدد بعد ما تبعت الطلب على الواتساب
          </p>
          <button
            type="submit"
            className="w-full bg-[#25D366] text-white font-bold py-3.5 rounded-full hover:bg-[#20bd5a] transition flex items-center justify-center gap-2"
          >
            تأكيد الطلب وإرساله عبر الواتساب
          </button>
          <p className="text-xs text-center text-gray-500 mt-3">
            هيتم فتح واتساب برسالة جاهزة لرقم 01551277017
          </p>
        </div>
      </form>
    </div>
  );
}
