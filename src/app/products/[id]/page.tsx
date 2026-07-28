import { getProductById, products } from "@/data/products";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import AddToCartButton from "@/components/AddToCartButton";
import WishlistButton from "@/components/WishlistButton";
import ProductCard from "@/components/ProductCard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  return {
    title: product ? `${product.name} – TechShop` : "Product – TechShop",
    description: product?.about ?? "",
  };
}

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= Math.round(rating) ? "text-yellow-400" : "text-gray-200"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.445a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.54 1.118L10 14.347l-3.952 2.775c-.785.57-1.84-.197-1.54-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
          </svg>
        ))}
      </div>
      <span className="text-sm text-gray-500">
        {rating} ({reviews} reviews)
      </span>
    </div>
  );
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) notFound();

  const relatedProducts = products
    .filter(
      (p) => p.id !== product.id && p.categorySlug === product.categorySlug,
    )
    .slice(0, 4);

  const recommendedProducts =
    relatedProducts.length > 0
      ? relatedProducts
      : products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-green-600 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link
          href={`/?category=${product.categorySlug}`}
          className="hover:text-green-600 transition-colors"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-medium truncate max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Main card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Image panel */}
          <div className="relative bg-gray-50 flex items-center justify-center min-h-80 md:min-h-120 p-8">
            <div className="relative w-full h-80 md:h-96">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            {/* Zoom icon */}
            <div className="absolute bottom-4 left-4 bg-white rounded-full p-1.5 shadow-md border border-gray-100">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                />
              </svg>
            </div>
          </div>

          {/* Info panel */}
          <div className="p-6 md:p-8 flex flex-col gap-4 border-t md:border-t-0 md:border-l border-gray-100">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 leading-snug">
                {product.name}
              </h1>
              <p className="text-base font-semibold text-green-600 mt-1">
                {product.brand}
              </p>
            </div>

            <StarRating rating={product.rating} reviews={product.reviews} />

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-green-600">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-base text-gray-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Delivery badge */}
            {product.deliveryText && (
              <div>
                <span className="inline-block bg-orange-500 text-white text-sm font-semibold px-4 py-1.5 rounded-lg">
                  {product.deliveryText}
                </span>
              </div>
            )}

            {/* Unit + flag */}
            <p className="text-sm text-gray-600">
              {product.unit} Unit&nbsp;&nbsp;{product.countryFlag}
            </p>

            {/* Availability */}
            <p className="text-sm">
              <span className="text-gray-600">Availability: </span>
              <span
                className={
                  product.availability === "in stock"
                    ? "text-green-600 font-semibold"
                    : "text-red-500 font-semibold"
                }
              >
                {product.availability === "in stock"
                  ? "In stock"
                  : "Out of stock"}
              </span>
            </p>

            {/* SKU */}
            <p className="text-sm text-gray-500">SKU: {product.sku}</p>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-1">
              <AddToCartButton product={product} variant="detail" />
              <WishlistButton productId={product.id} />
            </div>

            {/* About */}
            <div className="border-t border-gray-100 pt-4 mt-2">
              <h2 className="text-base font-bold text-gray-900 mb-2">About</h2>
              <div className="text-sm text-gray-600 leading-relaxed space-y-1">
                {product.warranty && (
                  <p>
                    <span className="text-gray-500">Warranty: </span>
                    <span className="text-gray-800">{product.warranty}</span>
                  </p>
                )}
              </div>
            </div>

            {/* About the brand */}
            {product.brandDescription && (
              <div className="border-t border-gray-100 pt-4">
                <h2 className="text-base font-bold text-gray-900 mb-2">
                  About the brand
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {product.brandDescription}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* About section (full width) */}
      {product.about && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 mt-4">
          <h2 className="text-base font-bold text-gray-900 mb-3">
            Product Description
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {product.about}
          </p>
        </div>
      )}

      {/* Recommended products */}
      {recommendedProducts.length > 0 && (
        <section className="mt-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Recommended Products
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              You may also like these items
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {recommendedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
