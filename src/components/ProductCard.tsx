"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Zap, Check } from "lucide-react";
import { Product } from "@/types";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const [buying, setBuying] = useState(false);
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBuying(true);
    addItem(product);
    setTimeout(() => {
      router.push("/checkout");
    }, 600);
  };

  return (
    <Link href={`/products/${product.id}`} className="block group">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 border border-[#e8d5b7]/30 hover:-translate-y-1">
        <div className="relative h-56 overflow-hidden bg-[#f5e6d3]">
          <Image
            src={product.image}
            alt={product.nameAr}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.customizable && (
            <span className="absolute top-3 right-3 bg-[#c4a574] text-[#3d2b1f] text-xs font-bold px-2.5 py-1 rounded-full shadow">
              قابل للتخصيص
            </span>
          )}
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>

        <div className="p-4">
          <p className="text-xs text-[#8b7355] mb-1">{product.woodType}</p>
          <h3 className="font-bold text-[#3d2b1f] text-lg mb-1 line-clamp-1 group-hover:text-[#5a4030] transition">
            {product.nameAr}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3 h-10">
            {product.descriptionAr}
          </p>

          <div className="flex items-center justify-between mb-3">
            <span className="text-xl font-bold text-[#5a4030]">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Buttons */}
          <div className="flex gap-2" onClick={(e) => e.preventDefault()}>
            <button
              onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                added
                  ? "bg-green-600 text-white scale-95"
                  : "bg-[#3d2b1f] text-[#f5e6d3] hover:bg-[#5a4030] active:scale-95"
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  تمت الإضافة
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  أضف للسلة
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={buying}
              className={`flex items-center justify-center gap-1 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                buying
                  ? "bg-[#c4a574] text-[#3d2b1f] scale-95"
                  : "bg-[#c4a574] text-[#3d2b1f] hover:bg-[#b8956a] active:scale-95"
              }`}
            >
              <Zap className="w-4 h-4" />
              {buying ? "جاري..." : "طلب الآن"}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
