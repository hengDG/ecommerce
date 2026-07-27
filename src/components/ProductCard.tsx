import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import AddToCartButton from "./AddToCartButton";
import WishlistButton from "./WishlistButton";

interface Props {
  product: Product;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3 h-3 ${star <= Math.round(rating) ? "text-yellow-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.445a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.54 1.118L10 14.347l-3.952 2.775c-.785.57-1.84-.197-1.54-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
        </svg>
      ))}
      <span className="text-xs text-gray-400 ml-1">({rating})</span>
    </div>
  );
}

export default function ProductCard({ product }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col overflow-hidden group">
      {/* Image */}
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative h-44 bg-gray-50 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-3 gap-1.5">
        {/* Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug hover:text-green-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Brand */}
        <p className="text-xs font-medium text-green-600">{product.brand}</p>

        {/* Stars */}
        <StarRating rating={product.rating} />

        {/* Unit + Flag */}
        <p className="text-xs text-gray-500">
          {product.unit} Unit {product.countryFlag}
        </p>

        {/* Price */}
        <div className="mt-auto pt-2">
          <span className="text-lg font-bold text-green-600">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through ml-1.5">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-1">
          <AddToCartButton product={product} variant="card" />
          <WishlistButton productId={product.id} />
        </div>
      </div>
    </div>
  );
}
