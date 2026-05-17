"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sofa, Mail, Lock, AlertCircle } from "lucide-react";

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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-slate-200 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="bg-black p-3 rounded-2xl shadow-xl shadow-black/10">
            <Sofa className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-semibold text-slate-900 tracking-tight">
          Hoş Geldiniz
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500 font-light">
          Hesabınız yoksa otomatik oluşturulacak ve 10 kredi verilecektir.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-2xl shadow-slate-200/50 sm:rounded-[2rem] sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50/50 text-red-500 p-3 rounded-xl flex items-center gap-2 text-sm border border-red-100">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">E-posta</label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-2 focus:ring-black focus:border-black block w-full pl-11 sm:text-sm border-slate-200 rounded-xl py-3 border outline-none transition bg-white/50"
                  placeholder="ornek@email.com (İsteğe bağlı)"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Şifre</label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-2 focus:ring-black focus:border-black block w-full pl-11 sm:text-sm border-slate-200 rounded-xl py-3 border outline-none transition bg-white/50"
                  placeholder="•••••••• (İsteğe bağlı)"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-medium text-white bg-black hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 transition"
              >
                {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
