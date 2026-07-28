"use client";

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { useFavorites } from "@/context/FavoriteContext";
import { products } from "@/data/products";

export default function FavoritesPage() {
  const { favoriteIds } = useFavorites();
  const favoriteProducts = products.filter((product) =>
    favoriteIds.includes(product.id),
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Favorite Products</h1>
        <span className="text-sm text-gray-500">
          {favoriteProducts.length} item{favoriteProducts.length !== 1 ? "s" : ""}
        </span>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="text-5xl mb-4">♡</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No favorites yet
          </h2>
          <p className="text-gray-500 mb-6">
            Tap the heart icon on any product to save it here.
          </p>
          <Link
            href="/"
            className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
