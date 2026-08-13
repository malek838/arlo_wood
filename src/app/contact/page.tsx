import { Phone, MessageCircle, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-[#3d2b1f] text-center mb-4">تواصل معنا</h1>
      <p className="text-center text-gray-600 mb-10">
        يسعدنا تواصلك معنا في أي وقت
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a
          href="https://wa.me/201551277017"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-[#e8d5b7]/50 hover:border-[#25D366] transition group"
        >
          <div className="p-3 bg-[#25D366]/10 rounded-xl text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-[#3d2b1f]">واتساب</h3>
            <p className="text-[#5a4030] font-medium">01551277017</p>
            <p className="text-xs text-gray-500">الطريقة الأسرع للتواصل</p>
          </div>
        </a>

        <a
          href="tel:01551277017"
          className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-[#e8d5b7]/50 hover:border-[#c4a574] transition"
        >
          <div className="p-3 bg-[#f5e6d3] rounded-xl text-[#5a4030]">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-[#3d2b1f]">اتصال هاتفي</h3>
            <p className="text-[#5a4030] font-medium">01551277017</p>
          </div>
        </a>

        <div className="md:col-span-2 flex items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-[#e8d5b7]/50">
          <div className="p-3 bg-[#f5e6d3] rounded-xl text-[#5a4030]">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-[#3d2b1f]">التوصيل</h3>
            <p className="text-gray-600">نوصل لجميع محافظات مصر</p>
          </div>
        </div>
      </div>
    </div>
  );
}
