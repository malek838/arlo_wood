"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, LogOut, Package, Eye, EyeOff, Users, ClipboardList } from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [tab, setTab] = useState<"products" | "users" | "orders">("products");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    nameAr: "",
    price: "",
    descriptionAr: "",
    image: "",
    woodType: "زان",
    category: "furniture",
    dimensions: "",
    customizable: true,
  });

  const ADMIN_SECRET = "Kali@Remote#2026!X7".repeat(4);

  useEffect(() => {
    const u = localStorage.getItem("arlo-user");
    if (!u) {
      router.push("/login");
      return;
    }
    const parsed = JSON.parse(u);
    if (!parsed.isAdmin) {
      router.push("/");
      return;
    }
    setUser(parsed);
    loadData();
  }, [router]);

  const loadData = async () => {
    setLoading(true);
    const { data: prods } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts(prods || []);

    const { data: usrs } = await supabase.from("users").select("id, name, email, phone, address, city, created_at").order("created_at", { ascending: false });
    setUsers(usrs || []);

    const { data: ords } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders(ords || []);
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nameAr || !form.price) return;

    const { error } = await supabase.from("products").insert({
      id: "prod-" + Date.now(),
      name_ar: form.nameAr,
      name: form.nameAr,
      price: Number(form.price),
      description_ar: form.descriptionAr,
      description: form.descriptionAr,
      image: form.image || "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=800&q=80",
      wood_type: form.woodType,
      category: form.category,
      dimensions: form.dimensions || null,
      customizable: form.customizable,
      active: true,
    });

    if (error) {
      alert("خطأ: " + error.message);
      return;
    }
    setForm({ nameAr: "", price: "", descriptionAr: "", image: "", woodType: "زان", category: "furniture", dimensions: "", customizable: true });
    alert("تم إضافة المنتج بنجاح ✓");
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج نهائياً؟")) return;
    await supabase.from("products").delete().eq("id", id);
    loadData();
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from("products").update({ active: !current }).eq("id", id);
    loadData();
  };

  const logout = () => {
    localStorage.removeItem("arlo-user");
    router.push("/");
  };

  if (!user) return <div className="p-20 text-center">جاري التحميل...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#3d2b1f] flex items-center gap-2">
            <Package className="w-8 h-8 text-[#c4a574]" /> لوحة تحكم الأدمن
          </h1>
          <p className="text-gray-500 text-sm mt-1">مرحباً {user.name} — البيانات من قاعدة البيانات</p>
        </div>
        <div className="flex gap-3">
          <Link href="/products" className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50">المتجر</Link>
          <button onClick={logout} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-red-50 text-red-700 text-sm hover:bg-red-100">
            <LogOut className="w-4 h-4" /> خروج
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-8 bg-[#f5e6d3] p-1 rounded-xl w-fit">
        <button onClick={() => setTab("products")} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium ${tab === "products" ? "bg-[#3d2b1f] text-white" : "text-[#5a4030]"}`}>
          <Package className="w-4 h-4" /> المنتجات ({products.length})
        </button>
        <button onClick={() => setTab("users")} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium ${tab === "users" ? "bg-[#3d2b1f] text-white" : "text-[#5a4030]"}`}>
          <Users className="w-4 h-4" /> المستخدمين ({users.length})
        </button>
        <button onClick={() => setTab("orders")} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium ${tab === "orders" ? "bg-[#3d2b1f] text-white" : "text-[#5a4030]"}`}>
          <ClipboardList className="w-4 h-4" /> الطلبات ({orders.length})
        </button>
      </div>

      {loading && <p className="text-center py-10">جاري التحميل من قاعدة البيانات...</p>}

      {tab === "products" && !loading && (
        <>
          <form onSubmit={handleAdd} className="bg-white rounded-2xl shadow border border-[#e8d5b7]/40 p-6 mb-10 space-y-4">
            <h2 className="text-xl font-bold text-[#3d2b1f]">إضافة منتج جديد</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">اسم المنتج *</label>
                <input value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] outline-none focus:ring-2 focus:ring-[#c4a574]" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">السعر *</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] outline-none focus:ring-2 focus:ring-[#c4a574]" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">نوع الخشب</label>
                <select value={form.woodType} onChange={(e) => setForm({ ...form, woodType: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] outline-none">
                  <option>زان</option><option>بلوط</option><option>صنوبر</option><option>ماهوجني</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">التصنيف</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] outline-none">
                  <option value="furniture">أثاث</option>
                  <option value="decor">ديكور</option>
                  <option value="gifts">هدايا</option>
                  <option value="kitchen">مطبخ</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الأبعاد</label>
                <input value={form.dimensions} onChange={(e) => setForm({ ...form, dimensions: e.target.value })} placeholder="120 × 60 × 75 سم" className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">رابط الصورة</label>
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">الوصف</label>
              <textarea value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} rows={2} className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] outline-none" />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.customizable} onChange={(e) => setForm({ ...form, customizable: e.target.checked })} className="w-4 h-4" />
              قابل للتخصيص
            </label>
            <button type="submit" className="flex items-center gap-2 bg-[#3d2b1f] text-[#f5e6d3] font-bold px-6 py-3 rounded-xl hover:bg-[#5a4030] transition">
              <Plus className="w-5 h-5" /> إضافة المنتج
            </button>
          </form>

          <h2 className="text-xl font-bold text-[#3d2b1f] mb-4">المنتجات في قاعدة البيانات</h2>
          {products.length === 0 ? (
            <p className="text-gray-500 text-center py-10 bg-white rounded-xl border">لا توجد منتجات بعد — أضف أول منتج</p>
          ) : (
            <div className="space-y-3">
              {products.map((p) => (
                <div key={p.id} className={`flex items-center justify-between bg-white p-4 rounded-xl border shadow-sm ${!p.active ? "opacity-60 border-red-200" : "border-[#e8d5b7]/40"}`}>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-[#3d2b1f]">{p.name_ar}</p>
                      {!p.active && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">معطل</span>}
                    </div>
                    <p className="text-sm text-gray-500">{p.price} ج.م • {p.wood_type}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toggleActive(p.id, p.active)} className={`p-2 rounded-lg ${!p.active ? "text-green-600 hover:bg-green-50" : "text-orange-600 hover:bg-orange-50"}`} title={!p.active ? "تفعيل" : "تعطيل"}>
                      {!p.active ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="حذف">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === "users" && !loading && (
        <div>
          <h2 className="text-xl font-bold text-[#3d2b1f] mb-4">المستخدمين المسجلين</h2>
          {users.length === 0 ? (
            <p className="text-gray-500 text-center py-10 bg-white rounded-xl border">لا يوجد مستخدمين بعد</p>
          ) : (
            <div className="space-y-3">
              {users.map((u) => (
                <div key={u.id} className="bg-white p-4 rounded-xl border border-[#e8d5b7]/40 shadow-sm">
                  <p className="font-bold text-[#3d2b1f]">{u.name}</p>
                  <p className="text-sm text-gray-600">{u.email}</p>
                  {u.phone && <p className="text-sm text-gray-500">هاتف: {u.phone}</p>}
                  {u.address && <p className="text-sm text-gray-500">عنوان: {u.address}{u.city ? ` - ${u.city}` : ""}</p>}
                  {u.created_at && <p className="text-xs text-gray-400 mt-1">تاريخ التسجيل: {new Date(u.created_at).toLocaleDateString("ar-EG")}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "orders" && !loading && (
        <div>
          <h2 className="text-xl font-bold text-[#3d2b1f] mb-4">سجل الطلبات</h2>
          {orders.length === 0 ? (
            <p className="text-gray-500 text-center py-10 bg-white rounded-xl border">لا توجد طلبات بعد</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white p-5 rounded-xl border border-[#e8d5b7]/40 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-[#3d2b1f]">{order.name}</p>
                      <p className="text-sm text-gray-600">{order.phone}</p>
                      <p className="text-sm text-gray-500">{order.address} - {order.city}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-[#c4a574]">{order.payment_method}</p>
                      <p className="text-xs text-gray-400">{order.created_at ? new Date(order.created_at).toLocaleString("ar-EG") : ""}</p>
                    </div>
                  </div>
                  {order.items && (
                    <div className="border-t pt-3 mt-2">
                      {(Array.isArray(order.items) ? order.items : []).map((item: any, j: number) => (
                        <p key={j} className="text-sm text-gray-700">• {item.name} × {item.quantity} — {item.price} ج.م</p>
                      ))}
                      <p className="font-bold mt-2 text-[#3d2b1f]">الإجمالي: {order.total} ج.م</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
