"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Product } from "@/types";
import { Plus, Trash2, LogOut, Package } from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
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

    const saved = localStorage.getItem("arlo-admin-products");
    if (saved) setProducts(JSON.parse(saved));
  }, [router]);

  const saveProducts = (list: Product[]) => {
    setProducts(list);
    localStorage.setItem("arlo-admin-products", JSON.stringify(list));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nameAr || !form.price) return;

    const newProduct: Product = {
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
    };

    saveProducts([newProduct, ...products]);
    setForm({
      nameAr: "",
      price: "",
      descriptionAr: "",
      image: "",
      woodType: "زان",
      category: "furniture",
      dimensions: "",
      customizable: true,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      saveProducts(products.filter((p) => p.id !== id));
    }
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
          <Link href="/" className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50">
            المتجر
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-red-50 text-red-700 text-sm hover:bg-red-100"
          >
            <LogOut className="w-4 h-4" />
            خروج
          </button>
        </div>
      </div>

      {/* Add Product Form */}
      <form onSubmit={handleAdd} className="bg-white rounded-2xl shadow border border-[#e8d5b7]/40 p-6 mb-10 space-y-4">
        <h2 className="text-xl font-bold text-[#3d2b1f] mb-2">إضافة منتج جديد</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">اسم المنتج *</label>
            <input
              value={form.nameAr}
              onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] focus:ring-2 focus:ring-[#c4a574] outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">السعر (جنيه) *</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] focus:ring-2 focus:ring-[#c4a574] outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">نوع الخشب</label>
            <select
              value={form.woodType}
              onChange={(e) => setForm({ ...form, woodType: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] outline-none"
            >
              <option>زان</option>
              <option>بلوط</option>
              <option>صنوبر</option>
              <option>ماهوجني</option>
              <option>زان أحمر</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">التصنيف</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] outline-none"
            >
              <option value="furniture">أثاث</option>
              <option value="decor">ديكور</option>
              <option value="gifts">هدايا</option>
              <option value="kitchen">مطبخ</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">الأبعاد</label>
            <input
              value={form.dimensions}
              onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
              placeholder="مثال: 120 × 60 × 75 سم"
              className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">رابط الصورة</label>
            <input
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">الوصف</label>
          <textarea
            value={form.descriptionAr}
            onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-[#e8d5b7] outline-none"
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.customizable}
            onChange={(e) => setForm({ ...form, customizable: e.target.checked })}
            className="w-4 h-4"
          />
          قابل للتخصيص
        </label>

        <button
          type="submit"
          className="flex items-center gap-2 bg-[#3d2b1f] text-[#f5e6d3] font-bold px-6 py-3 rounded-xl hover:bg-[#5a4030] transition"
        >
          <Plus className="w-5 h-5" />
          إضافة المنتج
        </button>
      </form>

      {/* Products List */}
      <h2 className="text-xl font-bold text-[#3d2b1f] mb-4">
        المنتجات المضافة ({products.length})
      </h2>
      
      {products.length === 0 ? (
        <p className="text-gray-500 text-center py-10">لا توجد منتجات مضافة بعد</p>
      ) : (
        <div className="space-y-3">
          {products.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between bg-white p-4 rounded-xl border border-[#e8d5b7]/40 shadow-sm"
            >
              <div>
                <p className="font-bold text-[#3d2b1f]">{p.nameAr}</p>
                <p className="text-sm text-gray-500">
                  {p.price} ج.م • {p.woodType}
                </p>
              </div>
              <button
                onClick={() => handleDelete(p.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
