"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { woodTypes, paymentMethods } from "@/lib/data";
import { generateWhatsAppLink } from "@/lib/utils";
import { TreePine } from "lucide-react";

export default function CustomOrderPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    productName: "",
    woodType: "زان",
    length: "",
    width: "",
    height: "",
    quantity: 1,
    notes: "",
    name: "",
    phone: "",
    address: "",
    city: "",
    paymentMethod: "vodafone_cash" as const,
    otherPayment: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.productName.trim()) e.productName = "اسم المنتج مطلوب";
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

    const customDetails = `
• اسم المنتج: ${form.productName}
• نوع الخشب: ${form.woodType}
• الأبعاد: ${form.length || "-"} × ${form.width || "-"} × ${form.height || "-"} سم
• الكمية: ${form.quantity}
• ملاحظات التخصيص: ${form.notes || "لا يوجد"}
    `.trim();

    const link = generateWhatsAppLink(
      [],
      {
        name: form.name,
        phone: form.phone,
        address: form.address,
        city: form.city,
        paymentMethod: form.paymentMethod,
        otherPayment: form.otherPayment,
        notes: form.notes,
      },
      true,
      customDetails
    );

    window.open(link, "_blank");
    router.push("/order-success");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-10">
        <TreePine className="w-12 h-12 text-[#c4a574] mx-auto mb-3" />
        <h1 className="text-3xl font-bold text-[#3d2b1f] mb-2">طلب منتج خشبي مخصص</h1>
        <p className="text-gray-600">
          اكتب تفاصيل المنتج اللي تبيه، وهنتواصل معاك عبر الواتساب لتحديد السعر ورسوم الشحن.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#e8d5b7]/50 space-y-6">
        {/* Product Details */}
        <div>
          <h2 className="text-lg font-bold text-[#3d2b1f] mb-4">تفاصيل المنتج</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">اسم / وصف المنتج *</label>
              <input
                type="text"
                value={form.productName}
                onChange={(e) => setForm({ ...form, productName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] focus:outline-none focus:ring-2 focus:ring-[#c4a574]"
                placeholder="مثال: طاولة جانبية، رف كتب، صندوق مجوهرات..."
              />
              {errors.productName && <p className="text-red-500 text-xs mt-1">{errors.productName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">نوع الخشب</label>
              <select
                value={form.woodType}
                onChange={(e) => setForm({ ...form, woodType: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] focus:outline-none focus:ring-2 focus:ring-[#c4a574] bg-white"
              >
                {woodTypes.map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">الطول (سم)</label>
                <input
                  type="number"
                  value={form.length}
                  onChange={(e) => setForm({ ...form, length: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] focus:outline-none focus:ring-2 focus:ring-[#c4a574]"
                  placeholder="--"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">العرض (سم)</label>
                <input
                  type="number"
                  value={form.width}
                  onChange={(e) => setForm({ ...form, width: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] focus:outline-none focus:ring-2 focus:ring-[#c4a574]"
                  placeholder="--"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الارتفاع (سم)</label>
                <input
                  type="number"
                  value={form.height}
                  onChange={(e) => setForm({ ...form, height: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] focus:outline-none focus:ring-2 focus:ring-[#c4a574]"
                  placeholder="--"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">الكمية</label>
              <input
                type="number"
                min={1}
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] focus:outline-none focus:ring-2 focus:ring-[#c4a574]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">ملاحظات التخصيص</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] focus:outline-none focus:ring-2 focus:ring-[#c4a574]"
                placeholder="نقش اسم، لون معين، تفاصيل إضافية..."
              />
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div>
          <h2 className="text-lg font-bold text-[#3d2b1f] mb-4">بياناتك</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">الاسم *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] focus:outline-none focus:ring-2 focus:ring-[#c4a574]"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">الهاتف *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] focus:outline-none focus:ring-2 focus:ring-[#c4a574]"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">العنوان *</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] focus:outline-none focus:ring-2 focus:ring-[#c4a574]"
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">المدينة *</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] focus:outline-none focus:ring-2 focus:ring-[#c4a574]"
              />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>
          </div>
        </div>

        {/* Payment */}
        <div>
          <h2 className="text-lg font-bold text-[#3d2b1f] mb-4">طريقة الدفع</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {paymentMethods.map((method) => (
              <label
                key={method.id}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${
                  form.paymentMethod === method.id
                    ? "border-[#c4a574] bg-[#f5e6d3]/50"
                    : "border-[#e8d5b7]"
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
                <span>{method.icon}</span>
                <span className="text-sm font-medium">{method.name}</span>
              </label>
            ))}
          </div>
          {form.paymentMethod === "other" && (
            <input
              type="text"
              value={form.otherPayment}
              onChange={(e) => setForm({ ...form, otherPayment: e.target.value })}
              className="w-full mt-3 px-4 py-2.5 rounded-xl border border-[#e8d5b7] focus:outline-none focus:ring-2 focus:ring-[#c4a574]"
              placeholder="اكتب طريقة الدفع..."
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-[#25D366] text-white font-bold py-3.5 rounded-full hover:bg-[#20bd5a] transition"
        >
          إرسال الطلب عبر الواتساب
        </button>
        <p className="text-xs text-center text-gray-500">
          هيتم فتح واتساب برسالة جاهزة، وهنرد عليك برسوم الشحن وتأكيد الطلب
        </p>
      </form>
    </div>
  );
}
