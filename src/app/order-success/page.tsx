import Link from "next/link";
import { CheckCircle, MessageCircle } from "lucide-react";

export default function OrderSuccessPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
      <h1 className="text-3xl font-bold text-[#3d2b1f] mb-3">تم إرسال طلبك بنجاح!</h1>
      <p className="text-gray-600 mb-6 leading-relaxed">
        تم فتح واتساب برسالة تحتوي على تفاصيل طلبك.
        <br />
        هنرد عليك قريباً برسوم الشحن ونسألك عن تأكيد الطلب، وبعدها نبدأ التجهيز.
      </p>
      <div className="bg-[#f5e6d3]/60 rounded-2xl p-5 mb-8 text-sm text-[#5a4030]">
        <p className="font-medium mb-1">الرقم اللي بتتواصل معاه:</p>
        <p className="text-lg font-bold">01551277017</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href="https://wa.me/201551277017"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-full hover:bg-[#20bd5a] transition"
        >
          <MessageCircle className="w-5 h-5" />
          فتح الواتساب مرة أخرى
        </a>
        <Link
          href="/products"
          className="inline-flex items-center justify-center gap-2 border-2 border-[#3d2b1f] text-[#3d2b1f] font-bold px-6 py-3 rounded-full hover:bg-[#3d2b1f] hover:text-white transition"
        >
          العودة للمنتجات
        </Link>
      </div>
    </div>
  );
}
