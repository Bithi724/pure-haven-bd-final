import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-[#ead9d1] bg-white">
      <div className="container-ph py-10">
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-[#2e221d]">
            Pure Haven BD
          </h3>
          <p className="mt-3 max-w-md text-sm leading-6 text-neutral-600">
            Beauty, care, fragrance and essentials in one clean online store.
          </p>
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-8 md:grid-cols-3">
          <div className="space-y-8">
            <div>
              <h4 className="font-semibold text-[#2e221d]">Shop</h4>
              <ul className="mt-3 space-y-2 text-sm text-neutral-600">
                <li>
                  <Link href="/shop?category=cosmetics" className="hover:text-[#7a5244]">
                    Cosmetics
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=skincare" className="hover:text-[#7a5244]">
                    Skincare
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=perfume" className="hover:text-[#7a5244]">
                    Perfumes
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=body-care" className="hover:text-[#7a5244]">
                    Body Care
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[#2e221d]">Support</h4>
              <ul className="mt-3 space-y-2 text-sm text-neutral-600">
                <li>
                  <Link href="/contact" className="hover:text-[#7a5244]">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/track-order" className="font-medium text-[#2e221d] hover:text-[#7a5244]">
                    Track Order
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="hover:text-[#7a5244]">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-conditions" className="hover:text-[#7a5244]">
                    Terms &amp; Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="min-w-[140px]">
            <h4 className="font-semibold text-[#2e221d]">Contact</h4>
            <ul className="mt-3 space-y-2 text-sm text-neutral-600">
              <li>
                <a
                  href="mailto:purehavenbd@gmail.com"
                  className="hover:text-[#7a5244]"
                >
                  purehavenbd@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+8801977269164"
                  className="hover:text-[#7a5244]"
                >
                  +880 1977269164
                </a>
              </li>
              <li>Dhaka, Bangladesh</li>
            </ul>
          </div>

          <div className="hidden md:block">
            <h4 className="font-semibold text-[#2e221d]">Quick Links</h4>
            <ul className="mt-3 space-y-2 text-sm text-neutral-600">
              <li>
                <Link href="/shop?sort=latest" className="hover:text-[#7a5244]">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#7a5244]">
                  Featured Products
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-[#7a5244]">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-[#7a5244]">
                  Cart
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="font-medium text-[#2e221d] hover:text-[#7a5244]">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}