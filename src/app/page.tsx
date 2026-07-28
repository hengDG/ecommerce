import {
  categories,
  products,
  searchProducts,
  getProductsByCategory,
} from "@/data/products";
import ProductCard from "@/components/ProductCard";
import HomeSlider from "@/components/HomeSlider";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TechShop – Gadgets & Electronics",
  description: "Shop the latest gadgets, wearables, and electronics.",
};

interface PageProps {
  searchParams: Promise<{ category?: string; search?: string }>;
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const { category, search } = await searchParams;

  // SSR: filter products on the server
  let filtered = products;
  let pageTitle = "All Products";

  if (search) {
    filtered = searchProducts(search);
    pageTitle = `Results for "${search}"`;
  } else if (category) {
    filtered = getProductsByCategory(category);
    const cat = categories.find((c) => c.slug === category);
    pageTitle = cat?.name ?? "Products";
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 gap-1">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
          Categories
        </h2>

        <Link
          href="/"
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex justify-between items-center ${
            !category && !search
              ? "bg-green-50 text-green-700 font-semibold"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <span>All Products</span>
          <span className="text-xs text-gray-400">{products.length}</span>
        </Link>

        {categories.map((cat) => {
          const count = products.filter(
            (p) => p.categorySlug === cat.slug,
          ).length;
          return (
            <Link
              key={cat.slug}
              href={`/?category=${cat.slug}`}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex justify-between items-center ${
                category === cat.slug
                  ? "bg-green-50 text-green-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-xs text-gray-400">{count}</span>
            </Link>
          );
        })}
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        {!category && !search && <HomeSlider products={products} />}

        {/* Mobile category pills */}
        <div className="flex md:hidden gap-2 overflow-x-auto pb-2 mb-4">
          <Link
            href="/"
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              !category && !search
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-green-400"
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/?category=${cat.slug}`}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                category === cat.slug
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-green-400"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{pageTitle}</h1>
            <p className="text-sm text-gray-500">
              {filtered.length} item{filtered.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        {/* Product grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg">No products found.</p>
            <Link
              href="/"
              className="mt-4 inline-block text-green-600 hover:underline text-sm"
            >
              Browse all products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
