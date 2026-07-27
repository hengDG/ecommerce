"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, updateQty, totalPrice, clearCart } = useCart();

  const shipping = totalPrice > 0 ? (totalPrice >= 50 ? 0 : 5) : 0;
  const total = totalPrice + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Your basket is empty
        </h1>
        <p className="text-gray-500 mb-6">Add some products to get started.</p>
        <Link
          href="/"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Shopping Basket</h1>
        <button
          onClick={clearCart}
          className="text-sm text-red-500 hover:text-red-700 transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Items list */}
        <div className="flex-1 space-y-3">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex gap-4"
            >
              {/* Image */}
              <Link href={`/products/${product.id}`} className="shrink-0">
                <div className="relative w-20 h-20 rounded-lg bg-gray-50 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-1"
                    sizes="80px"
                  />
                </div>
              </Link>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <Link href={`/products/${product.id}`}>
                  <h3 className="text-sm font-semibold text-gray-900 hover:text-green-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-xs text-green-600 font-medium mt-0.5">
                  {product.brand}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  SKU: {product.sku}
                </p>

                <div className="flex items-center justify-between mt-3">
                  {/* Qty controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(product.id, quantity - 1)}
                      className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-green-500 hover:text-green-600 transition-colors text-lg leading-none"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQty(product.id, quantity + 1)}
                      className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-green-500 hover:text-green-600 transition-colors text-lg leading-none"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal + remove */}
                  <div className="flex items-center gap-3">
                    <span className="text-base font-bold text-green-600">
                      ${(product.price * quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeItem(product.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                      aria-label="Remove item"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:w-72 shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sticky top-24">
            <h2 className="text-base font-bold text-gray-900 mb-4">
              Order Summary
            </h2>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>
                  Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)
                </span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span
                  className={shipping === 0 ? "text-green-600 font-medium" : ""}
                >
                  {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {shipping === 0 && totalPrice > 0 && (
                <p className="text-xs text-green-600">
                  🎉 You qualify for free shipping!
                </p>
              )}
              {shipping > 0 && (
                <p className="text-xs text-gray-400">
                  Add ${(50 - totalPrice).toFixed(2)} more for free shipping
                </p>
              )}
              <div className="border-t border-gray-100 pt-2.5 flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span className="text-green-600 text-lg">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-5 block w-full bg-green-600 hover:bg-green-700 text-white text-center font-semibold py-3 rounded-lg transition-colors"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/"
              className="mt-2 block w-full text-center text-sm text-gray-500 hover:text-green-600 transition-colors py-1"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
