"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/data";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, ArrowRight, Check, Zap } from "lucide-react";
import { notFound, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Product } from "@/types";

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [allProducts, setAllProducts] = useState<Product[]>(products);
  const product = allProducts.find((p) => p.id === id);
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const [buying, setBuying] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("arlo-admin-products");
    if (saved) {
      try {
        const extra = JSON.parse(saved);
        setAllProducts([...products, ...extra]);
      } catch {}
    }
  }, []);

  if (!product) {
    notFound();
  }

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    setBuying(true);
    addItem(product);
    setTimeout(() => router.push("/checkout"), 700);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/products"
        className="inline-flex items-center gap-1 text-[#5a4030] hover:text-[#c4a574] mb-6 transition"
      >
        <ArrowRight className="w-4 h-4" />
        العودة للمنتجات
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="relative h-80 md:h-[480px] rounded-2xl overflow-hidden bg-[#f5e6d3] shadow-lg">
          <Image
            src={product.image}
            alt={product.nameAr}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div>
          <p className="text-[#c4a574] font-medium mb-2">{product.woodType}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#3d2b1f] mb-4">
            {product.nameAr}
          </h1>
          <p className="text-2xl font-bold text-[#5a4030] mb-6">
            {formatPrice(product.price)}
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            {product.descriptionAr}
          </p>

          {product.dimensions && (
            <p className="mb-4">
              <span className="font-semibold text-[#3d2b1f]">الأبعاد: </span>
              {product.dimensions}
            </p>
          )}

          {product.customizable && (
            <div className="flex items-center gap-2 text-green-700 mb-6">
              <Check className="w-5 h-5" />
              <span>قابل للتخصيص حسب طلبك</span>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleAdd}
              className={`flex items-center gap-2 font-bold px-8 py-3.5 rounded-full transition-all duration-300 ${
                added
                  ? "bg-green-600 text-white scale-95"
                  : "bg-[#3d2b1f] text-[#f5e6d3] hover:bg-[#5a4030] active:scale-95"
              }`}
            >
              {added ? (
                <>
                  <Check className="w-5 h-5" />
                  تمت الإضافة للسلة
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  أضف إلى السلة
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={buying}
              className={`flex items-center gap-2 font-bold px-8 py-3.5 rounded-full transition-all duration-300 ${
                buying
                  ? "bg-[#b8956a] text-[#3d2b1f] scale-95"
                  : "bg-[#c4a574] text-[#3d2b1f] hover:bg-[#b8956a] active:scale-95"
              }`}
            >
              <Zap className="w-5 h-5" />
              {buying ? "جاري التحويل..." : "طلب الآن"}
            </button>

            {product.customizable && (
              <Link
                href="/custom-order"
                className="flex items-center gap-2 border-2 border-[#3d2b1f] text-[#3d2b1f] font-bold px-6 py-3.5 rounded-full hover:bg-[#3d2b1f] hover:text-[#f5e6d3] transition"
              >
                اطلب نسخة مخصصة
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
