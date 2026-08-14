"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, TreePine, Truck, Shield, Heart } from "lucide-react";

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .eq("featured", true)
        .order("created_at", { ascending: false });

      if (data) {
        setFeatured(
          data.map((p: any) => ({
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
          }))
        );
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div>
      <section className="relative bg-gradient-to-l from-[#3d2b1f] to-[#5a4030] text-[#f5e6d3] py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-[#c4a574] rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-[#c4a574] rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4 text-[#c4a574]">
              <TreePine className="w-6 h-6" />
              <span className="font-medium">جودة خشبية أصيلة</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              مرحباً بك في
              <span className="text-[#c4a574]"> Arlo Wood</span>
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8 leading-relaxed">
              متجر متخصص في المنتجات الخشبية الفاخرة. أثاث، ديكورات، هدايا، وطلبات مخصصة حسب رغبتك.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" className="inline-flex items-center gap-2 bg-[#c4a574] text-[#3d2b1f] font-bold px-6 py-3 rounded-full hover:bg-[#d4b584] transition">
                تصفح المنتجات
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Link href="/custom-order" className="inline-flex items-center gap-2 border-2 border-[#c4a574] text-[#c4a574] font-bold px-6 py-3 rounded-full hover:bg-[#c4a574] hover:text-[#3d2b1f] transition">
                اطلب منتج مخصص
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#f5e6d3]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm">
              <div className="p-3 bg-[#3d2b1f] rounded-xl text-[#c4a574]"><Truck className="w-6 h-6" /></div>
              <div>
                <h3 className="font-bold text-[#3d2b1f]">توصيل لجميع المحافظات</h3>
                <p className="text-sm text-gray-600">نوصل طلبك لباب البيت</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm">
              <div className="p-3 bg-[#3d2b1f] rounded-xl text-[#c4a574]"><Shield className="w-6 h-6" /></div>
              <div>
                <h3 className="font-bold text-[#3d2b1f]">جودة مضمونة</h3>
                <p className="text-sm text-gray-600">خشب أصلي وتشطيب احترافي</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm">
              <div className="p-3 bg-[#3d2b1f] rounded-xl text-[#c4a574]"><Heart className="w-6 h-6" /></div>
              <div>
                <h3 className="font-bold text-[#3d2b1f]">طلبات مخصصة</h3>
                <p className="text-sm text-gray-600">ننفذ تصميمك الخاص</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-[#3d2b1f]">منتجات مميزة</h2>
            <Link href="/products" className="text-[#5a4030] font-medium hover:text-[#c4a574] flex items-center gap-1">
              عرض الكل
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <p className="text-center text-gray-500 py-10">جاري التحميل...</p>
          ) : featured.length === 0 ? (
            <p className="text-center text-gray-500 py-10">
              لا توجد منتجات مميزة حالياً — اختر منتجات من لوحة الأدمن (زر ☆ الرئيسية)
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
