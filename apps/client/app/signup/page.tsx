"use client";

import { useState } from "react";
import { trpc } from "@/shared/trpc/client";
import { getErrorMessage } from "@/shared/trpc/error";
import Link from "next/link";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [step, setStep] = useState<"signup" | "confirm">("signup");

  const signup = trpc.auth.signup.useMutation({
    onSuccess: () => setStep("confirm"),
  });

  const confirm = trpc.auth.confirm.useMutation({
    onSuccess: () => {
      window.location.href = "/login";
    },
  });

  if (step === "confirm") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100">
        <div className="w-full max-w-sm space-y-4">
          <h1 className="text-xl font-semibold">Confirm your email</h1>
          <p className="text-sm text-zinc-400">
            We sent a code to {email}. Check the server console.
          </p>
          {confirm.error && (
            <p className="text-sm text-red-400">{getErrorMessage(confirm.error)}</p>
          )}
          <input
            type="text"
            placeholder="6-digit code"
            maxLength={6}
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            className="w-full rounded bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm outline-none focus:border-zinc-600"
          />
          <button
            onClick={() => confirm.mutate({ email, code: otpCode })}
            disabled={confirm.isPending}
            className="w-full rounded bg-white text-black py-2 text-sm font-medium hover:bg-zinc-200 disabled:opacity-50"
          >
            {confirm.isPending ? "Confirming..." : "Confirm"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold">Sign up</h1>
        {signup.error && (
          <p className="text-sm text-red-400">{getErrorMessage(signup.error)}</p>
        )}
        <input
          type="text"
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full rounded bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm outline-none focus:border-zinc-600"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm outline-none focus:border-zinc-600"
        />
        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm outline-none focus:border-zinc-600"
        />
        <button
          onClick={() => signup.mutate({ fullName, email, password })}
          disabled={signup.isPending}
          className="w-full rounded bg-white text-black py-2 text-sm font-medium hover:bg-zinc-200 disabled:opacity-50"
        >
          {signup.isPending ? "Signing up..." : "Sign up"}
        </button>
        <p className="text-sm text-zinc-400 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-white underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
