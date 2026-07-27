"use client";

import { useCart } from "@/context/CartContext";
import { Product } from "@/types";

interface Props {
  product: Product;
  variant?: "card" | "detail";
}

export default function AddToCartButton({ product, variant = "card" }: Props) {
  const { addItem } = useCart();

  if (variant === "detail") {
    return (
      <button
        onClick={() => addItem(product)}
        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
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
      Buy
    </button>
  );
}
