"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/components/cart/CartContext";

const SHIPPING_FEE = 80;

type CheckoutForm = {
  name: string;
  phone: string;
  city: string;
  address: string;
};

type CheckoutErrors = Partial<CheckoutForm> & {
  form?: string;
};

type CartItemWithStock = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
  stock?: number;
};

type OrderItemPayload = {
  id: number;
  productId: number;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
};

type CreatedOrder = {
  id: string;
  orderId?: string;
  customer: CheckoutForm;
  items: OrderItemPayload[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
};

type CreateOrderResponse = {
  success: boolean;
  message?: string;
  order?: CreatedOrder;
};

export default function CheckoutPage() {
  const router = useRouter();

  const cart = useCart() as {
    cartItems: CartItemWithStock[];
    cartTotal: number;
    clearCart: () => void;
  };

  const { cartItems, cartTotal, clearCart } = cart;

  const [form, setForm] = useState<CheckoutForm>({
    name: "",
    phone: "",
    city: "",
    address: "",
  });

  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const shipping = cartItems.length > 0 ? SHIPPING_FEE : 0;
  const grandTotal = cartTotal + shipping;

  const hasLocalInvalidStockItem = useMemo(() => {
    return cartItems.some((item) => {
      const currentStock = typeof item.stock === "number" ? item.stock : null;
      if (currentStock === null) return false;
      if (currentStock <= 0) return true;
      return item.quantity > currentStock;
    });
  }, [cartItems]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      form: "",
    }));
  };

  const validateForm = () => {
    const nextErrors: CheckoutErrors = {};

    if (!form.name.trim()) nextErrors.name = "Full Name is required";
    if (!form.phone.trim()) nextErrors.phone = "Phone Number is required";
    if (!form.city.trim()) nextErrors.city = "City is required";
    if (!form.address.trim()) nextErrors.address = "Address is required";

    const phoneDigits = form.phone.replace(/\D/g, "");
    if (form.phone.trim() && phoneDigits.length < 11) {
      nextErrors.phone = "Enter a valid phone number";
    }

    if (cartItems.length === 0) {
      nextErrors.form =
        "Your cart is empty. Add products before placing an order.";
    }

    if (hasLocalInvalidStockItem) {
      nextErrors.form =
        "Some cart items are no longer valid for checkout. Please review your cart first.";
    }

    return nextErrors;
  };

  async function createOrder(items: OrderItemPayload[]) {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer: {
          name: form.name.trim(),
          phone: form.phone.trim(),
          city: form.city.trim(),
          address: form.address.trim(),
        },
        items,
        subtotal: cartTotal,
        deliveryFee: shipping,
        total: grandTotal,
        status: "pending",
        paymentMethod: "Cash on Delivery",
      }),
    });

    const data = (await res.json()) as CreateOrderResponse;

    if (!res.ok || !data.success || !data.order) {
      throw new Error(data.message || "Failed to create order.");
    }

    return data.order;
  }

  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const orderItems: OrderItemPayload[] = cartItems.map((item) => ({
        id: item.id,
        productId: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category,
        quantity: item.quantity,
      }));

      const createdOrder = await createOrder(orderItems);
      const nextOrderId = createdOrder.orderId || createdOrder.id;

      clearCart();
      router.push(`/order-success?orderId=${encodeURIComponent(nextOrderId)}`);
    } catch (error) {
      setErrors({
        form:
          error instanceof Error
            ? error.message
            : "Something went wrong while placing the order.",
      });
      setSubmitting(false);
    }
  };

  return (
    <main>
      <TopBar />
      <Navbar />

      <section className="container-ph section-gap">
        <div className="mb-8">
          <h1 className="page-title">Checkout</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Complete your order with delivery information and review your items.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.35fr_0.95fr]">
          <div className="surface-soft p-6 md:p-8">
            <h2 className="section-title">Delivery Information</h2>
            <p className="mt-2 text-sm text-neutral-600">
              Please provide accurate details so your order can be delivered
              properly.
            </p>

            {errors.form ? (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {errors.form}
              </div>
            ) : null}

            <form onSubmit={handlePlaceOrder} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#2e221d]">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  className="input-soft"
                />
                {errors.name ? (
                  <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                ) : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#2e221d]">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={form.phone}
                  onChange={handleChange}
                  className="input-soft"
                />
                {errors.phone ? (
                  <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
                ) : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#2e221d]">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  placeholder="Enter your city"
                  value={form.city}
                  onChange={handleChange}
                  className="input-soft"
                />
                {errors.city ? (
                  <p className="mt-2 text-sm text-red-600">{errors.city}</p>
                ) : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#2e221d]">
                  Full Address
                </label>
                <textarea
                  name="address"
                  placeholder="Enter your full delivery address"
                  value={form.address}
                  onChange={handleChange}
                  rows={5}
                  className="w-full rounded-2xl border border-[#ead9d1] bg-white px-4 py-3 outline-none"
                />
                {errors.address ? (
                  <p className="mt-2 text-sm text-red-600">{errors.address}</p>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={
                  submitting || cartItems.length === 0 || hasLocalInvalidStockItem
                }
                className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Placing Order..." : "Place Order"}
              </button>

              {cartItems.length === 0 ? (
                <Link
                  href="/shop"
                  className="block text-center text-sm font-medium text-[#7a5244] hover:underline"
                >
                  Your cart is empty. Go back to shop
                </Link>
              ) : null}
            </form>
          </div>

          <div className="space-y-6">
            <div className="surface-soft p-6 md:p-8">
              <h2 className="section-title">Order Summary</h2>
              <p className="mt-2 text-sm text-neutral-600">
                Review your items before placing the order.
              </p>

              {cartItems.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-[#ead9d1] bg-[#fdf9f7] p-5 text-sm text-neutral-600">
                  Your cart is empty.
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {cartItems.map((item) => {
                    const currentStock = typeof item.stock === "number" ? item.stock : null;
                    const hasKnownStock = currentStock !== null;
                    const isOutOfStock = currentStock !== null && currentStock <= 0;
                    const exceedsStock =
                      currentStock !== null && item.quantity > currentStock;

                    return (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-[#f2e6df] bg-[#fffdfb] p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="font-medium text-[#2e221d]">
                              {item.name}
                            </p>
                            <p className="mt-1 text-sm text-neutral-500">
                              {item.quantity} × {item.price} BDT
                            </p>
                            {hasKnownStock ? (
                              <p className="mt-1 text-xs text-neutral-500">
                                Stock: {currentStock}
                              </p>
                            ) : null}
                          </div>

                          <p className="shrink-0 text-sm font-medium text-[#2e221d]">
                            {item.quantity * item.price} BDT
                          </p>
                        </div>

                        {isOutOfStock ? (
                          <p className="mt-3 text-xs font-medium text-red-600">
                            This item is out of stock.
                          </p>
                        ) : exceedsStock ? (
                          <p className="mt-3 text-xs font-medium text-red-600">
                            Quantity exceeds available stock.
                          </p>
                        ) : null}
                      </div>
                    );
                  })}

                  <div className="rounded-2xl border border-[#ead9d1] bg-[#fffdfb] p-4">
                    <div className="mb-3 flex items-center justify-between text-sm">
                      <span className="text-neutral-600">Items Total</span>
                      <span className="font-medium">{cartTotal} BDT</span>
                    </div>

                    <div className="mb-3 flex items-center justify-between text-sm">
                      <span className="text-neutral-600">Shipping</span>
                      <span className="font-medium">{shipping} BDT</span>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#ead9d1] pt-3 text-base font-semibold">
                      <span>Grand Total</span>
                      <span>{grandTotal} BDT</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="surface-soft p-5">
              <h3 className="text-lg font-semibold text-[#2e221d]">
                Delivery Notes
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-neutral-600">
                <li>• Please keep your phone active for delivery confirmation.</li>
                <li>• Final stock validation happens during order creation.</li>
                <li>• Shipping charge is fixed at {SHIPPING_FEE} BDT.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}