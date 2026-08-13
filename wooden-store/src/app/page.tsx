import Link from "next/link";
import { products } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import { ArrowLeft, TreePine, Truck, Shield, Heart } from "lucide-react";

export default function HomePage() {
  const featured = products.slice(0, 4);

  return (
    <div>
      {/* Hero */}
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
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-[#c4a574] text-[#3d2b1f] font-bold px-6 py-3 rounded-full hover:bg-[#d4b584] transition"
              >
                تصفح المنتجات
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Link
                href="/custom-order"
                className="inline-flex items-center gap-2 border-2 border-[#c4a574] text-[#c4a574] font-bold px-6 py-3 rounded-full hover:bg-[#c4a574] hover:text-[#3d2b1f] transition"
              >
                اطلب منتج مخصص
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-[#f5e6d3]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm">
              <div className="p-3 bg-[#3d2b1f] rounded-xl text-[#c4a574]">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[#3d2b1f]">توصيل لجميع المحافظات</h3>
                <p className="text-sm text-gray-600">نوصل طلبك لباب البيت</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm">
              <div className="p-3 bg-[#3d2b1f] rounded-xl text-[#c4a574]">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[#3d2b1f]">جودة مضمونة</h3>
                <p className="text-sm text-gray-600">خشب أصلي وتشطيب احترافي</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm">
              <div className="p-3 bg-[#3d2b1f] rounded-xl text-[#c4a574]">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[#3d2b1f]">طلبات مخصصة</h3>
                <p className="text-sm text-gray-600">ننفذ تصميمك الخاص</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-[#3d2b1f]">منتجات مميزة</h2>
            <Link
              href="/products"
              className="text-[#5a4030] font-medium hover:text-[#c4a574] flex items-center gap-1"
            >
              عرض الكل
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Custom Order */}
      <section className="py-16 bg-[#3d2b1f] text-[#f5e6d3]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <TreePine className="w-12 h-12 text-[#c4a574] mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">عندك فكرة لمنتج خشبي خاص؟</h2>
          <p className="text-lg opacity-90 mb-8">
            اطلب منتجك المخصص بالمقاسات والخامات اللي تناسبك، وهننفذه لك باحترافية.
          </p>
          <Link
            href="/custom-order"
            className="inline-flex items-center gap-2 bg-[#c4a574] text-[#3d2b1f] font-bold px-8 py-3 rounded-full hover:bg-[#d4b584] transition"
          >
            ابدأ طلبك المخصص الآن
          </Link>
        </div>
      </section>
    </div>
  );
}
