"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  Package, Clock, CheckCircle, Truck, XCircle, ArrowRight, LogIn
} from "lucide-react";

const statusMap: Record<string, { text: string; color: string; icon: any; desc: string }> = {
  pending: { text: "طلب جديد", color: "bg-yellow-100 text-yellow-800", icon: Clock, desc: "استلمنا طلبك وجاري مراجعته" },
  confirmed: { text: "تم التأكيد / قيد التجهيز", color: "bg-blue-100 text-blue-800", icon: CheckCircle, desc: "تم التأكيد وبدأنا التجهيز" },
  shipped: { text: "تم الشحن", color: "bg-green-100 text-green-800", icon: Truck, desc: "الطلب في الطريق إليك" },
  cancelled: { text: "ملغي", color: "bg-red-100 text-red-800", icon: XCircle, desc: "تم إلغاء هذا الطلب" },
};

export default function MyOrdersPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = localStorage.getItem("arlo-user");
    if (!u) {
      setLoading(false);
      return;
    }
    const parsed = JSON.parse(u);
    if (parsed.isAdmin) {
      router.push("/admin");
      return;
    }
    setUser(parsed);
    loadOrders(parsed);
  }, [router]);

  const loadOrders = async (u: any) => {
    setLoading(true);
    let result: any[] = [];

    // بالهاتف أولاً
    if (u.phone) {
      const phone = String(u.phone).replace(/\s/g, "");
      const { data } = await supabase
        .from("orders")
        .select("*")
        .or(`phone.eq.\( {phone},phone.ilike.% \){phone.slice(-10)}%`)
        .order("created_at", { ascending: false });
      result = data || [];
    }

    // لو مفيش، بالاسم + الإيميل مش مربوط مباشرة — نجرب user_id
    if (result.length === 0 && u.id) {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", u.id)
        .order("created_at", { ascending: false });
      result = data || [];
    }

    setOrders(result);
    setLoading(false);
  };

  if (!loading && !user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <LogIn className="w-12 h-12 text-[#c4a574] mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-[#3d2b1f] mb-2">سجل دخولك أولاً</h1>
        <p className="text-gray-600 mb-6">عشان تشوف طلباتك وحالاتها</p>
        <Link href="/login" className="inline-block bg-[#3d2b1f] text-white font-bold px-6 py-3 rounded-full">
          تسجيل الدخول
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link href="/" className="inline-flex items-center gap-1 text-[#5a4030] mb-6 text-sm hover:text-[#c4a574]">
        <ArrowRight className="w-4 h-4" /> الرئيسية
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <Package className="w-8 h-8 text-[#c4a574]" />
        <div>
          <h1 className="text-2xl font-bold text-[#3d2b1f]">طلباتي</h1>
          {user && <p className="text-sm text-gray-500">مرحباً {user.name}</p>}
        </div>
      </div>

      {loading ? (
        <p className="text-center py-10 text-gray-500">جاري التحميل...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-14 bg-white rounded-2xl border">
          <p className="text-gray-500 mb-4">لا توجد طلبات بعد</p>
          <Link href="/products" className="text-[#c4a574] font-medium hover:underline">تصفح المنتجات</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const st = statusMap[order.status || "pending"] || statusMap.pending;
            const Icon = st.icon;
            return (
              <div key={order.id} className="bg-white rounded-2xl border border-[#e8d5b7]/50 p-5 shadow-sm">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-2 ${st.color}`}>
                  <Icon className="w-4 h-4" />
                  {st.text}
                </div>
                <p className="text-sm text-gray-600 mb-1">{st.desc}</p>
                <p className="text-xs text-gray-400 mb-3">
                  {order.created_at ? new Date(order.created_at).toLocaleString("ar-EG") : ""}
                  {order.order_type === "custom" ? " • طلب مخصص" : ""}
                </p>
                {order.items && (
                  <div className="border-t pt-3 text-sm text-gray-700">
                    {(Array.isArray(order.items) ? order.items : []).map((item: any, j: number) => (
                      <p key={j}>• {item.name} × {item.quantity}</p>
                    ))}
                    {order.total != null && (
                      <p className="font-bold text-[#3d2b1f] mt-2">الإجمالي: {order.total} ج.م</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
