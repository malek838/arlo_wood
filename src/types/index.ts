export interface Product {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  description: string;
  descriptionAr: string;
  image: string;
  category: string;
  woodType: string;
  dimensions?: string;
  customizable: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderFormData {
  name: string;
  phone: string;
  address: string;
  city: string;
  paymentMethod: "vodafone_cash" | "instapay" | "fawry" | "visa" | "other";
  otherPayment?: string;
  notes?: string;
}

export interface CustomOrderData {
  productName: string;
  woodType: string;
  length: string;
  width: string;
  height: string;
  quantity: number;
  notes: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  paymentMethod: "vodafone_cash" | "instapay" | "fawry" | "visa" | "other";
  otherPayment?: string;
}