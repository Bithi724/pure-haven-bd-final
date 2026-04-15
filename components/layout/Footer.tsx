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
                <li>Cosmetics</li>
                <li>Skincare</li>
                <li>Perfumes</li>
                <li>Body Care</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[#2e221d]">Support</h4>
              <ul className="mt-3 space-y-2 text-sm text-neutral-600">
                <li>Contact Us</li>
                <li>Order Tracking</li>
                <li>Privacy Policy</li>
                <li>Terms &amp; Conditions</li>
              </ul>
            </div>
          </div>

          <div className="min-w-[140px]">
            <h4 className="font-semibold text-[#2e221d]">Contact</h4>
            <ul className="mt-3 space-y-2 text-sm text-neutral-600">
              <li>purehavenbd@gmail.com</li>
              <li>+880 1977269164</li>
              <li>Dhaka, Bangladesh</li>
            </ul>
          </div>

          <div className="hidden md:block">
            <h4 className="font-semibold text-[#2e221d]">Quick Links</h4>
            <ul className="mt-3 space-y-2 text-sm text-neutral-600">
              <li>New Arrivals</li>
              <li>Featured Products</li>
              <li>Wishlist</li>
              <li>Cart</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}