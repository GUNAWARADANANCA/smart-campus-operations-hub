"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, ShieldCheck, ArrowRightLeft, GraduationCap } from "lucide-react";

export default function LoginPage() {
  const { user, isReady, login, register } = useAuth();
  const router = useRouter();

  const [showRegister, setShowRegister] = useState(false);
  const [email, setEmail] = useState("admin@smartcampus.edu");
  const [password, setPassword] = useState("password123");
  const [fullName, setFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady) return;
    if (user) router.replace("/dashboard");
  }, [user, isReady, router]);

  async function onSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    }
  }

  async function onRegister(e: React.FormEvent) {
    e.preventDefault();
    const name = fullName.trim() || "New User";
    setError(null);
    try {
      await register(name, regEmail.trim(), regPassword);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-100 via-white to-primary-300">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="relative hidden overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(39,131,166,0.22),transparent_35%)]" />
          <div className="absolute right-16 top-16 h-40 w-40 rounded-full bg-primary-300/40 blur-3xl" />
          <div className="absolute bottom-16 left-16 h-52 w-52 rounded-full bg-primary-400/30 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between px-12 py-10">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-700 to-cyan-500 text-white shadow-lg">
                <Building2 className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Smart Campus Hub</h1>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">
                  Smart Campus Experience
                </p>              
              </div>
            </div>

            <div className="max-w-xl">
              <h2 className="text-5xl font-bold leading-tight text-slate-900">
                Manage campus services with one clean platform.
              </h2>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-3xl bg-white/70 p-5 shadow-sm ring-1 ring-white/60 backdrop-blur">
                  <ShieldCheck className="h-6 w-6 text-cyan-700" />
                  <h3 className="mt-3 text-sm font-semibold text-slate-900">Secure Access</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Safe login and protected operations.
                  </p>
                </div>

                <div className="rounded-3xl bg-white/70 p-5 shadow-sm ring-1 ring-white/60 backdrop-blur">
                  <ArrowRightLeft className="h-6 w-6 text-cyan-700" />
                  <h3 className="mt-3 text-sm font-semibold text-slate-900">Fast Workflow</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Smooth student and admin interactions.
                  </p>
                </div>

                <div className="rounded-3xl bg-white/70 p-5 shadow-sm ring-1 ring-white/60 backdrop-blur">
                  <GraduationCap className="h-6 w-6 text-cyan-700" />
                  <h3 className="mt-3 text-sm font-semibold text-slate-900">Student Focused</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Built for daily campus needs and support.
                  </p>
                </div>

                <div className="rounded-3xl bg-white/70 p-5 shadow-sm ring-1 ring-white/60 backdrop-blur">
                  <Building2 className="h-6 w-6 text-cyan-700" />
                  <h3 className="mt-3 text-sm font-semibold text-slate-900">Resource Ready</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Access bookings, tickets, and campus tools.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-400 mt-5">
              © 2026 Smart Campus Operations. All rights reserved.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-md">
            <div className="rounded-[32px] bg-white p-8 shadow-2xl ring-1 ring-cyan-100 sm:p-10">
              <div className="mb-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-700 text-white shadow-lg">
                  <Building2 className="h-8 w-8" />
                </div>

                <h2 className="mt-5 text-3xl font-bold text-slate-900">
                  {!showRegister ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  {!showRegister
                    ? "Sign in to continue to Smart Campus Hub"
                    : "Create your account to get started"}
                </p>
              </div>

              {error ? (
                <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              ) : null}

              {!showRegister ? (
                <form onSubmit={onSignIn} className="space-y-4" suppressHydrationWarning>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-2 w-full rounded-2xl bg-cyan-700 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-cyan-500"
                  >
                    Sign In
                  </button>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => setShowRegister(true)}
                      className="text-sm font-medium text-gray-700 transition hover:text-cyan-500"
                    >
                      Don&apos;t have an account? Register
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={onRegister} className="space-y-4" suppressHydrationWarning>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="Minimum 6 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                      minLength={6}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-2 w-full rounded-2xl bg-cyan-700 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-cyan-500"
                  >
                    Create Account
                  </button>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => setShowRegister(false)}
                      className="text-sm font-medium text-gray-700 transition hover:text-cyan-500"
                    >
                      Already have an account? Sign in
                    </button>
                  </div>
                </form>
              )}
            </div>

            <p className="mt-6 text-center text-xs text-slate-400 lg:hidden">
              © 2026 Smart Campus Operations. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}