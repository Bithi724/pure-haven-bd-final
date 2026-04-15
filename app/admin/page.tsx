"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AdminNav from "@/components/admin/AdminNav";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  subcategory?: string;
  description?: string;
  stock?: number;
};

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

type OrdersGetResponse = {
  success: boolean;
  orders?: ApiOrder[];
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

function getSafeStock(stock: unknown) {
  const value = Number(stock);
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<UiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setError("");

        const [productRes, orderRes] = await Promise.all([
          fetch("/api/products", { cache: "no-store" }),
          fetch("/api/orders", { cache: "no-store" }),
        ]);

        const productData = productRes.ok ? await productRes.json() : [];
        const orderData = orderRes.ok
          ? ((await orderRes.json()) as OrdersGetResponse)
          : { success: false, orders: [] };

        setProducts(Array.isArray(productData) ? productData : []);

        const normalizedOrders =
          orderData.success && Array.isArray(orderData.orders)
            ? orderData.orders.map(normalizeOrder)
            : [];

        setOrders(normalizedOrders);
      } catch {
        setProducts([]);
        setOrders([]);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const totalProducts = products.length;
  const totalOrders = orders.length;

  const pendingOrders = useMemo(
    () => orders.filter((order) => order.status === "pending").length,
    [orders]
  );

  const totalRevenue = useMemo(() => {
    return orders
      .filter((order) => order.status !== "cancelled")
      .reduce((sum, order) => sum + order.grandTotal, 0);
  }, [orders]);

  const lowStockProducts = useMemo(() => {
    return products.filter((product) => {
      const stock = getSafeStock(product.stock);
      return stock > 0 && stock <= 5;
    });
  }, [products]);

  const outOfStockProducts = useMemo(() => {
    return products.filter((product) => {
      const stock = getSafeStock(product.stock);
      return stock <= 0;
    });
  }, [products]);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);
  }, [orders]);

  return (
    <main className="min-h-screen bg-[#fcf8f6] px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <AdminNav />

        <div className="rounded-[28px] border border-[#ead9d1] bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-[#2e221d]">
                Admin Dashboard
              </h1>
              <p className="mt-2 text-sm text-neutral-600">
                Products, orders, revenue, and stock overview in one place.
              </p>
            </div>

            <Link
              href="/admin/products#product-form"
              className="rounded-full border border-[#ead9d1] px-4 py-2 text-sm font-medium hover:bg-[#f8f3ef]"
            >
              Add Product
            </Link>
          </div>
        </div>

        {error ? (
          <div className="rounded-[24px] border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-[28px] border border-[#ead9d1] bg-white p-8 shadow-sm">
            <p className="text-sm text-neutral-600">Loading dashboard...</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Link
                href="/admin/products"
                className="block rounded-[24px] border border-[#ead9d1] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="text-sm text-neutral-500">Total Products</p>
                <h2 className="mt-2 text-3xl font-semibold">{totalProducts}</h2>
                <p className="mt-3 text-sm text-[#7a5244]">Open products →</p>
              </Link>

              <Link
                href="/admin/orders"
                className="block rounded-[24px] border border-[#ead9d1] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="text-sm text-neutral-500">Total Orders</p>
                <h2 className="mt-2 text-3xl font-semibold">{totalOrders}</h2>
                <p className="mt-3 text-sm text-[#7a5244]">Open all orders →</p>
              </Link>

              <Link
                href="/admin/orders?statusFilter=pending"
                className="block rounded-[24px] border border-[#ead9d1] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="text-sm text-neutral-500">Pending Orders</p>
                <h2 className="mt-2 text-3xl font-semibold">{pendingOrders}</h2>
                <p className="mt-3 text-sm text-[#7a5244]">
                  Review pending orders →
                </p>
              </Link>

              <Link
                href="/admin/orders"
                className="block rounded-[24px] border border-[#ead9d1] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="text-sm text-neutral-500">Total Revenue</p>
                <h2 className="mt-2 text-3xl font-semibold">
                  {totalRevenue} BDT
                </h2>
                <p className="mt-3 text-sm text-[#7a5244]">View order totals →</p>
              </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
              <div className="rounded-[28px] border border-[#ead9d1] bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-[#2e221d]">
                      Recent Orders
                    </h2>
                    <p className="mt-1 text-sm text-neutral-600">
                      Latest 5 placed orders
                    </p>
                  </div>

                  <Link
                    href="/admin/orders"
                    className="text-sm font-medium text-[#7a5244] hover:underline"
                  >
                    View all
                  </Link>
                </div>

                {recentOrders.length === 0 ? (
                  <p className="text-sm text-neutral-600">No orders yet.</p>
                ) : (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <Link
                        key={order.id}
                        href={`/admin/orders?search=${encodeURIComponent(order.id)}`}
                        className="block rounded-[20px] border border-[#f1e4de] p-4 transition hover:bg-[#fdf9f7]"
                      >
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                          <div>
                            <h3 className="font-semibold text-[#2e221d]">
                              {order.id}
                            </h3>
                            <p className="text-sm text-neutral-600">
                              {order.customer.name} • {order.customer.phone}
                            </p>
                          </div>

                          <div className="text-sm text-neutral-600">
                            {new Date(order.createdAt).toLocaleString()}
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                          <span className="rounded-full border border-[#ead9d1] px-3 py-1">
                            {order.status}
                          </span>
                          <span className="font-medium">
                            {order.grandTotal} BDT
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <Link
                  href="/admin/products?stockFilter=low-stock"
                  className="block rounded-[28px] border border-[#ead9d1] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-[#2e221d]">
                        Low Stock
                      </h2>
                      <p className="mt-1 text-sm text-neutral-600">
                        Stock 1 to 5
                      </p>
                    </div>

                    <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                      {lowStockProducts.length}
                    </span>
                  </div>

                  {lowStockProducts.length === 0 ? (
                    <p className="text-sm text-neutral-600">
                      No low stock products.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {lowStockProducts.slice(0, 6).map((product) => {
                        const currentStock = getSafeStock(product.stock);

                        return (
                          <div
                            key={product.id}
                            className="flex items-center justify-between rounded-[18px] border border-[#f1e4de] p-3"
                          >
                            <div>
                              <p className="font-medium text-[#2e221d]">
                                {product.name}
                              </p>
                              <p className="text-sm text-neutral-500">
                                {product.category}
                              </p>
                            </div>
                            <span className="text-sm font-semibold text-amber-700">
                              {currentStock}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <p className="mt-4 text-sm text-[#7a5244]">
                    Open low stock products →
                  </p>
                </Link>

                <Link
                  href="/admin/products?stockFilter=out-of-stock"
                  className="block rounded-[28px] border border-[#ead9d1] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-[#2e221d]">
                        Out of Stock
                      </h2>
                      <p className="mt-1 text-sm text-neutral-600">
                        Immediate refill needed
                      </p>
                    </div>

                    <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                      {outOfStockProducts.length}
                    </span>
                  </div>

                  {outOfStockProducts.length === 0 ? (
                    <p className="text-sm text-neutral-600">
                      No out of stock products.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {outOfStockProducts.slice(0, 6).map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between rounded-[18px] border border-[#f1e4de] p-3"
                        >
                          <div>
                            <p className="font-medium text-[#2e221d]">
                              {product.name}
                            </p>
                            <p className="text-sm text-neutral-500">
                              {product.category}
                            </p>
                          </div>
                          <span className="text-sm font-semibold text-red-600">
                            0
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="mt-4 text-sm text-[#7a5244]">
                    Open out of stock products →
                  </p>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}