import { TreePine, Heart, Award, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <TreePine className="w-14 h-14 text-[#c4a574] mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-[#3d2b1f] mb-4">من نحن</h1>
        <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Arlo Wood هو متجر متخصص في صناعة وبيع المنتجات الخشبية عالية الجودة.
          بنحب الخشب، وبنشتغل عليه بحرفية عشان نقدم لك قطع فريدة تدوم سنين.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm text-center border border-[#e8d5b7]/40">
          <Heart className="w-8 h-8 text-[#c4a574] mx-auto mb-3" />
          <h3 className="font-bold text-[#3d2b1f] mb-2">شغف بالخشب</h3>
          <p className="text-sm text-gray-600">كل قطعة بتتعمل بحب واهتمام بالتفاصيل</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm text-center border border-[#e8d5b7]/40">
          <Award className="w-8 h-8 text-[#c4a574] mx-auto mb-3" />
          <h3 className="font-bold text-[#3d2b1f] mb-2">جودة مضمونة</h3>
          <p className="text-sm text-gray-600">بنستخدم أجود أنواع الأخشاب والتشطيبات</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm text-center border border-[#e8d5b7]/40">
          <Users className="w-8 h-8 text-[#c4a574] mx-auto mb-3" />
          <h3 className="font-bold text-[#3d2b1f] mb-2">خدمة عملاء</h3>
          <p className="text-sm text-gray-600">تواصل مباشر عبر الواتساب ومتابعة لطلبك</p>
        </div>
      </div>

      <div className="bg-[#3d2b1f] text-[#f5e6d3] rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-3">عايز منتج خاص بيك؟</h2>
        <p className="mb-6 opacity-90">
          نقدر ننفذ تصميمك الخاص بالمقاسات والخامات اللي تختارها.
        </p>
        <a
          href="/custom-order"
          className="inline-block bg-[#c4a574] text-[#3d2b1f] font-bold px-6 py-3 rounded-full hover:bg-[#d4b584] transition"
        >
          اطلب منتج مخصص
        </a>
      </div>
    </div>
  );
}
