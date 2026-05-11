"use client";

import { useState } from "react";
import { trpc } from "@/shared/trpc/client";
import { getErrorMessage } from "@/shared/trpc/error";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      window.location.href = "/";
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold">Log in</h1>
        {login.error && (
          <p className="text-sm text-red-400">{getErrorMessage(login.error)}</p>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm outline-none focus:border-zinc-600"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm outline-none focus:border-zinc-600"
        />
        <button
          onClick={() => login.mutate({ email, password })}
          disabled={login.isPending}
          className="w-full rounded bg-white text-black py-2 text-sm font-medium hover:bg-zinc-200 disabled:opacity-50"
        >
          {login.isPending ? "Logging in..." : "Log in"}
        </button>
        <p className="text-sm text-zinc-400 text-center">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-white underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
