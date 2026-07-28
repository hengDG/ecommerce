"use client";

import { useCart } from "@/context/CartContext";
import { Product } from "@/types";

interface Props {
  product: Product;
  variant?: "card" | "detail";
}

export default function AddToCartButton({ product, variant = "card" }: Props) {
  const { addItem, updateQty, items } = useCart();
  const qty =
    items.find((item) => item.product.id === product.id)?.quantity ?? 0;

  if (variant === "detail") {
    if (qty > 0) {
      return (
        <div className="flex-1 flex items-center justify-between border border-green-200 bg-green-50 rounded-lg px-3 py-2.5">
          <button
            onClick={() => updateQty(product.id, qty - 1)}
            className="w-8 h-8 rounded-full border border-green-300 text-green-700 hover:bg-green-100 transition-colors"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="text-base font-semibold text-green-700">{qty}</span>
          <button
            onClick={() => addItem(product)}
            className="w-8 h-8 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={() => addItem(product)}
        className="flex-1 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <svg
          className="w-5 h-5"
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
        Add to Basket
      </button>
    );
  }

  if (qty > 0) {
    return (
      <div className="flex-1 flex items-center justify-between border border-green-200 bg-green-50 rounded-lg px-2 py-1.5">
        <button
          onClick={() => updateQty(product.id, qty - 1)}
          className="w-7 h-7 rounded-full border border-green-300 text-green-700 hover:bg-green-100 transition-colors"
          aria-label="Decrease quantity"
        >
          -
        </button>
        <span className="text-sm font-semibold text-green-700">{qty}</span>
        <button
          onClick={() => addItem(product)}
          className="w-7 h-7 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => addItem(product)}
      className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5"
    >
      <svg
        className="w-3.5 h-3.5"
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
      Add to Basket
    </button>
  );
}
