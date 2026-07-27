"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Order, CustomerInfo } from "@/types";

const EMPTY_FORM: CustomerInfo = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  country: "Cambodia",
  paymentMethod: "cod",
};

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [form, setForm] = useState<CustomerInfo>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});
  const [submitting, setSubmitting] = useState(false);

  const shipping = totalPrice >= 50 ? 0 : totalPrice > 0 ? 5 : 0;
  const total = totalPrice + shipping;

  function validate(): boolean {
    const e: Partial<CustomerInfo> = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Valid email is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const order: Order = {
      id: `ORD-${Date.now()}`,
      items,
      customer: form,
      subtotal: totalPrice,
      shipping,
      total,
      date: new Date().toISOString(),
    };

    try {
      const orders = JSON.parse(localStorage.getItem("orders") ?? "[]");
      orders.push(order);
      localStorage.setItem("orders", JSON.stringify(orders));
    } catch {
      // ignore
    }

    clearCart();
    router.push(`/invoice?orderId=${order.id}`);
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          Your basket is empty
        </h1>
        <Link href="/" className="text-green-600 hover:underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        <nav className="flex items-center gap-2 text-sm text-gray-500 mt-1">
          <Link href="/cart" className="hover:text-green-600">
            Cart
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">Checkout</span>
        </nav>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Shipping form */}
          <div className="flex-1 space-y-5">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-bold text-gray-900 mb-4">
                Shipping Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="Full Name"
                  name="name"
                  value={form.name}
                  error={errors.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                />
                <Field
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.email}
                  error={errors.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                />
                <Field
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  error={errors.phone}
                  onChange={handleChange}
                  placeholder="+855 12 345 678"
                />
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <select
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  >
                    <option>Cambodia</option>
                    <option>Thailand</option>
                    <option>Vietnam</option>
                    <option>Singapore</option>
                    <option>Malaysia</option>
                    <option>Indonesia</option>
                    <option>China</option>
                    <option>United States</option>
                    <option>Other</option>
                  </select>
                </div>
                <Field
                  label="City / Province"
                  name="city"
                  value={form.city}
                  error={errors.city}
                  onChange={handleChange}
                  placeholder="Phnom Penh"
                  className="sm:col-span-2"
                />
                <Field
                  label="Street Address"
                  name="address"
                  value={form.address}
                  error={errors.address}
                  onChange={handleChange}
                  placeholder="123 Street, Sangkat, Khan"
                  className="sm:col-span-2"
                />
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-bold text-gray-900 mb-4">
                Payment Method
              </h2>
              <div className="space-y-3">
                {[
                  { value: "cod", label: "Cash on Delivery", icon: "💵" },
                  { value: "card", label: "Credit / Debit Card", icon: "💳" },
                  { value: "aba", label: "ABA / Wing Transfer", icon: "📱" },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={opt.value}
                      checked={form.paymentMethod === opt.value}
                      onChange={handleChange}
                      className="w-4 h-4 accent-green-600"
                    />
                    <span className="text-lg">{opt.icon}</span>
                    <span className="text-sm font-medium text-gray-700">
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:w-80 shrink-0">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sticky top-24">
              <h2 className="text-base font-bold text-gray-900 mb-4">
                Order Summary
              </h2>

              {/* Items preview */}
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-md bg-gray-50 shrink-0">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-1"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-400">×{quantity}</p>
                    </div>
                    <span className="text-xs font-semibold text-gray-700">
                      ${(product.price * quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-600" : ""}>
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-green-600 text-lg">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-5 w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {submitting ? "Placing Order…" : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

interface FieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  className?: string;
}

function Field({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  className = "",
}: FieldProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 transition-colors ${
          error
            ? "border-red-400 focus:border-red-400 focus:ring-red-400"
            : "border-gray-300 focus:border-green-500 focus:ring-green-500"
        }`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
