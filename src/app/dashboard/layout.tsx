"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Sofa, Coins, LogOut, LayoutDashboard, CreditCard } from "lucide-react";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading" || !session) {
    return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/dashboard" className="flex-shrink-0 flex items-center gap-2">
                <div className="bg-black p-1.5 rounded-lg">
                  <Sofa className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-lg text-slate-900 hidden sm:block tracking-tight">StageAI</span>
              </Link>
              <div className="ml-8 flex items-center space-x-1">
                <Link
                  href="/dashboard"
                  className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition ${
                    pathname === "/dashboard" ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" /> Projelerim
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-slate-100 text-slate-800 px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 border border-slate-200/50">
                <Coins className="w-4 h-4 text-amber-500" />
                {session.user.credits} Kredi
              </div>
              <Link
                href="/dashboard/pricing"
                className="text-sm font-medium text-slate-600 hover:text-black flex items-center gap-1.5 transition"
              >
                <CreditCard className="w-4 h-4" /> Kredi Al
              </Link>
              <div className="h-5 w-px bg-slate-200 mx-2"></div>
              <button
                onClick={() => signOut()}
                className="text-sm font-medium text-slate-500 hover:text-red-600 flex items-center gap-1.5 transition"
              >
                <LogOut className="w-4 h-4" /> Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </main>
    </div>
  );
}
