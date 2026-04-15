"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";

type OrderStatus = "pending" | "confirmed" | "delivered" | "cancelled";

type ApiOrderItem = {
  id: number;
  productId?: number;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
};

type ApiOrder = {
  id: string;
  orderId?: string;
  customer: {
    name: string;
    phone: string;
    city?: string;
    address: string;
  };
  items: ApiOrderItem[];
  subtotal?: number;
  deliveryFee?: number;
  total?: number;
  itemsTotal?: number;
  shipping?: number;
  grandTotal?: number;
  status: string;
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
  items: ApiOrderItem[];
  itemsTotal: number;
  shipping: number;
  grandTotal: number;
  status: OrderStatus;
  createdAt: string;
};

type OrdersGetResponse = {
  success: boolean;
  orders?: ApiOrder[];
  message?: string;
};

type OrderMutationResponse = {
  success: boolean;
  order?: ApiOrder;
  message?: string;
};

function getStatusClasses(status: OrderStatus) {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "confirmed":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "delivered":
      return "bg-green-50 text-green-700 border-green-200";
    case "cancelled":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-neutral-50 text-neutral-700 border-neutral-200";
  }
}

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

function normalizeStatusFilter(value: string | null): "all" | OrderStatus {
  if (
    value === "pending" ||
    value === "confirmed" ||
    value === "delivered" ||
    value === "cancelled"
  ) {
    return value;
  }

  return "all";
}

function escapeCsv(value: string | number) {
  const text = String(value ?? "");
  const escaped = text.replace(/"/g, '""');
  return `"${escaped}"`;
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
    itemsTotal: Number(order.subtotal ?? order.itemsTotal ?? 0),
    shipping: Number(order.deliveryFee ?? order.shipping ?? 0),
    grandTotal: Number(order.total ?? order.grandTotal ?? 0),
    status: normalizeStatus(order.status),
    createdAt: order.createdAt,
  };
}

export default function AdminOrdersPage() {
  const searchParams = useSearchParams();

  const [orders, setOrders] = useState<UiOrder[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading orders...");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [updatingOrderId, setUpdatingOrderId] = useState("");
  const [deletingOrderId, setDeletingOrderId] = useState("");

  useEffect(() => {
    const initialSearch = searchParams.get("search") || "";
    const initialStatusFilter = normalizeStatusFilter(
      searchParams.get("statusFilter")
    );

    setSearch(initialSearch);
    setStatusFilter(initialStatusFilter);
  }, [searchParams]);

  async function fetchOrders() {
    try {
      setError("");
      setLoadingMessage("Loading orders...");

      const res = await fetch("/api/orders", {
        method: "GET",
        cache: "no-store",
      });

      const data = (await res.json()) as OrdersGetResponse;

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch orders.");
      }

      const nextOrders = Array.isArray(data.orders)
        ? data.orders.map(normalizeOrder)
        : [];

      setOrders(nextOrders);
    } catch (err) {
      setOrders([]);
      setError(
        err instanceof Error ? err.message : "Failed to load orders."
      );
    } finally {
      setLoaded(true);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const allOrdersCount = orders.length;
  const pendingCount = orders.filter((order) => order.status === "pending").length;
  const deliveredCount = orders.filter(
    (order) => order.status === "delivered"
  ).length;
  const cancelledCount = orders.filter(
    (order) => order.status === "cancelled"
  ).length;

  const filteredOrders = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch = keyword
        ? [
            order.id,
            order.customer.name,
            order.customer.phone,
            order.customer.city,
          ]
            .join(" ")
            .toLowerCase()
            .includes(keyword)
        : true;

      const matchesStatus =
        statusFilter === "all" ? true : order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const totalOrders = filteredOrders.length;

  const totalRevenue = useMemo(() => {
    return filteredOrders
      .filter((order) => order.status !== "cancelled")
      .reduce((sum, order) => sum + order.grandTotal, 0);
  }, [filteredOrders]);

  async function handleStatusChange(orderId: string, nextStatus: OrderStatus) {
    const previousOrders = orders;

    setUpdatingOrderId(orderId);
    setError("");

    setOrders((current) =>
      current.map((order) =>
        order.id === orderId ? { ...order, status: nextStatus } : order
      )
    );

    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: orderId,
          status: nextStatus,
        }),
      });

      const data = (await res.json()) as OrderMutationResponse;

      if (!res.ok || !data.success || !data.order) {
        throw new Error(data.message || "Failed to update order status.");
      }

      const updatedOrder = normalizeOrder(data.order);

      setOrders((current) =>
        current.map((order) =>
          order.id === orderId ? updatedOrder : order
        )
      );
    } catch (err) {
      setOrders(previousOrders);
      setError(
        err instanceof Error ? err.message : "Failed to update order status."
      );
    } finally {
      setUpdatingOrderId("");
    }
  }

  async function handleDeleteOrder(orderId: string) {
    const confirmed = window.confirm("এই order delete করতে চাও?");
    if (!confirmed) return;

    const previousOrders = orders;

    setDeletingOrderId(orderId);
    setError("");

    setOrders((current) => current.filter((order) => order.id !== orderId));

    try {
      const res = await fetch(`/api/orders?id=${encodeURIComponent(orderId)}`, {
        method: "DELETE",
      });

      const data = (await res.json()) as OrderMutationResponse;

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete order.");
      }
    } catch (err) {
      setOrders(previousOrders);
      setError(err instanceof Error ? err.message : "Failed to delete order.");
    } finally {
      setDeletingOrderId("");
    }
  }

  function handleExportCsv() {
    if (filteredOrders.length === 0) return;

    const headers = [
      "Order ID",
      "Customer Name",
      "Phone",
      "City",
      "Address",
      "Status",
      "Items Count",
      "Items Total",
      "Shipping",
      "Grand Total",
      "Created At",
    ];

    const rows = filteredOrders.map((order) => [
      escapeCsv(order.id),
      escapeCsv(order.customer.name),
      escapeCsv(order.customer.phone),
      escapeCsv(order.customer.city),
      escapeCsv(order.customer.address),
      escapeCsv(order.status),
      escapeCsv(order.items.length),
      escapeCsv(order.itemsTotal),
      escapeCsv(order.shipping),
      escapeCsv(order.grandTotal),
      escapeCsv(new Date(order.createdAt).toLocaleString()),
    ]);

    const csvContent = [
      headers.map(escapeCsv).join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const now = new Date();
    const safeDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(now.getDate()).padStart(2, "0")}`;

    link.href = url;
    link.download = `orders-${statusFilter}-${safeDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-[#fcf8f6] px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <AdminNav />

        <div className="rounded-[28px] border border-[#ead9d1] bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-[#2e221d]">Orders</h1>
              <p className="mt-2 text-sm text-neutral-600">
                Checkout থেকে আসা সব order এখানে দেখা যাবে।
              </p>
            </div>

            <button
              type="button"
              onClick={handleExportCsv}
              disabled={filteredOrders.length === 0}
              className="rounded-full border border-[#ead9d1] px-5 py-2 text-sm hover:bg-[#f8f3ef] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Export CSV
            </button>
          </div>
        </div>

        {error ? (
          <div className="rounded-[24px] border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
            {error}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Link
            href="/admin/orders"
            className="block rounded-[24px] border border-[#ead9d1] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-sm text-neutral-500">All Orders</p>
            <h2 className="mt-2 text-3xl font-semibold">{allOrdersCount}</h2>
          </Link>

          <Link
            href="/admin/orders?statusFilter=pending"
            className="block rounded-[24px] border border-[#ead9d1] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-sm text-neutral-500">Pending</p>
            <h2 className="mt-2 text-3xl font-semibold text-amber-700">
              {pendingCount}
            </h2>
          </Link>

          <Link
            href="/admin/orders?statusFilter=delivered"
            className="block rounded-[24px] border border-[#ead9d1] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-sm text-neutral-500">Delivered</p>
            <h2 className="mt-2 text-3xl font-semibold text-green-700">
              {deliveredCount}
            </h2>
          </Link>

          <Link
            href="/admin/orders?statusFilter=cancelled"
            className="block rounded-[24px] border border-[#ead9d1] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-sm text-neutral-500">Cancelled</p>
            <h2 className="mt-2 text-3xl font-semibold text-red-600">
              {cancelledCount}
            </h2>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[24px] border border-[#ead9d1] bg-white p-5 shadow-sm">
            <p className="text-sm text-neutral-500">Visible Orders</p>
            <h2 className="mt-2 text-3xl font-semibold">{totalOrders}</h2>
          </div>

          <div className="rounded-[24px] border border-[#ead9d1] bg-white p-5 shadow-sm">
            <p className="text-sm text-neutral-500">Visible Revenue</p>
            <h2 className="mt-2 text-3xl font-semibold">{totalRevenue} BDT</h2>
          </div>
        </div>

        <div className="grid gap-4 rounded-[24px] border border-[#ead9d1] bg-white p-5 shadow-sm md:grid-cols-[1.4fr_220px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, phone, name, city"
            className="w-full rounded-2xl border border-[#ead9d1] px-4 py-3 outline-none"
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "all" | OrderStatus)
            }
            className="w-full rounded-2xl border border-[#ead9d1] px-4 py-3 outline-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {!loaded ? (
          <div className="rounded-[24px] border border-[#ead9d1] bg-white p-8 shadow-sm">
            <p>{loadingMessage}</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-[24px] border border-[#ead9d1] bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-semibold">No matching orders found</h2>
            <p className="mt-2 text-neutral-600">
              Search বা filter change করে আবার দেখো।
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredOrders.map((order) => {
              const isUpdating = updatingOrderId === order.id;
              const isDeleting = deletingOrderId === order.id;
              const isBusy = isUpdating || isDeleting;

              return (
                <div
                  key={order.id}
                  className="rounded-[24px] border border-[#ead9d1] bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-semibold">{order.id}</h3>
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${getStatusClasses(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="mt-3 space-y-1 text-sm text-neutral-600">
                        <p>
                          <span className="font-medium text-neutral-800">Name:</span>{" "}
                          {order.customer.name}
                        </p>
                        <p>
                          <span className="font-medium text-neutral-800">Phone:</span>{" "}
                          {order.customer.phone}
                        </p>
                        <p>
                          <span className="font-medium text-neutral-800">City:</span>{" "}
                          {order.customer.city || "—"}
                        </p>
                        <p>
                          <span className="font-medium text-neutral-800">Address:</span>{" "}
                          {order.customer.address}
                        </p>
                        <p>
                          <span className="font-medium text-neutral-800">Date:</span>{" "}
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 lg:min-w-[240px]">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value as OrderStatus)
                        }
                        disabled={isBusy}
                        className="rounded-2xl border border-[#ead9d1] px-4 py-3 outline-none disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => handleDeleteOrder(order.id)}
                        disabled={isBusy}
                        className="rounded-2xl border border-red-200 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isDeleting ? "Deleting..." : "Delete Order"}
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 rounded-[20px] border border-[#f1e4de] p-4">
                    <h4 className="text-lg font-semibold">Items</h4>

                    <div className="mt-4 space-y-3">
                      {order.items.map((item) => (
                        <div
                          key={`${order.id}-${item.id}`}
                          className="flex items-start justify-between gap-4 border-b border-[#f5ebe6] pb-3 last:border-b-0 last:pb-0"
                        >
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-neutral-500">
                              {item.quantity} × {item.price} BDT
                            </p>
                            <p className="text-xs uppercase tracking-[0.12em] text-[#7a5244]">
                              {item.category}
                            </p>
                          </div>

                          <p className="text-sm font-medium">
                            {item.quantity * item.price} BDT
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 border-t border-[#ead9d1] pt-4 text-sm">
                      <div className="mb-2 flex items-center justify-between">
                        <span>Items Total</span>
                        <span>{order.itemsTotal} BDT</span>
                      </div>
                      <div className="mb-2 flex items-center justify-between">
                        <span>Shipping</span>
                        <span>{order.shipping} BDT</span>
                      </div>
                      <div className="flex items-center justify-between text-base font-semibold">
                        <span>Grand Total</span>
                        <span>{order.grandTotal} BDT</span>
                      </div>
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