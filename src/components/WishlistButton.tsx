"use client";

import { useState } from "react";

interface Props {
  productId: string;
}

export default function WishlistButton({ productId }: Props) {
  const [wished, setWished] = useState(false);

  return (
    <button
      aria-label="Add to wishlist"
      onClick={() => setWished((w) => !w)}
      className="p-2 rounded-lg border border-gray-200 hover:border-green-400 transition-colors"
    >
      <svg
        className={`w-4 h-4 transition-colors ${wished ? "text-green-600 fill-green-600" : "text-green-500"}`}
        fill={wished ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}
