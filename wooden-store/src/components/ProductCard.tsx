"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Eye } from "lucide-react";
import { Product } from "@/types";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group border border-[#e8d5b7]/20">
      <div className="relative h-56 overflow-hidden bg-[#f5e6d3]">
        <Image
          src={product.image}
          alt={product.nameAr}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {product.customizable && (
          <span className="absolute top-3 right-3 bg-[#c4a574] text-[#3d2b1f] text-xs font-bold px-2 py-1 rounded-full">
            قابل للتخصيص
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs text-[#8b7355] mb-1">{product.woodType}</p>
        <h3 className="font-bold text-[#3d2b1f] text-lg mb-1 line-clamp-1">
          {product.nameAr}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3 h-10">
          {product.descriptionAr}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-[#5a4030]">
            {formatPrice(product.price)}
          </span>

          <div className="flex gap-2">
            <Link
              href={`/products/${product.id}`}
              className="p-2 rounded-full bg-[#f5e6d3] text-[#5a4030] hover:bg-[#c4a574] hover:text-white transition"
              title="عرض التفاصيل"
            >
              <Eye className="w-4 h-4" />
            </Link>
            <button
              onClick={() => addItem(product)}
              className="p-2 rounded-full bg-[#3d2b1f] text-[#f5e6d3] hover:bg-[#5a4030] transition"
              title="أضف للسلة"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
