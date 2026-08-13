"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/data";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, ArrowRight, Check } from "lucide-react";
import { notFound } from "next/navigation";

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const product = products.find((p) => p.id === id);
  const addItem = useCartStore((s) => s.addItem);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/products"
        className="inline-flex items-center gap-1 text-[#5a4030] hover:text-[#c4a574] mb-6"
      >
        <ArrowRight className="w-4 h-4" />
        العودة للمنتجات
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image */}
        <div className="relative h-80 md:h-[450px] rounded-2xl overflow-hidden bg-[#f5e6d3]">
          <Image
            src={product.image}
            alt={product.nameAr}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        {/* Info */}
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

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => addItem(product)}
              className="flex items-center gap-2 bg-[#3d2b1f] text-[#f5e6d3] font-bold px-8 py-3 rounded-full hover:bg-[#5a4030] transition"
            >
              <ShoppingCart className="w-5 h-5" />
              أضف إلى السلة
            </button>
            {product.customizable && (
              <Link
                href="/custom-order"
                className="flex items-center gap-2 border-2 border-[#3d2b1f] text-[#3d2b1f] font-bold px-6 py-3 rounded-full hover:bg-[#3d2b1f] hover:text-[#f5e6d3] transition"
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
