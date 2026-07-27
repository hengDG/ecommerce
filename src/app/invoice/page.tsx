"use client";

import { useEffect, useState } from "react";
import { Order } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function InvoiceContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    try {
      const orders: Order[] = JSON.parse(
        localStorage.getItem("orders") ?? "[]",
      );
      const found = orders.find((o) => o.id === orderId);
      if (found) {
        setOrder(found);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    }
  }, [orderId]);

  if (notFound) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">❌</div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          Order not found
        </h1>
        <Link href="/" className="text-green-600 hover:underline">
          Back to Shop
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  const paymentLabels: Record<string, string> = {
    cod: "Cash on Delivery",
    card: "Credit / Debit Card",
    aba: "ABA / Wing Transfer",
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Print / actions bar */}
      <div className="no-print flex items-center justify-between mb-6">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-green-600 flex items-center gap-1"
        >
          ← Continue Shopping
        </Link>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          Print Invoice
        </button>
      </div>

      {/* Invoice document */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 print:shadow-none print:rounded-none print:border-none">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <span className="text-2xl font-bold text-gray-900">
                Tech<span className="text-green-600">Shop</span>
              </span>
            </div>
            <p className="text-sm text-gray-500">Phnom Penh, Cambodia</p>
            <p className="text-sm text-gray-500">support@techshop.kh</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900 uppercase tracking-wider">
              Invoice
            </p>
            <p className="text-sm text-gray-500 mt-1"># {order.id}</p>
            <p className="text-sm text-gray-500">
              {new Date(order.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Billing / Shipping */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Bill To
            </h3>
            <p className="text-sm font-semibold text-gray-900">
              {order.customer.name}
            </p>
            <p className="text-sm text-gray-600">{order.customer.email}</p>
            <p className="text-sm text-gray-600">{order.customer.phone}</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Ship To
            </h3>
            <p className="text-sm text-gray-600">{order.customer.address}</p>
            <p className="text-sm text-gray-600">{order.customer.city}</p>
            <p className="text-sm text-gray-600">{order.customer.country}</p>
          </div>
        </div>

        {/* Payment info */}
        <div className="mb-6 flex gap-8 text-sm">
          <div>
            <span className="text-gray-400 text-xs uppercase tracking-wider block mb-0.5">
              Payment Method
            </span>
            <span className="font-medium text-gray-800">
              {paymentLabels[order.customer.paymentMethod] ??
                order.customer.paymentMethod}
            </span>
          </div>
          <div>
            <span className="text-gray-400 text-xs uppercase tracking-wider block mb-0.5">
              Status
            </span>
            <span className="inline-block bg-green-100 text-green-700 font-semibold text-xs px-2 py-0.5 rounded-full">
              Confirmed
            </span>
          </div>
        </div>

        {/* Items table */}
        <div className="border border-gray-100 rounded-xl overflow-hidden mb-6">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Qty
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Unit Price
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {order.items.map(({ product, quantity }) => (
                <tr key={product.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="no-print relative w-10 h-10 rounded-md bg-gray-50 shrink-0 overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-contain p-1"
                          sizes="40px"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {product.brand} · {product.sku}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-700">
                    {quantity}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">
                    ${(product.price * quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>
                {order.shipping === 0
                  ? "Free"
                  : `$${order.shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900 text-base">
              <span>Total</span>
              <span className="text-green-600">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-10 pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
          <p>Thank you for shopping at TechShop! 🎉</p>
          <p className="mt-1">For support, contact us at support@techshop.kh</p>
        </div>
      </div>
    </div>
  );
}

export default function InvoicePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full" />
        </div>
      }
    >
      <InvoiceContent />
    </Suspense>
  );
}
