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
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/dashboard" className="flex-shrink-0 flex items-center gap-2">
                <Sofa className="w-8 h-8 text-blue-600" />
                <span className="font-bold text-xl text-slate-900 hidden sm:block">StageAI</span>
              </Link>
              <div className="ml-6 flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
                    pathname === "/dashboard" ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" /> Projelerim
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 border border-blue-100">
                <Coins className="w-4 h-4 text-blue-500" />
                {session.user.credits} Kredi
              </div>
              <Link
                href="/dashboard/pricing"
                className="text-sm font-medium text-slate-700 hover:text-blue-600 flex items-center gap-1"
              >
                <CreditCard className="w-4 h-4" /> Kredi Al
              </Link>
              <div className="h-6 w-px bg-slate-200 mx-2"></div>
              <button
                onClick={() => signOut()}
                className="text-sm font-medium text-slate-600 hover:text-red-600 flex items-center gap-1"
              >
                <LogOut className="w-4 h-4" /> Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
