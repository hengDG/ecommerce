export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  category: string;
  categorySlug: string;
  image: string;
  sku: string;
  availability: "in stock" | "out of stock";
  unit: number;
  countryFlag: string;
  warranty?: string;
  about?: string;
  brandDescription?: string;
  deliveryText?: string;
  rating: number;
  reviews: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  paymentMethod: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  customer: CustomerInfo;
  subtotal: number;
  shipping: number;
  total: number;
  date: string;
}

export interface Category {
  name: string;
  slug: string;
}
