"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sofa, Mail, Lock, AlertCircle, ArrowLeft } from "lucide-react";
import { MotionDiv } from "@/components/Motion";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("Beklenmeyen bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black pointer-events-none -z-10"></div>

      <MotionDiv initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="absolute top-8 left-8">
        <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition">
          <ArrowLeft className="w-5 h-5" /> Ana Sayfaya Dön
        </Link>
      </MotionDiv>

      <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 p-4 rounded-3xl shadow-[0_0_30px_rgba(255,255,255,0.1)] border border-white/10">
            <Sofa className="w-10 h-10 text-white" />
          </div>
        </div>
        <h2 className="text-center text-4xl font-bold tracking-tight text-white mb-3">
          Sisteme Giriş
        </h2>
        <p className="text-center text-sm text-slate-400 font-light">
          Hesabınız yoksa otomatik oluşturulacak ve <span className="text-white font-medium">10 kredi</span> verilecektir.
        </p>
      </MotionDiv>

      <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/5 backdrop-blur-3xl py-10 px-6 shadow-2xl sm:rounded-[2.5rem] sm:px-12 border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 text-red-400 p-4 rounded-2xl flex items-center gap-3 text-sm border border-red-500/20">
                <AlertCircle className="w-5 h-5 flex-shrink-0" /> <span className="font-medium">{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">E-posta Adresi</label>
              <div className="relative rounded-2xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-2 focus:ring-white focus:border-white block w-full pl-12 sm:text-sm border-white/10 rounded-2xl py-3.5 bg-black/50 text-white placeholder-slate-600 outline-none transition"
                  placeholder="ornek@sirket.com (İsteğe bağlı)"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">Şifre</label>
              <div className="relative rounded-2xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-2 focus:ring-white focus:border-white block w-full pl-12 sm:text-sm border-white/10 rounded-2xl py-3.5 bg-black/50 text-white placeholder-slate-600 outline-none transition"
                  placeholder="•••••••• (İsteğe bağlı)"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 rounded-2xl shadow-lg shadow-white/5 text-base font-semibold text-black bg-white hover:bg-slate-200 hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white disabled:opacity-50 disabled:hover:scale-100 transition-all duration-200"
              >
                {loading ? "Giriş yapılıyor..." : "Hemen Giriş Yap"}
              </button>
            </div>
          </form>
        </div>
      </MotionDiv>
    </div>
  );
}
