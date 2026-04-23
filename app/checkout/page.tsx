"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/components/cart/CartContext";

type CheckoutForm = {
  name: string;
  phone: string;
  city: string;
  address: string;
  bkashNumber: string;
  trxId: string;
};

type CheckoutErrors = Partial<CheckoutForm> & {
  form?: string;
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
};

type CreateOrderResponse = {
  success: boolean;
  message?: string;
  order?: CreatedOrder;
};

const SHIPPING_FEE = 120;

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();

  const [form, setForm] = useState<CheckoutForm>({
    name: "",
    phone: "",
    city: "",
    address: "",
    bkashNumber: "",
    trxId: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<
    "Cash on Delivery" | "bKash"
  >("Cash on Delivery");

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<CheckoutErrors>({});

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

    if (!form.name.trim()) nextErrors.name = "Full name is required";
    if (!form.phone.trim()) nextErrors.phone = "Phone number is required";
    if (!form.city.trim()) nextErrors.city = "City is required";
    if (!form.address.trim()) nextErrors.address = "Address is required";

    const phoneDigits = form.phone.replace(/\D/g, "");
    if (form.phone.trim() && phoneDigits.length < 11) {
      nextErrors.phone = "Enter a valid phone number";
    }

    if (paymentMethod === "bKash") {
      const bkashDigits = form.bkashNumber.replace(/\D/g, "");
      if (!form.bkashNumber.trim()) {
        nextErrors.bkashNumber = "bKash sender number is required";
      } else if (bkashDigits.length < 11) {
        nextErrors.bkashNumber = "Enter a valid bKash number";
      }

      if (!form.trxId.trim()) {
        nextErrors.trxId = "Transaction ID is required";
      } else if (form.trxId.trim().length < 6) {
        nextErrors.trxId = "Transaction ID looks too short";
      }
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
        paymentMethod,
        paymentStatus:
          paymentMethod === "bKash" ? "awaiting_verification" : "pending",
        paymentDetails:
          paymentMethod === "bKash"
            ? {
                provider: "bKash",
                senderNumber: form.bkashNumber.trim(),
                trxId: form.trxId.trim(),
              }
            : null,
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
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.18em] text-[#7a5244]">
            Secure Checkout
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-[#2e221d] sm:text-4xl">
            Complete Your Order
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-neutral-600 sm:text-base">
            Fill in your delivery details, choose a payment method, and review
            your items before confirming the order.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[28px] border border-[#ead9d1] bg-white p-5 shadow-sm sm:p-6 lg:p-7">
            <div className="mb-5 border-b border-[#f1e4de] pb-4">
              <h2 className="text-xl font-semibold text-[#2e221d] sm:text-2xl">
                Delivery Information
              </h2>
              <p className="mt-1.5 text-sm text-neutral-600">
                Please enter accurate contact and address details.
              </p>
            </div>

            {errors.form ? (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {errors.form}
              </div>
            ) : null}

            <form onSubmit={handlePlaceOrder} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-[#2e221d]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-[#ead9d1] bg-[#fffdfb] px-4 py-3 outline-none transition focus:border-[#c9aa99]"
                  />
                  {errors.name ? (
                    <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>
                  ) : null}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#2e221d]">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="01XXXXXXXXX"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-[#ead9d1] bg-[#fffdfb] px-4 py-3 outline-none transition focus:border-[#c9aa99]"
                  />
                  {errors.phone ? (
                    <p className="mt-1.5 text-sm text-red-600">{errors.phone}</p>
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
                    className="w-full rounded-2xl border border-[#ead9d1] bg-[#fffdfb] px-4 py-3 outline-none transition focus:border-[#c9aa99]"
                  />
                  {errors.city ? (
                    <p className="mt-1.5 text-sm text-red-600">{errors.city}</p>
                  ) : null}
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-[#2e221d]">
                    Full Address
                  </label>
                  <textarea
                    name="address"
                    placeholder="House, road, area, landmark"
                    value={form.address}
                    onChange={handleChange}
                    rows={4}
                    className="w-full rounded-2xl border border-[#ead9d1] bg-[#fffdfb] px-4 py-3 outline-none transition focus:border-[#c9aa99]"
                  />
                  {errors.address ? (
                    <p className="mt-1.5 text-sm text-red-600">{errors.address}</p>
                  ) : null}
                </div>
              </div>

              <div className="border-t border-[#f1e4de] pt-5">
                <h3 className="mb-3 text-base font-semibold text-[#2e221d] sm:text-lg">
                  Payment Method
                </h3>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Cash on Delivery")}
                    className={`relative flex min-h-[82px] items-center gap-3 rounded-[18px] border px-4 py-3 text-left transition ${
                      paymentMethod === "Cash on Delivery"
                        ? "border-[#f4a024] bg-[#fff8ee] shadow-[0_8px_20px_rgba(244,160,36,0.10)]"
                        : "border-[#e7d8cf] bg-white hover:bg-[#fcf8f6]"
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#fff1df]">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5 text-[#c97d12]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="6" width="18" height="12" rx="2" />
                        <path d="M3 10h18" />
                        <path d="M7 15h2" />
                      </svg>
                    </div>

                    <div className="min-w-0">
                      <p className="text-[15px] font-semibold text-[#2e221d]">
                        Cash On Delivery
                      </p>
                      <p className="mt-1 text-xs text-neutral-500">
                        Pay after delivery
                      </p>
                    </div>

                    {paymentMethod === "Cash on Delivery" ? (
                      <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#f4a024] text-[11px] font-bold text-white">
                        ✓
                      </div>
                    ) : null}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("bKash")}
                    className={`relative flex min-h-[82px] items-center gap-3 rounded-[18px] border px-4 py-3 text-left transition ${
                      paymentMethod === "bKash"
                        ? "border-[#f4a024] bg-[#fff8ee] shadow-[0_8px_20px_rgba(244,160,36,0.10)]"
                        : "border-[#e7d8cf] bg-white hover:bg-[#fcf8f6]"
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#ffe7f3] text-sm font-bold text-[#e2136e]">
                      bK
                    </div>

                    <div className="min-w-0">
                      <p className="text-[15px] font-semibold text-[#2e221d]">
                        bKash
                      </p>
                      <p className="mt-1 text-xs text-neutral-500">
                        Manual verification
                      </p>
                    </div>

                    {paymentMethod === "bKash" ? (
                      <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#f4a024] text-[11px] font-bold text-white">
                        ✓
                      </div>
                    ) : null}
                  </button>
                </div>

                {paymentMethod === "bKash" ? (
                  <div className="mt-4 rounded-[18px] border border-[#ead9d1] bg-[#fffaf6] p-4">
                    <p className="text-sm font-semibold text-[#2e221d]">
                      bKash Payment Details
                    </p>
                    <p className="mt-2 text-sm text-neutral-700">
                      Send payment to:{" "}
                      <span className="font-medium">01XXXXXXXXX</span>
                    </p>
                    <p className="mt-2 text-sm text-neutral-600">
                      After sending payment, fill the sender number and
                      transaction ID below.
                    </p>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#2e221d]">
                          Sender Number
                        </label>
                        <input
                          type="text"
                          name="bkashNumber"
                          placeholder="01XXXXXXXXX"
                          value={form.bkashNumber}
                          onChange={handleChange}
                          className="w-full rounded-2xl border border-[#ead9d1] bg-white px-4 py-3 outline-none transition focus:border-[#c9aa99]"
                        />
                        {errors.bkashNumber ? (
                          <p className="mt-1.5 text-sm text-red-600">
                            {errors.bkashNumber}
                          </p>
                        ) : null}
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#2e221d]">
                          Transaction ID
                        </label>
                        <input
                          type="text"
                          name="trxId"
                          placeholder="Enter transaction ID"
                          value={form.trxId}
                          onChange={handleChange}
                          className="w-full rounded-2xl border border-[#ead9d1] bg-white px-4 py-3 outline-none transition focus:border-[#c9aa99]"
                        />
                        {errors.trxId ? (
                          <p className="mt-1.5 text-sm text-red-600">
                            {errors.trxId}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={
                  submitting || cartItems.length === 0 || hasLocalInvalidStockItem
                }
                className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-[#2e221d] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#7a5244] disabled:cursor-not-allowed disabled:opacity-60"
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

          <div className="space-y-5">
            <div className="rounded-[28px] border border-[#ead9d1] bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-4 border-b border-[#f1e4de] pb-4">
                <h2 className="text-xl font-semibold text-[#2e221d] sm:text-2xl">
                  Order Summary
                </h2>
                <p className="mt-1.5 text-sm text-neutral-600">
                  Review your order before confirming.
                </p>
              </div>

              {cartItems.length === 0 ? (
                <div className="rounded-2xl border border-[#ead9d1] bg-[#fdf9f7] p-5 text-sm text-neutral-600">
                  Your cart is empty.
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item) => {
                    const currentStock =
                      typeof item.stock === "number" ? item.stock : null;
                    const hasKnownStock = currentStock !== null;
                    const isOutOfStock =
                      currentStock !== null && currentStock <= 0;
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
                          <p className="mt-2.5 text-xs font-medium text-red-600">
                            This item is out of stock.
                          </p>
                        ) : exceedsStock ? (
                          <p className="mt-2.5 text-xs font-medium text-red-600">
                            Quantity exceeds current stock.
                          </p>
                        ) : null}
                      </div>
                    );
                  })}

                  <div className="rounded-2xl border border-[#ead9d1] bg-[#fffdfb] p-4">
                    <div className="mb-2.5 flex items-center justify-between text-sm">
                      <span className="text-neutral-600">Items Total</span>
                      <span className="font-medium">{cartTotal} BDT</span>
                    </div>

                    <div className="mb-2.5 flex items-center justify-between text-sm">
                      <span className="text-neutral-600">Shipping</span>
                      <span className="font-medium">{shipping} BDT</span>
                    </div>

                    <div className="mb-2.5 flex items-center justify-between text-sm">
                      <span className="text-neutral-600">Payment</span>
                      <span className="font-medium">{paymentMethod}</span>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#ead9d1] pt-3 text-base font-semibold text-[#2e221d]">
                      <span>Grand Total</span>
                      <span>{grandTotal} BDT</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-[28px] border border-[#ead9d1] bg-white p-5 shadow-sm sm:p-6">
              <h3 className="text-lg font-semibold text-[#2e221d]">
                Delivery Notes
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-neutral-600">
                <li>• Keep your phone active for delivery confirmation.</li>
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