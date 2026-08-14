"use client";

import Link from "next/link";
import {
  Search,
  ShoppingCart,
  FileEdit,
  CreditCard,
  MessageCircle,
  Package,
  CheckCircle,
  ArrowLeft,
  TreePine,
} from "lucide-react";

const steps = [
  {
    num: "1",
    title: "اختار المنتج",
    desc: "تصفح المنتجات من صفحة المتجر، أو ابحث بالاسم أو نوع الخشب. اضغط على المنتج عشان تشوف التفاصيل والصور والسعر.",
    icon: Search,
    link: "/products",
    linkText: "تصفح المنتجات",
  },
  {
    num: "2",
    title: "أضف للسلة أو اطلب الآن",
    desc: "من صفحة المنتج تقدر تختار الكمية، تضيف للسلة، أو تضغط «طلب الآن» للانتقال مباشرة لإتمام الطلب. لو المنتج قابل للتخصيص تقدر تطلب نسخة مخصصة.",
    icon: ShoppingCart,
    link: "/cart",
    linkText: "عرض السلة",
  },
  {
    num: "3",
    title: "طلب منتج مخصص (اختياري)",
    desc: "لو محتاج مقاس أو تصميم خاص: روح لصفحة الطلب المخصص، اكتب الأبعاد ونوع الخشب والملاحظات، وهنجهزه حسب طلبك.",
    icon: FileEdit,
    link: "/custom-order",
    linkText: "طلب مخصص",
  },
  {
    num: "4",
    title: "إتمام الطلب واختيار الدفع",
    desc: "املأ الاسم والهاتف والعنوان، واختار طريقة الدفع: فودافون كاش، إنستا باي، فوري، فيزا، أو طريقة أخرى. لو مسجل دخول بياناتك هتتملأ تلقائي.",
    icon: CreditCard,
    link: "/checkout",
    linkText: "إتمام الطلب",
  },
  {
    num: "5",
    title: "تأكيد عبر واتساب",
    desc: "بعد الضغط على «تأكيد الطلب» هيتفتح واتساب برسالة جاهزة فيها تفاصيل طلبك. هنبعت لك رسوم الشحن ونسألك عن التأكيد، وبعد موافقتك نبدأ التجهيز.",
    icon: MessageCircle,
    link: null,
    linkText: null,
  },
  {
    num: "6",
    title: "التجهيز والشحن",
    desc: "بعد تأكيدك، بنجهّز الطلب ونحدّث حالته (مؤكد → تم الشحن). هتتواصل معاك على نفس الرقم لأي استفسار.",
    icon: Package,
    link: null,
    linkText: null,
  },
];

export default function HowToOrderPage() {
  return (
    <div className="min-h-screen bg-[#faf6f1]">
      <section className="bg-gradient-to-l from-[#3d2b1f] to-[#5a4030] text-[#f5e6d3] py-14 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 text-[#c4a574] mb-4">
            <TreePine className="w-6 h-6" />
            <span className="font-medium">Arlo Wood</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">ازاي تطلب منتج؟</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto leading-relaxed">
            خطوات بسيطة من اختيار المنتج لحد ما يوصلك. التأكيد النهائي بيتم عبر واتساب عشان نحدد الشحن ونبدأ التجهيز.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <div className="space-y-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-white rounded-2xl border border-[#e8d5b7]/50 shadow-sm p-5 md:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6"
              >
                <div className="flex sm:flex-col items-center gap-3 sm:gap-2 shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[#3d2b1f] text-[#c4a574] flex items-center justify-center font-bold text-lg">
                    {step.num}
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#f5e6d3] text-[#5a4030] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-[#3d2b1f] mb-2">{step.title}</h2>
                  <p className="text-gray-600 leading-relaxed mb-3">{step.desc}</p>
                  {step.link && (
                    <Link
                      href={step.link}
                      className="inline-flex items-center gap-1 text-sm font-medium text-[#5a4030] hover:text-[#c4a574] transition"
                    >
                      {step.linkText}
                      <ArrowLeft className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 bg-[#f5e6d3]/60 border border-[#e8d5b7] rounded-2xl p-6">
          <h3 className="font-bold text-[#3d2b1f] mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-700" />
            ملاحظات مهمة
          </h3>
          <ul className="space-y-2 text-gray-700 text-sm leading-relaxed list-disc list-inside">
            <li>الدفع مش إلكتروني كامل: بتختار الطريقة، والتأكيد النهائي عبر واتساب.</li>
            <li>رسوم الشحن بتتحدد بعد الطلب حسب المحافظة والوزن.</li>
            <li>لو مسجّل دخول، الاسم والعنوان بيتملوا تلقائي في صفحة إتمام الطلب.</li>
            <li>للطلبات المخصصة: اكتب المقاسات والملاحظات بوضوح عشان التنفيذ يبقى دقيق.</li>
          </ul>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-[#3d2b1f] text-[#f5e6d3] font-bold px-6 py-3 rounded-full hover:bg-[#5a4030] transition"
          >
            ابدأ التسوق
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Link
            href="/custom-order"
            className="inline-flex items-center gap-2 border-2 border-[#3d2b1f] text-[#3d2b1f] font-bold px-6 py-3 rounded-full hover:bg-[#3d2b1f] hover:text-[#f5e6d3] transition"
          >
            طلب منتج مخصص
          </Link>
        </div>
      </section>
    </div>
  );
}
