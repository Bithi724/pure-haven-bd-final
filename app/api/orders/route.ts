import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type OrderItemInput = {
  id?: number | string;
  productId?: number | string;
  name?: string;
  price?: number | string;
  image?: string;
  category?: string;
  quantity?: number | string;
};

type OrderBody = {
  id?: string;
  customer?: {
    name?: string;
    phone?: string;
    city?: string;
    address?: string;
  };
  items?: OrderItemInput[];
  subtotal?: number | string;
  deliveryFee?: number | string;
  total?: number | string;
  status?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  paymentDetails?: {
    provider?: string;
    senderNumber?: string;
    trxId?: string;
  } | null;
};

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeNumber(value: unknown, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function sanitizePhone(value: string) {
  return String(value || "").replace(/\D/g, "");
}

function generateOrderId() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `PH-${yyyy}${mm}${dd}-${random}`;
}

function mapOrder(order: {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  customerAddress: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentProvider: string | null;
  paymentSenderNumber: string | null;
  paymentTrxId: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: Array<{
    id: number;
    productId: number | null;
    name: string;
    price: number;
    image: string;
    category: string;
    quantity: number;
  }>;
}) {
  return {
    id: order.id,
    orderId: order.orderId,
    customer: {
      name: order.customerName,
      phone: order.customerPhone,
      city: order.customerCity,
      address: order.customerAddress,
    },
    items: order.items,
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    total: order.total,
    status: order.status,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    paymentDetails:
      order.paymentProvider ||
      order.paymentSenderNumber ||
      order.paymentTrxId
        ? {
            provider: order.paymentProvider || undefined,
            senderNumber: order.paymentSenderNumber || undefined,
            trxId: order.paymentTrxId || undefined,
          }
        : null,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}

export async function GET(req: NextRequest) {
  try {
    const track = req.nextUrl.searchParams.get("track");
    const orderId = req.nextUrl.searchParams.get("orderId");
    const phone = req.nextUrl.searchParams.get("phone");

    if (track === "1") {
      if (!orderId || !phone) {
        return NextResponse.json(
          {
            success: false,
            message: "Order ID and phone number are required.",
          },
          { status: 400 }
        );
      }

      const matchedOrder = await prisma.order.findFirst({
        where: {
          orderId: orderId.trim(),
          customerPhone: {
            equals: sanitizePhone(phone),
          },
        },
        include: { items: true },
      });

      if (!matchedOrder) {
        const fallbackOrder = await prisma.order.findFirst({
          where: {
            orderId: orderId.trim(),
          },
          include: { items: true },
        });

        const samePhone =
          fallbackOrder &&
          sanitizePhone(fallbackOrder.customerPhone) === sanitizePhone(phone);

        if (!samePhone) {
          return NextResponse.json(
            {
              success: false,
              message: "No matching order found.",
            },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          order: mapOrder(fallbackOrder),
        });
      }

      return NextResponse.json({
        success: true,
        order: mapOrder(matchedOrder),
      });
    }

    const orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      orders: orders.map(mapOrder),
    });
  } catch (error) {
    console.error("GET /api/orders failed:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch orders." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as OrderBody;

    const customerName = normalizeString(body.customer?.name);
    const customerPhone = normalizeString(body.customer?.phone);
    const customerCity = normalizeString(body.customer?.city);
    const customerAddress = normalizeString(body.customer?.address);

    const items = Array.isArray(body.items) ? body.items : [];

    if (!customerName || !customerPhone || !customerAddress) {
      return NextResponse.json(
        { success: false, message: "Customer information is incomplete." },
        { status: 400 }
      );
    }

    if (items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Order items are required." },
        { status: 400 }
      );
    }

    const orderId = generateOrderId();

    const order = await prisma.order.create({
      data: {
        orderId,
        customerName,
        customerPhone,
        customerCity,
        customerAddress,
        subtotal: normalizeNumber(body.subtotal, 0),
        deliveryFee: normalizeNumber(body.deliveryFee, 0),
        total: normalizeNumber(body.total, 0),
        status: normalizeString(body.status) || "pending",
        paymentMethod: normalizeString(body.paymentMethod) || "Cash on Delivery",
        paymentStatus: normalizeString(body.paymentStatus) || "pending",
        paymentProvider: normalizeString(body.paymentDetails?.provider) || null,
        paymentSenderNumber:
          normalizeString(body.paymentDetails?.senderNumber) || null,
        paymentTrxId: normalizeString(body.paymentDetails?.trxId) || null,
        items: {
          create: items.map((item) => ({
            productId:
              item.productId !== undefined && item.productId !== null
                ? Number(item.productId)
                : null,
            name: normalizeString(item.name),
            price: normalizeNumber(item.price, 0),
            image:
              normalizeString(item.image) || "/uploads/placeholder-product.png",
            category: normalizeString(item.category) || "Uncategorized",
            quantity: Math.max(1, Math.floor(normalizeNumber(item.quantity, 1))),
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({
      success: true,
      message: "Order created successfully.",
      order: mapOrder(order),
    });
  } catch (error) {
    console.error("POST /api/orders failed:", error);

    return NextResponse.json(
      { success: false, message: "Order creation failed." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = (await req.json()) as OrderBody;

    const id = normalizeString(body.id);

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Order ID is required." },
        { status: 400 }
      );
    }

    const existing = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderId: id }],
      },
      include: { items: true },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 }
      );
    }

    const updated = await prisma.order.update({
      where: { id: existing.id },
      data: {
        status: normalizeString(body.status) || existing.status,
        paymentMethod:
          normalizeString(body.paymentMethod) || existing.paymentMethod,
        paymentStatus:
          normalizeString(body.paymentStatus) || existing.paymentStatus,
        paymentProvider:
          body.paymentDetails !== undefined
            ? normalizeString(body.paymentDetails?.provider) || null
            : existing.paymentProvider,
        paymentSenderNumber:
          body.paymentDetails !== undefined
            ? normalizeString(body.paymentDetails?.senderNumber) || null
            : existing.paymentSenderNumber,
        paymentTrxId:
          body.paymentDetails !== undefined
            ? normalizeString(body.paymentDetails?.trxId) || null
            : existing.paymentTrxId,
      },
      include: { items: true },
    });

    return NextResponse.json({
      success: true,
      message: "Order updated successfully.",
      order: mapOrder(updated),
    });
  } catch (error) {
    console.error("PUT /api/orders failed:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update order." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Order ID is required." },
        { status: 400 }
      );
    }

    const existing = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderId: id }],
      },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 }
      );
    }

    await prisma.order.delete({
      where: { id: existing.id },
    });

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE /api/orders failed:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete order." },
      { status: 500 }
    );
  }
}