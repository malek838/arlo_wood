"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  Plus, Trash2, LogOut, Package, Eye, EyeOff, Users, ClipboardList,
  CheckCircle, Truck, XCircle, Star, Pencil, X, Upload
} from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [tab, setTab] = useState<"products" | "users" | "orders">("products");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    nameAr: "", price: "", descriptionAr: "", image: "",
    woodType: "زان", category: "furniture", dimensions: "", customizable: true,
  });

  useEffect(() => {
    const u = localStorage.getItem("arlo-user");
    if (!u) { router.push("/login"); return; }
    const parsed = JSON.parse(u);
    if (!parsed.isAdmin) { router.push("/"); return; }
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

  const resetForm = () => {
    setForm({
      nameAr: "", price: "", descriptionAr: "", image: "",
      woodType: "زان", category: "furniture", dimensions: "", customizable: true,
    });
    setEditingId(null);
  };

  const startEdit = (p: any) => {
    setEditingId(p.id);
    setForm({
      nameAr: p.name_ar || "",
      price: String(p.price ?? ""),
      descriptionAr: p.description_ar || "",
      image: p.image || "",
      woodType: p.wood_type || "زان",
      category: p.category || "furniture",
      dimensions: p.dimensions || "",
      customizable: p.customizable ?? true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const fileName = `\( {Date.now()}- \){Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("products").upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) {
        alert("فشل رفع الصورة: " + error.message);
        return null;
      }
      const { data } = supabase.storage.from("products").getPublicUrl(fileName);
      return data.publicUrl;
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("اختار ملف صورة فقط");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("حجم الصورة كبير (الحد 5 ميجا)");
      return;
    }
    const url = await uploadImage(file);
    if (url) setForm((f) => ({ ...f, image: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nameAr || !form.price) return;

    const payload = {
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
    };

    if (editingId) {
      const { error } = await supabase.from("products").update(payload).eq("id", editingId);
      if (error) { alert("خطأ في التعديل: " + error.message); return; }
      alert("تم تعديل المنتج ✓");
    } else {
      const { error } = await supabase.from("products").insert({
        id: "prod-" + Date.now(),
        ...payload,
        active: true,
        featured: false,
      });
      if (error) { alert("خطأ في الإضافة: " + error.message); return; }
      alert("تم إضافة المنتج ✓");
    }

    resetForm();
    loadData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("حذف المنتج نهائياً؟")) return;
    await supabase.from("products").delete().eq("id", id);
    if (editingId === id) resetForm();
    loadData();
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from("products").update({ active: !current }).eq("id", id);
    loadData();
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    const { error } = await supabase.from("products").update({ featured: !current }).eq("id", id);
    if (error) {
      alert("خطأ: " + error.message + "\nنفّذ: ALTER TABLE products ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;");
      return;
    }
    loadData();
  };

  const updateOrderStatus = async (id: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", id);
    loadData();
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("حذف الطلب؟")) return;
    await supabase.from("orders").delete().eq("id", id);
    loadData();
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case "pending": return { text: "جديد", color: "bg-yellow-100 text-yellow-800" };
      case "confirmed": return { text: "مؤكد", color: "bg-blue-100 text-blue-800" };
      case "shipped": return { text: "تم الشحن", color: "bg-green-100 text-green-800" };
      case "cancelled": return { text: "ملغي", color: "bg-red-100 text-red-800" };
      default: return { text: "جديد", color: "bg-gray-100 text-gray-800" };
    }
  };

  const logout = () => {
    localStorage.removeItem("arlo-user");
    router.push("/");
  };

  if (!user) return <div className="p-20 text-center">جاري التحميل...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <h1 className="text-3xl font-bold text-[#3d2b1f] flex items-center gap-2">
          <Package className="w-8 h-8 text-[#c4a574]" /> لوحة الأدمن
        </h1>
        <div className="flex gap-2">
          <Link href="/" className="px-4 py-2 rounded-lg border text-sm">الرئيسية</Link>
          <Link href="/products" className="px-4 py-2 rounded-lg border text-sm">المتجر</Link>
          <button onClick={logout} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-red-50 text-red-700 text-sm">
            <LogOut className="w-4 h-4" /> خروج
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-8 bg-[#f5e6d3] p-1 rounded-xl w-fit flex-wrap">
        <button onClick={() => setTab("products")} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === "products" ? "bg-[#3d2b1f] text-white" : ""}`}>
          المنتجات ({products.length})
        </button>
        <button onClick={() => setTab("users")} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === "users" ? "bg-[#3d2b1f] text-white" : ""}`}>
          المستخدمين ({users.length})
        </button>
        <button onClick={() => setTab("orders")} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === "orders" ? "bg-[#3d2b1f] text-white" : ""}`}>
          الطلبات ({orders.length})
        </button>
      </div>

      {loading && <p className="text-center py-10">جاري التحميل...</p>}

      {tab === "products" && !loading && (
        <>
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border p-6 mb-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#3d2b1f]">
                {editingId ? "تعديل المنتج" : "إضافة منتج جديد"}
              </h2>
              {editingId && (
                <button type="button" onClick={resetForm} className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600">
                  <X className="w-4 h-4" /> إلغاء التعديل
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input placeholder="اسم المنتج *" value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} className="px-4 py-2.5 rounded-xl border" required />
              <input type="number" placeholder="السعر *" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="px-4 py-2.5 rounded-xl border" required />
              <select value={form.woodType} onChange={(e) => setForm({ ...form, woodType: e.target.value })} className="px-4 py-2.5 rounded-xl border">
                <option>زان</option><option>بلوط</option><option>صنوبر</option><option>ماهوجني</option>
              </select>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="px-4 py-2.5 rounded-xl border">
                <option value="furniture">أثاث</option>
                <option value="decor">ديكور</option>
                <option value="gifts">هدايا</option>
                <option value="kitchen">مطبخ</option>
              </select>
              <input placeholder="الأبعاد" value={form.dimensions} onChange={(e) => setForm({ ...form, dimensions: e.target.value })} className="px-4 py-2.5 rounded-xl border" />
              <input placeholder="رابط صورة (اختياري لو هترفع ملف)" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="px-4 py-2.5 rounded-xl border" />
            </div>

            {/* رفع صورة من الجهاز */}
            <div className="border border-dashed border-[#c4a574] rounded-xl p-4 bg-[#faf6f1]">
              <label className="flex flex-col sm:flex-row items-start sm:items-center gap-3 cursor-pointer">
                <span className="flex items-center gap-2 bg-[#3d2b1f] text-white text-sm font-medium px-4 py-2 rounded-lg">
                  <Upload className="w-4 h-4" />
                  {uploading ? "جاري الرفع..." : "رفع صورة من الجهاز"}
                </span>
                <input type="file" accept="image/*" onChange={handleImageChange} disabled={uploading} className="text-sm" />
              </label>
              {form.image && (
                <div className="mt-3 flex items-center gap-3">
                  <img src={form.image} alt="معاينة" className="h-20 w-20 object-cover rounded-lg border" />
                  <p className="text-xs text-gray-500 break-all max-w-md">{form.image}</p>
                </div>
              )}
            </div>

            <textarea placeholder="الوصف" value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} rows={2} className="w-full px-4 py-2.5 rounded-xl border" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.customizable} onChange={(e) => setForm({ ...form, customizable: e.target.checked })} className="w-4 h-4" />
              قابل للتخصيص
            </label>
            <button type="submit" disabled={uploading} className="flex items-center gap-2 bg-[#3d2b1f] text-white font-bold px-6 py-3 rounded-xl disabled:opacity-60">
              {editingId ? (<><Pencil className="w-5 h-5" /> حفظ التعديلات</>) : (<><Plus className="w-5 h-5" /> إضافة المنتج</>)}
            </button>
          </form>

          <h2 className="text-xl font-bold mb-4">كل المنتجات</h2>
          {products.length === 0 ? (
            <p className="text-center py-10 bg-white rounded-xl border">لا توجد منتجات</p>
          ) : (
            <div className="space-y-3">
              {products.map((p) => (
                <div key={p.id} className={`flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border ${!p.active ? "opacity-50" : ""} ${editingId === p.id ? "ring-2 ring-[#c4a574]" : ""}`}>
                  <div className="flex items-center gap-3">
                    {p.image && <img src={p.image} alt="" className="w-14 h-14 object-cover rounded-lg border" />}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold">{p.name_ar}</p>
                        {p.featured && <span className="text-xs bg-yellow-200 text-yellow-900 px-2 py-0.5 rounded-full">★ رئيسية</span>}
                        {!p.active && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">معطل</span>}
                      </div>
                      <p className="text-sm text-gray-500">{p.price} ج.م • {p.wood_type}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button type="button" onClick={() => startEdit(p)} className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      <Pencil className="w-4 h-4" /> تعديل
                    </button>
                    <button type="button" onClick={() => toggleFeatured(p.id, !!p.featured)} className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-bold border ${p.featured ? "bg-yellow-400 text-yellow-900 border-yellow-500" : "bg-white text-gray-700 border-gray-300"}`}>
                      <Star className="w-4 h-4" />
                      {p.featured ? "في الرئيسية" : "للرئيسية"}
                    </button>
                    <button type="button" onClick={() => toggleActive(p.id, p.active)} className="p-2 rounded-lg border">
                      {p.active ? <EyeOff className="w-5 h-5 text-orange-600" /> : <Eye className="w-5 h-5 text-green-600" />}
                    </button>
                    <button type="button" onClick={() => handleDeleteProduct(p.id)} className="p-2 rounded-lg border text-red-600">
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
        <div className="space-y-3">
          {users.length === 0 ? <p className="text-center py-10 bg-white rounded-xl border">لا يوجد مستخدمين</p> : users.map((u) => (
            <div key={u.id} className="bg-white p-4 rounded-xl border flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold">{u.name}</p>
                <p className="text-sm text-gray-600">{u.email}</p>
                {u.phone && <p className="text-sm">هاتف: {u.phone}</p>}
                {u.address && <p className="text-sm text-gray-500">{u.address}{u.city ? ` - ${u.city}` : ""}</p>}
              </div>
              <button
                type="button"
                onClick={async () => {
                  if (!confirm(`حذف حساب ${u.name}؟`)) return;
                  const { error } = await supabase.from("users").delete().eq("id", u.id);
                  if (error) alert("خطأ: " + error.message);
                  else loadData();
                }}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
              >
                <Trash2 className="w-4 h-4" /> حذف الحساب
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "orders" && !loading && (
        <div className="space-y-4">
          {orders.length === 0 ? <p className="text-center py-10 bg-white rounded-xl border">لا توجد طلبات</p> : orders.map((order) => {
            const st = statusLabel(order.status || "pending");
            return (
              <div key={order.id} className="bg-white p-5 rounded-xl border">
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="font-bold">{order.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${st.color}`}>{st.text}</span>
                  {order.order_type === "custom" && <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">مخصص</span>}
                </div>
                <p className="text-sm text-gray-600">{order.phone}</p>
                <p className="text-sm text-gray-500 mb-2">{order.address} - {order.city}</p>
                {order.items && (
                  <div className="border-t pt-2 mb-3 text-sm">
                    {(Array.isArray(order.items) ? order.items : []).map((item: any, j: number) => (
                      <p key={j}>• {item.name} × {item.quantity}{item.dimensions ? ` (${item.dimensions})` : ""}</p>
                    ))}
                    <p className="font-bold mt-1">الإجمالي: {order.total} ج.م</p>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 border-t pt-3">
                  <button onClick={() => updateOrderStatus(order.id, "confirmed")} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm bg-blue-50 text-blue-700"><CheckCircle className="w-4 h-4" /> تأكيد</button>
                  <button onClick={() => updateOrderStatus(order.id, "shipped")} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm bg-green-50 text-green-700"><Truck className="w-4 h-4" /> تم الشحن</button>
                  <button onClick={() => updateOrderStatus(order.id, "cancelled")} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm bg-orange-50 text-orange-700"><XCircle className="w-4 h-4" /> إلغاء</button>
                  <button onClick={() => deleteOrder(order.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm bg-red-50 text-red-700"><Trash2 className="w-4 h-4" /> حذف</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
