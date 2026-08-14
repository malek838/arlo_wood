"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Search, Package, CheckCircle, Truck, Clock, XCircle, ArrowRight } from "lucide-react";

const statusMap: Record<string, { text: string; color: string; icon: any; desc: string }> = {
  pending: {
    text: "طلب جديد",
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
    icon: Clock,
    desc: "استلمنا طلبك وجاري مراجعته",
  },
  confirmed: {
    text: "تم التأكيد / قيد التجهيز",
    color: "bg-blue-100 text-blue-800 border-blue-300",
    icon: CheckCircle,
    desc: "تم تأكيد الطلب وبدأنا التجهيز",
  },
  shipped: {
    text: "تم الشحن",
    color: "bg-green-100 text-green-800 border-green-300",
    icon: Truck,
    desc: "الطلب في الطريق إليك",
  },
  cancelled: {
    text: "ملغي",
    color: "bg-red-100 text-red-800 border-red-300",
    icon: XCircle,
    desc: "تم إلغاء هذا الطلب",
  },
};

export default function TrackOrderPage() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSearched(false);
    const cleaned = phone.replace(/\s/g, "");
    if (cleaned.length < 10) {
      setError("اكتب رقم هاتف صحيح (10 أرقام على الأقل)");
      return;
    }
    setLoading(true);

    let result: any[] = [];
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("phone", cleaned)
      .order("created_at", { ascending: false });

    result = data || [];

    if (result.length === 0) {
      const { data: data2 } = await supabase
        .from("orders")
        .select("*")
        .ilike("phone", `%${cleaned.slice(-10)}%`)
        .order("created_at", { ascending: false });
      result = data2 || [];
    }

    setOrders(result);
    setSearched(true);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-[#5a4030] mb-6 text-sm hover:text-[#c4a574]"
      >
        <ArrowRight className="w-4 h-4" /> الرئيسية
      </Link>

      <div className="text-center mb-8">
        <Package className="w-12 h-12 text-[#c4a574] mx-auto mb-3" />
        <h1 className="text-3xl font-bold text-[#3d2b1f]">تتبع طلبك</h1>
        <p className="text-gray-600 mt-2">
          اكتب رقم الهاتف اللي سجّلت بيه الطلب
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        className="bg-white rounded-2xl border border-[#e8d5b7]/50 p-6 shadow-sm mb-8"
      >
        <label className="block text-sm font-medium mb-2 text-[#3d2b1f]">
          رقم الهاتف
        </label>
        <div className="flex gap-2">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="01xxxxxxxxx"
            className="flex-1 px-4 py-3 rounded-xl border border-[#e8d5b7] outline-none focus:ring-2 focus:ring-[#c4a574]"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-[#3d2b1f] text-[#f5e6d3] font-bold px-5 py-3 rounded-xl hover:bg-[#5a4030] disabled:opacity-60"
          >
            <Search className="w-5 h-5" />
            {loading ? "..." : "بحث"}
          </button>
        </div>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </form>

      {searched && orders.length === 0 && (
        <p className="text-center text-gray-500 py-10 bg-white rounded-2xl border">
          مفيش طلبات على الرقم ده
        </p>
      )}

      <div className="space-y-4">
        {orders.map((order) => {
          const st = statusMap[order.status || "pending"] || statusMap.pending;
          const Icon = st.icon;
          return (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-[#e8d5b7]/50 p-5 shadow-sm"
            >
              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium mb-3 ${st.color}`}
              >
                <Icon className="w-4 h-4" />
                {st.text}
              </div>
              <p className="text-sm text-gray-600 mb-1">{st.desc}</p>
              <p className="text-xs text-gray-400 mb-3">
                {order.created_at
                  ? new Date(order.created_at).toLocaleString("ar-EG")
                  : ""}
                {order.order_type === "custom" ? " • طلب مخصص" : ""}
              </p>
              {order.items && (
                <div className="border-t pt-3 text-sm text-gray-700">
                  {(Array.isArray(order.items) ? order.items : []).map(
                    (item: any, j: number) => (
                      <p key={j}>
                        • {item.name} × {item.quantity}
                        {item.price ? ` — ${item.price} ج.م` : ""}
                      </p>
                    )
                  )}
                  {order.total != null && (
                    <p className="font-bold text-[#3d2b1f] mt-2">
                      الإجمالي: {order.total} ج.م
                    </p>
                  )}
                </div>
              )}
              {order.notes && (
                <p className="text-sm text-gray-500 mt-2">
                  ملاحظات: {order.notes}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-center text-sm text-gray-500 mt-8">
        مسجل دخول؟{" "}
        <Link href="/my-orders" className="text-[#c4a574] hover:underline">
          شوف كل طلباتك من هنا
        </Link>
      </p>
    </div>
  );
}
