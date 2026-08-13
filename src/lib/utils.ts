import { CartItem } from "@/types";
import { WHATSAPP_NUMBER } from "./data";

export function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(price);
}

export function generateWhatsAppLink(
  items: CartItem[],
  customer: {
    name: string;
    phone: string;
    address: string;
    city: string;
    paymentMethod: string;
    otherPayment?: string;
    notes?: string;
  },
  isCustom = false,
  customDetails?: string
): string {
  const orderId = `ARLO-${Date.now().toString().slice(-6)}`;

  let message = `🪵 *طلب جديد من متجر Arlo Wood*\n`;
  message += `━━━━━━━━━━━━━━━━\n`;
  message += `📋 *رقم الطلب:* ${orderId}\n\n`;

  message += `👤 *بيانات العميل:*\n`;
  message += `• الاسم: ${customer.name}\n`;
  message += `• الهاتف: ${customer.phone}\n`;
  message += `• العنوان: ${customer.address}\n`;
  message += `• المدينة: ${customer.city}\n\n`;

  if (isCustom && customDetails) {
    message += `🛠️ *تفاصيل الطلب المخصص:*\n${customDetails}\n\n`;
  } else {
    message += `🛒 *المنتجات:*\n`;
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.product.nameAr}\n`;
      message += `   الكمية: ${item.quantity} × ${item.product.price} ج.م = ${item.quantity * item.product.price} ج.م\n`;
    });
    message += `\n`;
  }

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  if (!isCustom && items.length > 0) {
    message += `💰 *الإجمالي:* ${total} ج.م\n\n`;
  }

  const paymentNames: Record<string, string> = {
    vodafone_cash: "فودافون كاش",
    instapay: "إنستا باي",
    fawry: "فوري",
    visa: "فيزا / ماستركارد",
    other: customer.otherPayment || "طريقة أخرى",
  };

  message += `💳 *طريقة الدفع المختارة:* ${paymentNames[customer.paymentMethod] || customer.paymentMethod}\n\n`;

  if (customer.notes) {
    message += `📝 *ملاحظات:* ${customer.notes}\n\n`;
  }

  message += `━━━━━━━━━━━━━━━━\n`;
  message += `يرجى تحديد رسوم الشحن وتأكيد الطلب 🙏`;

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}
