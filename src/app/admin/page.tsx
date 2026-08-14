"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Product } from "@/types";
import { Plus, Trash2, LogOut, Package, Eye, EyeOff, Users, ClipboardList } from "lucide-react";

interface AdminProduct extends Product {
  active?: boolean;
}

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [tab, setTab] = useState<"products" | "users" | "orders">("products");
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

    const savedProducts = localStorage.getItem("arlo-admin-products");
    if (savedProducts) {
      try { setProducts(JSON.parse(savedProducts)); } catch {}
    }

    const savedUsers = localStorage.getItem("arlo-users");
    if (savedUsers) {
      try { setUsers(JSON.parse(savedUsers)); } catch {}
    }

    const savedOrders = localStorage.getItem("arlo-orders");
    if (savedOrders) {
      try { setOrders(JSON.parse(savedOrders)); } catch {}
    }
  }, [router]);

  const saveProducts = (list: AdminProduct[]) => {
    setProducts(list);
    localStorage.setItem("arlo-admin-products", JSON.stringify(list));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nameAr || !form.price) return;

    const newProduct: AdminProduct = {
      id: "admin-" + Date.now(),
      name: form.nameAr,
      nameAr: form.nameAr,
      price: Number(form.price),
      description: form.descriptionAr,
      descriptionAr: form.descriptionAr,
      image: form.image || "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=800&q=80",
      category: form.category,
      woodType: form.woodType,
      dimensions: form.dimensions || undefined,
      customizable: form.customizable,
      active: true,
    };

    saveProducts([newProduct, ...products]);
    setForm({
      nameAr: "", price: "", descriptionAr: "", image: "",
      woodType: "زان", category: "furniture", dimensions: "", customizable: true,
    });
    alert("تم إضافة المنتج بنجاح ✓");
  };

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المنتج نهائياً؟")) {
      saveProducts(products.filter((p) => p.id !== id));
    }
  };

  const toggleActive = (id: string) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, active: p.active === false ? true : false } : p
    );
    saveProducts(updated);
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
            <Package className="w-8 h-8 text-[#c4a574]" />
            لوحة تحكم الأدمن
          </h1>
          <p className="text-gray-500 text-sm mt-1">مرحباً {user.name}</p>
        </div>
        <div className="flex gap-3">
          <Link href="/products" className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50">المتجر</Link>
          <button onClick={logout} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-red-50 text-red-700 text-sm hover:bg-red-100">
            <LogOut className="w-4 h-4" /> خروج
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-[#f5e6d3] p-1 rounded-xl w-fit">
        <button
          onClick={() => setTab("products")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition ${
            tab === "products" ? "bg-[#3d2b1f] text-white" : "text-[#5a4030]"
          }`}
        >
          <Package className="w-4 h-4" /> المنتجات
        </button>
        <button
          onClick={() => setTab("users")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition ${
            tab === "users" ? "bg-[#3d2b1f] text-white" : "text-[#5a4030]"
          }`}
        >
          <Users className="w-4 h-4" /> المستخدمين ({users.length})
        </button>
        <button
          onClick={() => setTab("orders")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition ${
            tab === "orders" ? "bg-[#3d2b1f] text-white" : "text-[#5a4030]"
          }`}
        >
          <ClipboardList className="w-4 h-4" /> الطلبات ({orders.length})
        </button>
      </div>

      {/* ========== PRODUCTS TAB ========== */}
      {tab === "products" && (
        <>
          <form onSubmit={handleAdd} className="bg-white rounded-2xl shadow border border-[#e8d5b7]/40 p-6 mb-10 space-y-4">
            <h2 className="text-xl font-bold text-[#3d2b1f]">إضافة منتج جديد</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">اسم المنتج *</label>
                <input value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] outline-none focus:ring-2 focus:ring-[#c4a574]" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">السعر *</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] outline-none focus:ring-2 focus:ring-[#c4a574]" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">نوع الخشب</label>
                <select value={form.woodType} onChange={(e) => setForm({ ...form, woodType: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] outline-none">
                  <option>زان</option><option>بلوط</option><option>صنوبر</option><option>ماهوجني</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">التصنيف</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] outline-none">
                  <option value="furniture">أثاث</option>
                  <option value="decor">ديكور</option>
                  <option value="gifts">هدايا</option>
                  <option value="kitchen">مطبخ</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الأبعاد</label>
                <input value={form.dimensions} onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
                  placeholder="120 × 60 × 75 سم" className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">رابط الصورة</label>
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://..." className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">الوصف</label>
              <textarea value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
                rows={2} className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] outline-none" />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.customizable}
                onChange={(e) => setForm({ ...form, customizable: e.target.checked })} className="w-4 h-4" />
              قابل للتخصيص
            </label>
            <button type="submit" className="flex items-center gap-2 bg-[#3d2b1f] text-[#f5e6d3] font-bold px-6 py-3 rounded-xl hover:bg-[#5a4030] transition">
              <Plus className="w-5 h-5" /> إضافة المنتج
            </button>
          </form>

          <h2 className="text-xl font-bold text-[#3d2b1f] mb-4">المنتجات ({products.length})</h2>
          {products.length === 0 ? (
            <p className="text-gray-500 text-center py-10 bg-white rounded-xl border">لا توجد منتجات مضافة</p>
          ) : (
            <div className="space-y-3">
              {products.map((p) => (
                <div key={p.id} className={`flex items-center justify-between bg-white p-4 rounded-xl border shadow-sm ${
                  p.active === false ? "opacity-60 border-red-200" : "border-[#e8d5b7]/40"
                }`}>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-[#3d2b1f]">{p.nameAr}</p>
                      {p.active === false && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">معطل</span>}
                    </div>
                    <p className="text-sm text-gray-500">{p.price} ج.م • {p.woodType}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toggleActive(p.id)}
                      className={`p-2 rounded-lg ${p.active === false ? "text-green-600 hover:bg-green-50" : "text-orange-600 hover:bg-orange-50"}`}
                      title={p.active === false ? "تفعيل" : "تعطيل"}>
                      {p.active === false ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
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

      {/* ========== USERS TAB ========== */}
      {tab === "users" && (
        <div>
          <h2 className="text-xl font-bold text-[#3d2b1f] mb-4">المستخدمين المسجلين ({users.length})</h2>
          {users.length === 0 ? (
            <p className="text-gray-500 text-center py-10 bg-white rounded-xl border">لا يوجد مستخدمين بعد</p>
          ) : (
            <div className="space-y-3">
              {users.map((u, i) => (
                <div key={u.id || i} className="bg-white p-4 rounded-xl border border-[#e8d5b7]/40 shadow-sm">
                  <p className="font-bold text-[#3d2b1f]">{u.name}</p>
                  <p className="text-sm text-gray-600">{u.email}</p>
                  {u.phone && <p className="text-sm text-gray-500">هاتف: {u.phone}</p>}
                  {u.address && <p className="text-sm text-gray-500">عنوان: {u.address}{u.city ? ` - ${u.city}` : ""}</p>}
                  {u.createdAt && (
                    <p className="text-xs text-gray-400 mt-1">
                      تاريخ التسجيل: {new Date(u.createdAt).toLocaleDateString("ar-EG")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========== ORDERS TAB ========== */}
      {tab === "orders" && (
        <div>
          <h2 className="text-xl font-bold text-[#3d2b1f] mb-4">سجل الطلبات ({orders.length})</h2>
          {orders.length === 0 ? (
            <p className="text-gray-500 text-center py-10 bg-white rounded-xl border">
              لا توجد طلبات محفوظة بعد<br/>
              <span className="text-xs">(الطلبات بتتحفظ لما العميل يؤكد الطلب من صفحة الـ Checkout)</span>
            </p>
          ) : (
            <div className="space-y-4">
              {orders.map((order, i) => (
                <div key={i} className="bg-white p-5 rounded-xl border border-[#e8d5b7]/40 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-[#3d2b1f]">{order.name}</p>
                      <p className="text-sm text-gray-600">{order.phone}</p>
                      <p className="text-sm text-gray-500">{order.address} - {order.city}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-[#c4a574]">{order.paymentMethod}</p>
                      <p className="text-xs text-gray-400">
                        {order.date ? new Date(order.date).toLocaleString("ar-EG") : ""}
                      </p>
                    </div>
                  </div>
                  {order.items && (
                    <div className="border-t pt-3 mt-2">
                      {order.items.map((item: any, j: number) => (
                        <p key={j} className="text-sm text-gray-700">
                          • {item.name} × {item.quantity} — {item.price} ج.م
                        </p>
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
