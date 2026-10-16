"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/login", { email, password });
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-white">
      <div className="hidden lg:flex w-1/2 relative flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-black"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center px-12">
          <Image alt="Phenex Logo" className="drop-shadow-2xl mb-8" height="120" src="/icon.png" width="120"/>
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-amber-200 via-amber-400 to-amber-600 tracking-widest mb-4">
            PHENEX PULSE
          </h1>
          <p className="text-slate-400 text-lg max-w-md font-light">
            Real-time insights and supply chain mastery. Senarnya para juara.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24">
        <div className="w-full max-w-md space-y-10">
          
          <div className="text-center lg:text-left">
            <Image alt="Phenex Logo" className="mx-auto lg:hidden mb-6" height="48" src="/icon.png" width="48"/>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 mt-2">Please sign in to your developer account.</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100 flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-slate-900 outline-none"
                placeholder="dev@phenex.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-slate-900 outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-slate-950 hover:bg-slate-900 text-amber-500 font-bold rounded-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg shadow-slate-950/20 mt-4"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-amber-500"/>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}