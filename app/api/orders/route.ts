import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ordersFilePath = path.join(process.cwd(), "data", "orders.json");
const productsFilePath = path.join(process.cwd(), "data", "products.json");

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

type OrderItem = {
  id: number | string;
  productId?: number | string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
};

type CustomerInfo = {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city?: string;
  area?: string;
  notes?: string;
};

type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "completed";

type Order = {
  id: string;
  orderId: string;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus | string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
};

async function ensureJsonFile(filePath: string, fallbackContent: string) {
  const dirPath = path.dirname(filePath);
  await fs.mkdir(dirPath, { recursive: true });

  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, fallbackContent, "utf8");
  }
}

async function ensureOrdersFile() {
  await ensureJsonFile(ordersFilePath, "[]");
}

async function ensureProductsFile() {
  await ensureJsonFile(productsFilePath, "[]");
}

async function readOrders(): Promise<Order[]> {
  await ensureOrdersFile();

  const fileContent = await fs.readFile(ordersFilePath, "utf8");
  if (!fileContent.trim()) return [];

  const parsed = JSON.parse(fileContent);
  return Array.isArray(parsed) ? parsed : [];
}

async function writeOrders(orders: Order[]) {
  await ensureOrdersFile();
  await fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2), "utf8");
}

async function readProducts(): Promise<Product[]> {
  await ensureProductsFile();

  const fileContent = await fs.readFile(productsFilePath, "utf8");
  if (!fileContent.trim()) return [];

  const parsed = JSON.parse(fileContent);
  return Array.isArray(parsed) ? parsed : [];
}

async function writeProducts(products: Product[]) {
  await ensureProductsFile();
  await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), "utf8");
}

function sortOrders(orders: Order[]) {
  return [...orders].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

function generateOrderId() {
  const now = new Date();
  const yy = now.getFullYear().toString().slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const timestampTail = Date.now().toString().slice(-6);
  const randomTail = Math.floor(1000 + Math.random() * 9000);

  return `PHB-${yy}${mm}${dd}-${timestampTail}-${randomTail}`;
}

function normalizeNumber(value: unknown, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeItems(rawItems: unknown): OrderItem[] {
  if (!Array.isArray(rawItems)) return [];

  return rawItems
    .map((item: any) => {
      const quantity = normalizeNumber(item?.quantity, 0);
      const price = normalizeNumber(item?.price, 0);

      return {
        id: item?.id ?? item?.productId ?? `${Date.now()}-${Math.random()}`,
        productId: item?.productId ?? item?.id,
        name: normalizeString(item?.name),
        price,
        quantity,
        image: normalizeString(item?.image) || undefined,
        category: normalizeString(item?.category) || undefined,
      };
    })
    .filter((item) => item.name && item.quantity > 0);
}

function normalizeCustomer(body: any): CustomerInfo {
  const customer =
    body?.customer && typeof body.customer === "object" ? body.customer : {};
  const shippingAddress =
    body?.shippingAddress && typeof body.shippingAddress === "object"
      ? body.shippingAddress
      : {};

  return {
    name: normalizeString(customer.name ?? body?.name),
    phone: normalizeString(customer.phone ?? body?.phone),
    email: normalizeString(customer.email ?? body?.email) || undefined,
    address: normalizeString(
      customer.address ?? shippingAddress.address ?? body?.address
    ),
    city:
      normalizeString(customer.city ?? shippingAddress.city ?? body?.city) ||
      undefined,
    area:
      normalizeString(customer.area ?? shippingAddress.area ?? body?.area) ||
      undefined,
    notes:
      normalizeString(customer.notes ?? shippingAddress.notes ?? body?.notes) ||
      undefined,
  };
}

function calculateSubtotal(items: OrderItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function buildOrderFromBody(body: any): Order {
  const items = normalizeItems(body?.items);
  const customer = normalizeCustomer(body);

  const subtotalFromItems = calculateSubtotal(items);
  const subtotal = normalizeNumber(body?.subtotal, subtotalFromItems);
  const deliveryFee = normalizeNumber(body?.deliveryFee, 0);
  const total = normalizeNumber(body?.total, subtotal + deliveryFee);

  const now = new Date().toISOString();
  const generatedId = generateOrderId();

  return {
    id: generatedId,
    orderId: generatedId,
    customer,
    items,
    subtotal,
    deliveryFee,
    total,
    status: normalizeString(body?.status) || "pending",
    paymentMethod: normalizeString(body?.paymentMethod) || "Cash on Delivery",
    createdAt: now,
    updatedAt: now,
  };
}

function findOrderIndex(orders: Order[], idOrOrderId: string) {
  return orders.findIndex(
    (order) => order.id === idOrOrderId || order.orderId === idOrOrderId
  );
}

function getOrderItemProductId(item: OrderItem) {
  const raw = item.productId ?? item.id;
  const numericId = Number(raw);

  return Number.isFinite(numericId) ? numericId : null;
}

function verifyAndApplyStock(
  products: Product[],
  orderItems: OrderItem[]
): { ok: true; updatedProducts: Product[] } | { ok: false; message: string } {
  const updatedProducts = [...products];

  for (const orderItem of orderItems) {
    const productId = getOrderItemProductId(orderItem);

    if (productId === null) {
      return {
        ok: false,
        message: `Invalid product id for "${orderItem.name}".`,
      };
    }

    const productIndex = updatedProducts.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
      return {
        ok: false,
        message: `Product "${orderItem.name}" is no longer available.`,
      };
    }

    const product = updatedProducts[productIndex];

    if (typeof product.stock === "number") {
      if (product.stock <= 0) {
        return {
          ok: false,
          message: `"${product.name}" is out of stock.`,
        };
      }

      if (orderItem.quantity > product.stock) {
        return {
          ok: false,
          message: `"${product.name}" only has ${product.stock} item(s) left in stock.`,
        };
      }

      updatedProducts[productIndex] = {
        ...product,
        stock: product.stock - orderItem.quantity,
      };
    }
  }

  return { ok: true, updatedProducts };
}

export async function GET(request: NextRequest) {
  try {
    const orders = await readOrders();
    const { searchParams } = new URL(request.url);

    const id = searchParams.get("id") || searchParams.get("orderId");

    if (id) {
      const order = orders.find(
        (item) => item.id === id || item.orderId === id
      );

      if (!order) {
        return NextResponse.json(
          { success: false, message: "Order not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, order }, { status: 200 });
    }

    return NextResponse.json(
      { success: true, orders: sortOrders(orders) },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/orders error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newOrder = buildOrderFromBody(body);

    if (
      !newOrder.customer.name ||
      !newOrder.customer.phone ||
      !newOrder.customer.address
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer name, phone, and address are required",
        },
        { status: 400 }
      );
    }

    if (!newOrder.items.length) {
      return NextResponse.json(
        { success: false, message: "At least one order item is required" },
        { status: 400 }
      );
    }

    const products = await readProducts();
    const stockResult = verifyAndApplyStock(products, newOrder.items);

    if (!stockResult.ok) {
      return NextResponse.json(
        { success: false, message: stockResult.message },
        { status: 400 }
      );
    }

    const orders = await readOrders();
    orders.push(newOrder);

    await writeProducts(stockResult.updatedProducts);
    await writeOrders(orders);

    return NextResponse.json(
      {
        success: true,
        message: "Order created successfully",
        order: newOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/orders error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const id = normalizeString(body?.id ?? body?.orderId);

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Order id is required" },
        { status: 400 }
      );
    }

    const orders = await readOrders();
    const index = findOrderIndex(orders, id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    const existingOrder = orders[index];

    const nextStatus = normalizeString(body?.status) || existingOrder.status;

    const nextCustomer =
      body?.customer && typeof body.customer === "object"
        ? {
            ...existingOrder.customer,
            ...body.customer,
          }
        : existingOrder.customer;

    const nextItems = Array.isArray(body?.items)
      ? normalizeItems(body.items)
      : existingOrder.items;

    const nextSubtotal =
      body?.subtotal !== undefined
        ? normalizeNumber(body.subtotal, existingOrder.subtotal)
        : Array.isArray(body?.items)
        ? calculateSubtotal(nextItems)
        : existingOrder.subtotal;

    const nextDeliveryFee =
      body?.deliveryFee !== undefined
        ? normalizeNumber(body.deliveryFee, existingOrder.deliveryFee)
        : existingOrder.deliveryFee;

    const nextTotal =
      body?.total !== undefined
        ? normalizeNumber(body.total, nextSubtotal + nextDeliveryFee)
        : nextSubtotal + nextDeliveryFee;

    const updatedOrder: Order = {
      ...existingOrder,
      customer: nextCustomer,
      items: nextItems,
      subtotal: nextSubtotal,
      deliveryFee: nextDeliveryFee,
      total: nextTotal,
      status: nextStatus,
      paymentMethod:
        normalizeString(body?.paymentMethod) || existingOrder.paymentMethod,
      updatedAt: new Date().toISOString(),
    };

    orders[index] = updatedOrder;
    await writeOrders(orders);

    return NextResponse.json(
      {
        success: true,
        message: "Order updated successfully",
        order: updatedOrder,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /api/orders error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update order" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id") || searchParams.get("orderId") || "";

    if (!id) {
      const body = await request.json().catch(() => null);
      id = normalizeString(body?.id ?? body?.orderId);
    }

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Order id is required" },
        { status: 400 }
      );
    }

    const orders = await readOrders();
    const index = findOrderIndex(orders, id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    const [deletedOrder] = orders.splice(index, 1);
    await writeOrders(orders);

    return NextResponse.json(
      {
        success: true,
        message: "Order deleted successfully",
        order: deletedOrder,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/orders error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete order" },
      { status: 500 }
    );
  }
}