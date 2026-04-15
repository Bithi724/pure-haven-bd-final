"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type OrderStatus = "pending" | "confirmed" | "delivered" | "cancelled";

type ApiOrder = {
  id: string;
  orderId?: string;
  customer: {
    name: string;
    phone: string;
    city?: string;
    address: string;
  };
  items: Array<{
    id: number;
    productId?: number;
    name: string;
    price: number;
    image: string;
    category: string;
    quantity: number;
  }>;
  subtotal?: number;
  deliveryFee?: number;
  total?: number;
  status: string;
  paymentMethod?: string;
  createdAt: string;
  updatedAt?: string;
};

type UiOrder = {
  id: string;
  customer: {
    name: string;
    phone: string;
    city: string;
    address: string;
  };
  items: Array<{
    id: number;
    productId?: number;
    name: string;
    price: number;
    image: string;
    category: string;
    quantity: number;
  }>;
  itemsTotal: number;
  shipping: number;
  grandTotal: number;
  status: OrderStatus;
  createdAt: string;
};

type OrderGetResponse = {
  success: boolean;
  order?: ApiOrder;
  message?: string;
};

function normalizeStatus(value: string | null | undefined): OrderStatus {
  if (
    value === "pending" ||
    value === "confirmed" ||
    value === "delivered" ||
    value === "cancelled"
  ) {
    return value;
  }

  return "pending";
}

function normalizeOrder(order: ApiOrder): UiOrder {
  return {
    id: order.orderId || order.id,
    customer: {
      name: order.customer?.name || "",
      phone: order.customer?.phone || "",
      city: order.customer?.city || "",
      address: order.customer?.address || "",
    },
    items: Array.isArray(order.items) ? order.items : [],
    itemsTotal: Number(order.subtotal ?? 0),
    shipping: Number(order.deliveryFee ?? 0),
    grandTotal: Number(order.total ?? 0),
    status: normalizeStatus(order.status),
    createdAt: order.createdAt,
  };
}

function getStatusLabel(status: OrderStatus) {
  switch (status) {
    case "pending":
      return "Pending";
    case "confirmed":
      return "Confirmed";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    default:
      return "Pending";
  }
}

function getStatusClasses(status: OrderStatus) {
  switch (status) {
    case "pending":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "confirmed":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "delivered":
      return "border-green-200 bg-green-50 text-green-700";
    case "cancelled":
      return "border-red-200 bg-red-50 text-red-700";
    default:
      return "border-amber-200 bg-amber-50 text-amber-700";
  }
}

export default function OrderSuccessPage() {
  const [order, setOrder] = useState<UiOrder | null>(null);
  const [checked, setChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadOrder() {
      try {
        const params = new URLSearchParams(window.location.search);
        const orderIdFromUrl = params.get("orderId");

        if (!orderIdFromUrl) {
          setOrder(null);
          setChecked(true);
          return;
        }

        const res = await fetch(
          `/api/orders?orderId=${encodeURIComponent(orderIdFromUrl)}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data = (await res.json()) as OrderGetResponse;

        if (!res.ok || !data.success || !data.order) {
          setOrder(null);
          setErrorMessage(data.message || "No valid order was found.");
          setChecked(true);
          return;
        }

        setOrder(normalizeOrder(data.order));
        setChecked(true);
      } catch (error) {
        console.error("Failed to load order:", error);
        setOrder(null);
        setErrorMessage("Failed to verify your order.");
        setChecked(true);
      }
    }

    loadOrder();
  }, []);

  const formattedDate = useMemo(() => {
    if (!order?.createdAt) return "";
    const date = new Date(order.createdAt);

    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleString();
  }, [order]);

  return (
    <main>
      <TopBar />
      <Navbar />

      <section className="container-ph section-gap">
        {!checked ? (
          <div className="surface-soft mx-auto max-w-2xl p-10 text-center">
            <h1 className="text-3xl font-semibold">Loading order...</h1>
            <p className="mt-4 text-neutral-600">
              Please wait while we verify your order.
            </p>
          </div>
        ) : !order ? (
          <div className="empty-state mx-auto max-w-2xl">
            <h1 className="text-3xl font-semibold">No recent order found</h1>
            <p className="mt-4 text-neutral-600">
              {errorMessage || "This page is only available after a valid order is placed."}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/shop" className="btn-primary">
                Go to Shop
              </Link>
              <Link
                href="/cart"
                className="rounded-full border border-[#ead9d1] px-6 py-3 font-medium hover:bg-[#f8f3ef]"
              >
                Back to Cart
              </Link>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-5xl space-y-8">
            <div className="surface-soft p-8 text-center md:p-10">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-green-200 bg-green-50 text-3xl text-green-700">
                ✓
              </div>

              <h1 className="mt-6 text-4xl font-semibold text-[#2e221d]">
                Order Placed Successfully
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-neutral-600">
                Thank you for shopping with Pure Haven BD. Your order has been
                received successfully and is now in our system.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <span className="rounded-full border border-[#ead9d1] bg-[#f8f3ef] px-4 py-2 text-sm font-medium">
                  Order ID: {order.id}
                </span>
                <span
                  className={`rounded-full border px-4 py-2 text-sm font-medium ${getStatusClasses(
                    order.status
                  )}`}
                >
                  Status: {getStatusLabel(order.status)}
                </span>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.9fr]">
              <div className="surface-soft p-6 md:p-8">
                <h2 className="section-title">Order Details</h2>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-[#ead9d1] bg-[#fffdfb] p-4">
                    <p className="text-sm text-neutral-500">Order ID</p>
                    <p className="mt-2 font-semibold text-[#2e221d]">
                      {order.id}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#ead9d1] bg-[#fffdfb] p-4">
                    <p className="text-sm text-neutral-500">Date</p>
                    <p className="mt-2 font-semibold text-[#2e221d]">
                      {formattedDate || "N/A"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#ead9d1] bg-[#fffdfb] p-4">
                    <p className="text-sm text-neutral-500">Customer Name</p>
                    <p className="mt-2 font-semibold text-[#2e221d]">
                      {order.customer.name}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#ead9d1] bg-[#fffdfb] p-4">
                    <p className="text-sm text-neutral-500">Phone Number</p>
                    <p className="mt-2 font-semibold text-[#2e221d]">
                      {order.customer.phone}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-[#ead9d1] bg-[#fffdfb] p-5">
                  <h3 className="text-lg font-semibold text-[#2e221d]">
                    Delivery Address
                  </h3>

                  <div className="mt-4 space-y-2 text-sm text-neutral-700">
                    <p>
                      <span className="font-semibold">City:</span>{" "}
                      {order.customer.city || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Address:</span>{" "}
                      {order.customer.address}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="surface-soft p-6">
                  <h2 className="text-2xl font-semibold text-[#2e221d]">
                    Payment Summary
                  </h2>

                  <div className="mt-5 space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600">Items Total</span>
                      <span className="font-medium">{order.itemsTotal} BDT</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600">Shipping</span>
                      <span className="font-medium">{order.shipping} BDT</span>
                    </div>

                    <div className="border-t border-[#ead9d1] pt-3 text-base font-semibold">
                      <div className="flex items-center justify-between">
                        <span>Grand Total</span>
                        <span>{order.grandTotal} BDT</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="surface-soft p-5">
                  <h3 className="text-lg font-semibold text-[#2e221d]">
                    What happens next?
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm text-neutral-600">
                    <li>• Your order is now saved in our system.</li>
                    <li>• Our team may contact you on your provided phone number.</li>
                    <li>• Delivery details will follow based on stock and location.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="surface-soft p-6 md:p-8">
              <h2 className="section-title">Ordered Items</h2>

              <div className="mt-6 space-y-4">
                {order.items.map((item) => (
                  <div
                    key={`${order.id}-${item.id}`}
                    className="flex flex-col gap-4 rounded-2xl border border-[#ead9d1] bg-[#fffdfb] p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 overflow-hidden rounded-2xl border border-[#ead9d1] bg-[#f8f3ef]">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/300x300?text=No+Image";
                          }}
                        />
                      </div>

                      <div>
                        <p className="font-medium text-[#2e221d]">{item.name}</p>
                        <p className="mt-1 text-sm text-neutral-500">
                          {item.quantity} × {item.price} BDT
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[#7a5244]">
                          {item.category}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm font-semibold text-[#2e221d]">
                      {item.quantity * item.price} BDT
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/shop" className="btn-primary">
                Continue Shopping
              </Link>
              <Link
                href="/"
                className="rounded-full border border-[#ead9d1] px-6 py-3 font-medium hover:bg-[#f8f3ef]"
              >
                Back to Home
              </Link>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}