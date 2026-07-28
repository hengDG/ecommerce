"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";

interface HomeSliderProps {
  products: Product[];
}

export default function HomeSlider({ products }: HomeSliderProps) {
  const slides = useMemo(() => products.slice(0, 5), [products]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const goNext = () => {
    setIndex((current) => (current + 1) % slides.length);
  };

  const goPrev = () => {
    setIndex((current) => (current - 1 + slides.length) % slides.length);
  };

  return (
    <section className="mb-6">
      <div className="relative overflow-hidden rounded-2xl border border-emerald-200 shadow-[0_10px_30px_rgba(5,150,105,0.12)]">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((product) => (
            <div key={product.id} className="min-w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 px-6 py-8 md:px-10 md:py-10">
                <div className="text-gray-900">
                  <p className="text-xs uppercase tracking-widest text-emerald-600 mb-2">
                    Featured Product
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                    {product.name}
                  </h2>
                  <p className="text-sm md:text-base text-gray-600 mt-2">
                    {product.brand}
                  </p>
                  <div className="flex items-center gap-2 mt-4">
                    <span className="text-2xl font-extrabold text-emerald-700">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/products/${product.id}`}
                    className="inline-flex mt-6 bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Shop Now
                  </Link>
                </div>

                <div className="relative h-52 md:h-64">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain "
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {slides.length > 1 && (
          <>
            <button
              onClick={goPrev}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              &#10094;
            </button>
            <button
              onClick={goNext}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              &#10095;
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {slides.map((slide, dotIndex) => (
                <button
                  key={slide.id}
                  onClick={() => setIndex(dotIndex)}
                  aria-label={`Go to slide ${dotIndex + 1}`}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    dotIndex === index ? "bg-emerald-600" : "bg-emerald-200"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
