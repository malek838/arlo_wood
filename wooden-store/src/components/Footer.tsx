import Link from "next/link";
import { TreePine, Phone, MapPin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#2a1f17] text-[#e8d5b7] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-bold text-xl mb-4">
              <TreePine className="w-6 h-6 text-[#c4a574]" />
              <span>
                Arlo <span className="text-[#c4a574]">Wood</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed opacity-90">
              متجر متخصص في المنتجات الخشبية عالية الجودة. نصنع بحب ونوصل لباب بيتك.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-[#c4a574] mb-4">روابط سريعة</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:text-[#c4a574] transition">
                  المنتجات
                </Link>
              </li>
              <li>
                <Link href="/custom-order" className="hover:text-[#c4a574] transition">
                  طلب منتج مخصص
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#c4a574] transition">
                  من نحن
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#c4a574] transition">
                  تواصل معنا
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-[#c4a574] mb-4">تواصل معنا</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#c4a574]" />
                <a href="tel:01551277017" className="hover:text-[#c4a574]">
                  01551277017
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#c4a574]" />
                <span>info@arlowood.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#c4a574] mt-0.5" />
                <span>مصر - توصيل لجميع المحافظات</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#4a3528] mt-10 pt-6 text-center text-sm opacity-75">
          © {new Date().getFullYear()} Arlo Wood. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
