"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import { useWishlist } from "@/components/wishlist/WishlistContext";

type ProductCardProps = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  stock?: number;
};

export default function ProductCard(props: ProductCardProps) {
  const { addToCart, cartItems } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { id, name, price, image, category, stock } = props;

  const [justAdded, setJustAdded] = useState(false);

  const wished = isInWishlist(id);
  const existingItem = cartItems.find((item) => item.id === id);
  const currentQty = existingItem?.quantity ?? 0;

  const hasKnownStock = typeof stock === "number";
  const isOutOfStock = hasKnownStock && stock <= 0;
  const isLowStock = hasKnownStock && stock > 0 && stock <= 5;
  const reachedStockLimit = hasKnownStock && stock > 0 && currentQty >= stock;

  const addDisabled = isOutOfStock || reachedStockLimit;

  useEffect(() => {
    if (!justAdded) return;
    const timer = setTimeout(() => setJustAdded(false), 1400);
    return () => clearTimeout(timer);
  }, [justAdded]);

  const buttonText = isOutOfStock
    ? "Out of Stock"
    : reachedStockLimit
    ? "Limit Reached"
    : justAdded
    ? "Added"
    : "Add to Cart";

  const imageSrc =
    image && image.trim() !== ""
      ? image
      : "https://via.placeholder.com/600x600?text=No+Image";

  return (
    <div className="group overflow-hidden rounded-[18px] border border-[#ead9d1] bg-white p-2.5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md sm:rounded-[22px] sm:p-3 lg:rounded-[28px] lg:p-4">
      <div className="relative">
        <Link href={`/product/${id}`} className="block">
          <div className="overflow-hidden rounded-[14px] bg-[#f8f3ef] sm:rounded-[18px] lg:rounded-[22px]">
            <img
              src={imageSrc}
              alt={name}
              className="aspect-square w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/600x600?text=No+Image";
              }}
            />
          </div>
        </Link>

        <button
          type="button"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist({ id, name, price, image, category });
          }}
          className={`absolute right-2 top-2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border shadow-sm backdrop-blur-md transition sm:h-9 sm:w-9 lg:h-10 lg:w-10 ${
            wished
              ? "border-[#2e221d] bg-[#2e221d] text-white"
              : "border-white/70 bg-white/90 text-[#2e221d] hover:bg-white"
          }`}
        >
          <Heart className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${wished ? "fill-current" : ""}`} />
        </button>

        {isOutOfStock ? (
          <div className="absolute left-2 top-2 z-10 rounded-full border border-red-200 bg-red-50/95 px-2 py-0.5 text-[10px] font-semibold text-red-600 backdrop-blur-sm sm:px-2.5 sm:py-1 sm:text-[11px]">
            Out of Stock
          </div>
        ) : isLowStock ? (
          <div className="absolute left-2 top-2 z-10 rounded-full border border-amber-200 bg-amber-50/95 px-2 py-0.5 text-[10px] font-semibold text-amber-700 backdrop-blur-sm sm:px-2.5 sm:py-1 sm:text-[11px]">
            Low Stock
          </div>
        ) : null}
      </div>

      <div className="pt-2.5 sm:pt-3 lg:pt-4">
        <div className="flex items-start justify-between gap-2">
          <span className="max-w-[70%] truncate rounded-full bg-[#f8f3ef] px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.12em] text-[#7a5244] sm:px-2.5 sm:py-1 sm:text-[10px] lg:text-[11px]">
            {category}
          </span>

          {hasKnownStock ? (
            <span className="hidden text-[10px] font-medium text-neutral-500 sm:inline lg:text-[11px]">
              Stock: {stock}
            </span>
          ) : null}
        </div>

        <Link href={`/product/${id}`} className="block">
          <h3 className="mt-2 line-clamp-2 min-h-[2.5rem] text-[15px] font-semibold leading-5 text-[#2e221d] transition group-hover:text-[#7a5244] sm:min-h-[2.8rem] sm:text-base sm:leading-6 lg:min-h-[3.1rem] lg:text-lg">
            {name}
          </h3>
        </Link>

        <div className="mt-2 flex items-end justify-between gap-2">
          <p className="text-lg font-semibold tracking-tight text-[#2e221d] sm:text-xl">
            ৳{price}
          </p>

          {isLowStock && !isOutOfStock ? (
            <p className="hidden text-[10px] font-medium text-amber-700 sm:block">
              Few left
            </p>
          ) : null}
        </div>

        <div className="mt-3">
          <button
            type="button"
            disabled={addDisabled}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart({ id, name, price, image, category, stock });
              if (!addDisabled) setJustAdded(true);
            }}
            className={`inline-flex w-full items-center justify-center gap-1.5 rounded-full px-3 py-2.5 text-[13px] font-semibold shadow-sm transition sm:gap-2 sm:py-3 sm:text-sm ${
              addDisabled
                ? "cursor-not-allowed bg-[#e9dfd9] text-[#8a7569] opacity-90"
                : justAdded
                ? "bg-[#7a5244] text-white"
                : "bg-[#2e221d] text-white hover:bg-[#7a5244]"
            }`}
          >
            {justAdded && !addDisabled ? (
              <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            ) : (
              <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            )}
            <span className="truncate">{buttonText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}