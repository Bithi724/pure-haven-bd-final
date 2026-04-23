"use client";

import { useEffect, useMemo, useState } from "react";
import AdminNav from "@/components/admin/AdminNav";

type OrderStatus = "pending" | "confirmed" | "delivered" | "cancelled";
type PaymentStatus = "pending" | "awaiting_verification" | "paid" | "rejected";

type Order = {
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
  paymentStatus?: string;
  paymentDetails?: {
    provider?: string;
    senderNumber?: string;
    trxId?: string;
  } | null;
  createdAt: string;
};

type OrdersResponse = {
  success: boolean;
  orders?: Order[];
  message?: string;
};

type UpdateResponse = {
  success: boolean;
  order?: Order;
  message?: string;
};

function normalizeOrderStatus(value?: string): OrderStatus {
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

function normalizePaymentStatus(value?: string): PaymentStatus {
  if (
    value === "pending" ||
    value === "awaiting_verification" ||
    value === "paid" ||
    value === "rejected"
  ) {
    return value;
  }
  return "pending";
}

function orderBadge(status: OrderStatus) {
  switch (status) {
    case "pending":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "confirmed":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "delivered":
      return "border-green-200 bg-green-50 text-green-700";
    case "cancelled":
      return "border-red-200 bg-red-50 text-red-700";
  }
}

function paymentBadge(status: PaymentStatus) {
  switch (status) {
    case "awaiting_verification":
      return "border-purple-200 bg-purple-50 text-purple-700";
    case "paid":
      return "border-green-200 bg-green-50 text-green-700";
    case "rejected":
      return "border-red-200 bg-red-50 text-red-700";
    case "pending":
    default:
      return "border-amber-200 bg-amber-50 text-amber-700";
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  async function loadOrders() {
    try {
      setError("");
      setLoading(true);

      const res = await fetch("/api/orders", { cache: "no-store" });
      const data = (await res.json()) as OrdersResponse;

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load orders.");
      }

      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function updateOrder(
    rowId: string,
    payload: { status?: OrderStatus; paymentStatus?: PaymentStatus }
  ) {
    try {
      setBusyKey(
        `${rowId}-${payload.status ? "order" : "payment"}-${payload.status || payload.paymentStatus}`
      );
      setError("");

      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: rowId,
          ...payload,
        }),
      });

      const data = (await res.json()) as UpdateResponse;

      if (!res.ok || !data.success || !data.order) {
        throw new Error(data.message || "Failed to update order.");
      }

      setOrders((current) =>
        current.map((order) =>
          order.id === rowId || order.orderId === rowId ? data.order! : order
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update order.");
    } finally {
      setBusyKey("");
    }
  }

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return orders;

    return orders.filter((order) =>
      [
        order.orderId || order.id,
        order.customer?.name || "",
        order.customer?.phone || "",
        order.customer?.city || "",
        order.paymentMethod || "",
        order.paymentStatus || "",
        order.paymentDetails?.senderNumber || "",
        order.paymentDetails?.trxId || "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [orders, search]);

  return (
    <main className="min-h-screen bg-[#fcf8f6] px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <AdminNav />

        <div className="rounded-[28px] border border-[#ead9d1] bg-white p-6 shadow-sm md:p-8">
          <h1 className="text-3xl font-semibold text-[#2e221d]">Orders</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Manage delivery status and verify bKash payments from one place.
          </p>

          <div className="mt-5">
            <input
              type="text"
              placeholder="Search by order ID, customer, phone, payment, trxID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-[#ead9d1] px-4 py-3 outline-none"
            />
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-[28px] border border-[#ead9d1] bg-white p-6 shadow-sm">
            <p className="text-sm text-neutral-600">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-[28px] border border-[#ead9d1] bg-white p-6 shadow-sm">
            <p className="text-sm text-neutral-600">No orders found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const orderStatus = normalizeOrderStatus(order.status);
              const payStatus = normalizePaymentStatus(order.paymentStatus);
              const isBkash = (order.paymentMethod || "")
                .toLowerCase()
                .includes("bkash");
              const rowId = order.orderId || order.id;

              return (
                <div
                  key={rowId}
                  className="rounded-[24px] border border-[#ead9d1] bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold text-[#2e221d]">
                          {rowId}
                        </h2>
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${orderBadge(
                            orderStatus
                          )}`}
                        >
                          Order: {orderStatus}
                        </span>
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${paymentBadge(
                            payStatus
                          )}`}
                        >
                          Payment: {payStatus}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-neutral-600">
                        {order.customer?.name} • {order.customer?.phone}
                      </p>
                      <p className="mt-1 text-sm text-neutral-600">
                        {order.customer?.city || "[not available]"} •{" "}
                        {order.customer?.address}
                      </p>
                      <p className="mt-1 text-sm text-neutral-600">
                        Method: {order.paymentMethod || "Cash on Delivery"}
                      </p>
                      <p className="mt-1 text-sm text-neutral-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>

                      {isBkash && order.paymentDetails ? (
                        <div className="mt-3 rounded-xl border border-[#ead9d1] bg-[#fffaf6] p-3 text-sm text-neutral-700">
                          <p>
                            Sender Number:{" "}
                            {order.paymentDetails.senderNumber || "[not available]"}
                          </p>
                          <p>
                            Transaction ID:{" "}
                            {order.paymentDetails.trxId || "[not available]"}
                          </p>
                        </div>
                      ) : null}
                    </div>

                    <div className="grid gap-3 lg:min-w-[360px]">
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-neutral-500">
                          Order Status
                        </p>
                        <select
                          value={orderStatus}
                          disabled={busyKey.startsWith(`${rowId}-order`)}
                          onChange={(e) =>
                            updateOrder(rowId, {
                              status: normalizeOrderStatus(e.target.value),
                            })
                          }
                          className="w-full rounded-2xl border border-[#ead9d1] px-4 py-3 outline-none disabled:opacity-60"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-neutral-500">
                          Payment Verification
                        </p>

                        {isBkash ? (
                          <div className="grid gap-2 sm:grid-cols-3">
                            <button
                              type="button"
                              disabled={busyKey !== "" && !busyKey.startsWith(`${rowId}-payment-paid`)}
                              onClick={() => updateOrder(rowId, { paymentStatus: "paid" })}
                              className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 hover:bg-green-100 disabled:opacity-60"
                            >
                              Mark Paid
                            </button>

                            <button
                              type="button"
                              disabled={busyKey !== "" && !busyKey.startsWith(`${rowId}-payment-rejected`)}
                              onClick={() => updateOrder(rowId, { paymentStatus: "rejected" })}
                              className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-60"
                            >
                              Reject
                            </button>

                            <button
                              type="button"
                              disabled={busyKey !== "" && !busyKey.startsWith(`${rowId}-payment-awaiting_verification`)}
                              onClick={() =>
                                updateOrder(rowId, {
                                  paymentStatus: "awaiting_verification",
                                })
                              }
                              className="rounded-2xl border border-purple-200 bg-purple-50 px-4 py-3 text-sm font-medium text-purple-700 hover:bg-purple-100 disabled:opacity-60"
                            >
                              Pending
                            </button>
                          </div>
                        ) : (
                          <div className="rounded-2xl border border-[#ead9d1] bg-[#faf7f4] px-4 py-3 text-sm text-neutral-600">
                            No manual payment verification needed.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <div className="rounded-2xl border border-[#f1e4de] p-4">
                      <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">
                        Items
                      </p>
                      <p className="mt-2 text-lg font-semibold">
                        {order.items?.length || 0}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-[#f1e4de] p-4">
                      <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">
                        Subtotal
                      </p>
                      <p className="mt-2 text-lg font-semibold">
                        {Number(order.subtotal || 0)} BDT
                      </p>
                    </div>

                    <div className="rounded-2xl border border-[#f1e4de] p-4">
                      <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">
                        Grand Total
                      </p>
                      <p className="mt-2 text-lg font-semibold">
                        {Number(order.total || 0)} BDT
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-[#f1e4de] p-4">
                    <h3 className="mb-3 font-semibold text-[#2e221d]">
                      Ordered Items
                    </h3>

                    <div className="space-y-3">
                      {(order.items || []).map((item, index) => (
                        <div
                          key={`${rowId}-${item.id}-${index}`}
                          className="flex items-center justify-between gap-4"
                        >
                          <div className="min-w-0">
                            <p className="font-medium text-[#2e221d]">
                              {item.name}
                            </p>
                            <p className="text-sm text-neutral-500">
                              {item.category} • Qty: {item.quantity}
                            </p>
                          </div>

                          <p className="shrink-0 text-sm font-medium text-[#2e221d]">
                            {item.price * item.quantity} BDT
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}