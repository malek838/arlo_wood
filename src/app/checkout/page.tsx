"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import { paymentMethods } from "@/lib/data";
import { formatPrice, generateWhatsAppLink } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { ArrowRight } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [form, setForm] = useState<{
    name: string;
    phone: string;
    address: string;
    city: string;
    paymentMethod: "vodafone_cash" | "instapay" | "fawry" | "visa" | "other";
    otherPayment: string;
    notes: string;
  }>({
    name: "",
    phone: "",
    address: "",
    city: "",
    paymentMethod: "vodafone_cash",
    otherPayment: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem("arlo-user");
    if (u) {
      try {
        const user = JSON.parse(u);
        if (!user.isAdmin) {
          setIsLoggedIn(true);
          setForm((prev) => ({
            ...prev,
            name: user.name || "",
            phone: user.phone || "",
            address: user.address || "",
            city: user.city || "",
          }));
        }
      } catch {}
    }
  }, []);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">السلة فارغة</h1>
        <Link href="/products" className="text-[#c4a574] underline">العودة للمنتجات</Link>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const paymentLabel =
      form.paymentMethod === "other"
        ? form.otherPayment
        : paymentMethods.find((m) => m.id === form.paymentMethod)?.name || form.paymentMethod;

    const orderItems = items.map((i) => ({
      name: i.product.nameAr,
      quantity: i.quantity,
      price: i.product.price,
    }));

    let userId: string | null = null;
    try {
      const raw = localStorage.getItem("arlo-user");
      if (raw) {
        const uu = JSON.parse(raw);
        if (!uu.isAdmin && uu.id) userId = uu.id;
      }
    } catch {}

    const { error } = await supabase.from("orders").insert({
      user_id: userId,
    try {
      const raw = localStorage.getItem("arlo-user");
      if (raw) {
        const uu = JSON.parse(raw);
        if (!uu.isAdmin && uu.id) userId = uu.id;
      }
    } catch {}

    await supabase.from("orders").insert({
      user_id: userId,
      name: form.name,
      phone: form.phone,
      address: form.address,
      city: form.city,
      payment_method: paymentLabel,
      notes: form.notes || null,
      items: orderItems,
      total: totalPrice(),
      status: "pending",
    });

    if (error) {
      console.error(error);
      alert("حصل خطأ في حفظ الطلب: " + error.message);
      setSubmitting(false);
      return;
    }

    const u = localStorage.getItem("arlo-user");
    if (u) {
      try {
        const user = JSON.parse(u);
        if (!user.isAdmin && user.email) {
          await supabase
            .from("users")
            .update({
              name: form.name,
              phone: form.phone,
              address: form.address,
              city: form.city,
            })
            .eq("email", user.email);

          localStorage.setItem(
            "arlo-user",
            JSON.stringify({ ...user, name: form.name, phone: form.phone, address: form.address, city: form.city })
          );
        }
      } catch {}
    }

    const link = generateWhatsAppLink(items, form);
    clearCart();
    window.open(link, "_blank");
    router.push("/order-success");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/cart" className="inline-flex items-center gap-1 text-[#5a4030] hover:text-[#c4a574] mb-6">
        <ArrowRight className="w-4 h-4" /> العودة للسلة
      </Link>

      <h1 className="text-3xl font-bold text-[#3d2b1f] mb-2">إتمام الطلب</h1>
      {isLoggedIn && (
        <p className="text-green-700 text-sm mb-6 bg-green-50 inline-block px-3 py-1 rounded-full">
          ✓ تم ملء بياناتك تلقائياً لأنك مسجل دخول
        </p>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e8d5b7]/50">
            <h2 className="text-xl font-bold text-[#3d2b1f] mb-4">بيانات العميل</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">الاسم الكامل *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] outline-none focus:ring-2 focus:ring-[#c4a574]" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">رقم الهاتف *</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] outline-none focus:ring-2 focus:ring-[#c4a574]" />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">العنوان بالتفصيل *</label>
                <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] outline-none focus:ring-2 focus:ring-[#c4a574]" />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">المدينة *</label>
                <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] outline-none focus:ring-2 focus:ring-[#c4a574]" />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ملاحظات</label>
                <input type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] outline-none focus:ring-2 focus:ring-[#c4a574]" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e8d5b7]/50">
            <h2 className="text-xl font-bold text-[#3d2b1f] mb-4">طريقة الدفع</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {paymentMethods.map((method) => (
                <label key={method.id}
                  className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${
                    form.paymentMethod === method.id ? "border-[#c4a574] bg-[#f5e6d3]/50" : "border-[#e8d5b7] hover:border-[#c4a574]"
                  }`}>
                  <input type="radio" name="payment" checked={form.paymentMethod === method.id}
                    onChange={() => setForm({ ...form, paymentMethod: method.id as any })} className="w-4 h-4" />
                  <span className="font-medium">{method.name}</span>
                </label>
              ))}
            </div>
            {form.paymentMethod === "other" && (
              <div className="mt-4">
                <input type="text" value={form.otherPayment}
                  onChange={(e) => setForm({ ...form, otherPayment: e.target.value })}
                  placeholder="اكتب طريقة الدفع"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] outline-none" />
                {errors.otherPayment && <p className="text-red-500 text-xs mt-1">{errors.otherPayment}</p>}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e8d5b7]/50 h-fit sticky top-24">
          <h2 className="text-xl font-bold text-[#3d2b1f] mb-4">ملخص الطلب</h2>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between text-sm">
                <span>{item.product.nameAr} × {item.quantity}</span>
                <span>{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 flex justify-between font-bold text-lg text-[#3d2b1f]">
            <span>الإجمالي</span>
            <span>{formatPrice(totalPrice())}</span>
          </div>
          <button type="submit" disabled={submitting}
            className="w-full mt-6 bg-[#3d2b1f] text-[#f5e6d3] font-bold py-3.5 rounded-xl hover:bg-[#5a4030] transition disabled:opacity-60">
            {submitting ? "جاري الحفظ..." : "تأكيد الطلب وإرساله عبر واتساب"}
          </button>
        </div>
      </form>
    </div>
  );
}
