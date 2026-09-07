"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Giriş başarısız: " + error.message);
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
  }

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #0d1526 0%, #131e36 45%, #0a0e1a 100%)",
      }}
    >
      {/* dekoratif glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 blur-[120px] opacity-25" />

      <div className="project-card relative w-full max-w-sm rounded-[20px] border border-white/10 bg-white/[0.03] backdrop-blur-sm px-8 py-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-3 py-1 text-xs text-white/70 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          Yönetim Paneli
        </span>

        <h1 className="text-2xl font-bold text-white mb-1">Admin Girişi</h1>
        <p className="text-sm text-white/50 mb-7">
          Portfolyo içeriğini yönetmek için giriş yap.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/60">
              E-posta
            </label>
            <input
              type="email"
              placeholder="ornek@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3.5 py-2.5 text-white placeholder-white/30 outline-none transition-colors focus:border-indigo-400/60 focus:bg-white/[0.07] focus:ring-2 focus:ring-indigo-400/20"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/60">Şifre</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3.5 py-2.5 text-white placeholder-white/30 outline-none transition-colors focus:border-indigo-400/60 focus:bg-white/[0.07] focus:ring-2 focus:ring-indigo-400/20"
              required
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-2.5 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
      </div>
    </div>
  );
}
