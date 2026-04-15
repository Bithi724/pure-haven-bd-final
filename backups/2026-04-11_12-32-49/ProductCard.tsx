"use client";

import Link from "next/link";
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

  const wished = isInWishlist(id);
  const existingItem = cartItems.find((item) => item.id === id);
  const currentQty = existingItem?.quantity ?? 0;

  const hasKnownStock = typeof stock === "number";
  const isOutOfStock = hasKnownStock && stock <= 0;
  const reachedStockLimit =
    hasKnownStock && stock > 0 && currentQty >= stock;

  const addDisabled = isOutOfStock || reachedStockLimit;

  const addButtonText = isOutOfStock
    ? "Out of Stock"
    : reachedStockLimit
    ? "Stock Limit Reached"
    : "Add to Cart";

  return (
    <div className="card-soft overflow-hidden p-4">
      <div className="relative">
        <Link href={`/product/${id}`}>
          <img
            src={image}
            alt={name}
            className="h-64 w-full rounded-[20px] bg-[#f8f3ef] object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "https://via.placeholder.com/600x600?text=No+Image";
            }}
          />
        </Link>

        <button
          type="button"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist({ id, name, price, image, category });
          }}
          className={`absolute right-3 top-3 z-10 flex h-10 w-10 touch-manipulation items-center justify-center rounded-full border text-lg shadow-sm transition ${
            wished
              ? "border-[#2e221d] bg-[#2e221d] text-white"
              : "border-[#ead9d1] bg-white text-[#2e221d] hover:bg-[#f8f3ef]"
          }`}
        >
          ♥
        </button>

        {isOutOfStock ? (
          <div className="absolute left-3 top-3 z-10 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
            Out of Stock
          </div>
        ) : null}
      </div>

      <div className="pt-4">
        <p className="text-sm text-[#7a5244]">{category}</p>

        <Link href={`/product/${id}`}>
          <h3 className="mt-1 text-lg font-semibold hover:text-[#7a5244]">
            {name}
          </h3>
        </Link>

        <p className="mt-2 text-base font-medium">{price} BDT</p>

        {hasKnownStock ? (
          <p className="mt-1 text-sm text-neutral-500">Stock: {stock}</p>
        ) : null}

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            disabled={addDisabled}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart({ id, name, price, image, category, stock });
            }}
            className="flex-1 rounded-full bg-[#2e221d] px-4 py-3 text-white transition hover:bg-[#7a5244] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {addButtonText}
          </button>

          <button
            type="button"
            aria-label={wished ? "Saved in wishlist" : "Save to wishlist"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist({ id, name, price, image, category });
            }}
            className={`rounded-full border px-4 py-3 transition ${
              wished
                ? "border-[#2e221d] bg-[#2e221d] text-white"
                : "border-[#ead9d1] text-[#2e221d] hover:bg-[#f8f3ef]"
            }`}
          >
            {wished ? "Saved" : "Wishlist"}
          </button>
        </div>
      </div>
    </div>
  );
}