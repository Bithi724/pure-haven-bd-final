"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "PH-[not available]";
  const paymentMethod =
    searchParams.get("paymentMethod") || "Cash on Delivery";

  const isBkash = paymentMethod.toLowerCase().includes("bkash");

  return (
    <main>
      <TopBar />
      <Navbar />

      <section className="container-ph section-gap">
        <div className="mx-auto max-w-3xl rounded-[32px] border border-[#ead9d1] bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#ecfdf3] text-[#15803d]">
            <svg
              viewBox="0 0 24 24"
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>

          <div className="mt-5 text-center">
            <p className="text-sm uppercase tracking-[0.18em] text-[#7a5244]">
              Order Confirmed
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-[#2e221d] sm:text-4xl">
              Thank you for your order
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-neutral-600 sm:text-base">
              Your order has been placed successfully. Our team will review it
              and contact you if needed.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[22px] border border-[#ead9d1] bg-[#fffdfb] p-5">
              <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">
                Order ID
              </p>
              <p className="mt-2 text-lg font-semibold text-[#2e221d]">
                {orderId}
              </p>
            </div>

            <div className="rounded-[22px] border border-[#ead9d1] bg-[#fffdfb] p-5">
              <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">
                Payment Method
              </p>
              <p className="mt-2 text-lg font-semibold text-[#2e221d]">
                {paymentMethod}
              </p>
            </div>
          </div>

          {isBkash ? (
            <div className="mt-5 rounded-[22px] border border-[#ead9d1] bg-[#fffaf6] p-5 text-sm text-neutral-700">
              <p className="font-semibold text-[#2e221d]">
                bKash payment submitted
              </p>
              <p className="mt-2">
                Your payment is waiting for manual verification. Our team will
                review your sender number and transaction ID before confirming
                the order.
              </p>
            </div>
          ) : (
            <div className="mt-5 rounded-[22px] border border-[#ead9d1] bg-[#fffaf6] p-5 text-sm text-neutral-700">
              <p className="font-semibold text-[#2e221d]">
                Cash on Delivery selected
              </p>
              <p className="mt-2">
                Please keep your phone active. Our team may call you before
                dispatching the order.
              </p>
            </div>
          )}

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-full border border-[#ead9d1] px-5 py-3 text-sm font-medium text-[#2e221d] transition hover:bg-[#f8f3ef]"
            >
              Continue Shopping
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-[#ead9d1] px-5 py-3 text-sm font-medium text-[#2e221d] transition hover:bg-[#f8f3ef]"
            >
              Back to Home
            </Link>

            <a
              href={`https://wa.me/8801977269164?text=${encodeURIComponent(
                `Hello, I placed an order.\nOrder ID: ${orderId}`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-[#ead9d1] px-5 py-3 text-sm font-medium text-[#2e221d] transition hover:bg-[#f8f3ef]"
            >
              WhatsApp Support
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}