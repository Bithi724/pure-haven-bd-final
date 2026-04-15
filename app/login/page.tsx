"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (
      normalizedEmail === "admin@purehaven.com" &&
      normalizedPassword === "123456"
    ) {
      localStorage.setItem("ph_admin_logged_in", "true");
      window.dispatchEvent(new Event("ph-admin-auth-changed"));
      setMessage("");
      router.push("/admin/products");
      return;
    }

    setMessage("Invalid admin email or password.");
  }

  return (
    <main className="min-h-screen bg-[#fcf8f6] px-4 py-10">
      <div className="mx-auto max-w-md rounded-[28px] border border-[#ead9d1] bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-[#2e221d]">Admin Login</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Login to manage products.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <input
              type="email"
              inputMode="email"
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-[#ead9d1] px-4 py-3 outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Password</label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-[#ead9d1] px-4 py-3 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="rounded-full bg-[#2e221d] px-6 py-3 text-white hover:bg-[#7a5244]"
          >
            Login
          </button>

          {message ? (
            <p className="text-sm font-medium text-red-600">{message}</p>
          ) : null}
        </form>
      </div>
    </main>
  );
}