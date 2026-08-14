"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";
import { supabase } from "@/lib/supabase";
import { Search } from "lucide-react";

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });

      if (!error && data) {
        const mapped: Product[] = data.map((p: any) => ({
          id: p.id,
          name: p.name || p.name_ar,
          nameAr: p.name_ar,
          price: Number(p.price),
          description: p.description || p.description_ar || "",
          descriptionAr: p.description_ar || "",
          image: p.image,
          category: p.category || "furniture",
          woodType: p.wood_type || "",
          dimensions: p.dimensions || undefined,
          customizable: p.customizable ?? true,
        }));
        setAllProducts(mapped);
      }
      setLoading(false);
    }
    load();
  }, []);

  const categories = [
    { id: "all", label: "الكل" },
    { id: "furniture", label: "أثاث" },
    { id: "decor", label: "ديكور" },
    { id: "gifts", label: "هدايا" },
    { id: "kitchen", label: "مطبخ" },
  ];

  const filtered = allProducts.filter((p) => {
    const matchSearch =
      p.nameAr.includes(search) ||
      p.descriptionAr.includes(search) ||
      p.woodType.includes(search);
    const matchCat = category === "all" || p.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-[#3d2b1f] mb-8">كل المنتجات</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="ابحث عن منتج..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-10 pl-4 py-3 rounded-xl border border-[#e8d5b7] focus:outline-none focus:ring-2 focus:ring-[#c4a574]" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((c) => (
            <button key={c.id} onClick={() => setCategory(c.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                category === c.id ? "bg-[#3d2b1f] text-white" : "bg-[#f5e6d3] text-[#5a4030] hover:bg-[#e8d5b7]"
              }`}>{c.label}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-center py-20 text-gray-500">جاري تحميل المنتجات...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-500 py-20">لا توجد منتجات حالياً — أضف منتجات من لوحة الأدمن</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
