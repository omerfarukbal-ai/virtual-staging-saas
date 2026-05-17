"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CheckCircle2, Loader2, CreditCard } from "lucide-react";

const plans = [
  { id: "basic", name: "Basic", price: 9.99, credits: 50, description: "Perfect for a single small property." },
  { id: "pro", name: "Pro", price: 29.99, credits: 200, description: "Best for agents with multiple properties." },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();
  const { update } = useSession();

  const handlePurchase = async (planId: string) => {
    setLoading(planId);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      if (res.ok) {
        await update(); // refresh session to get new credits
        router.push("/dashboard");
      } else {
        alert("Payment failed");
      }
    } catch (error) {
      alert("Error processing payment");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-900">Kredi Al</h1>
        <p className="text-slate-500 mt-2 max-w-2xl mx-auto">Sanal eşyalandırmaya ve video turları oluşturmaya devam etmek için kredi satın alın. 1 Kredi = 1 Yapay Zeka Eşyalandırma veya 1 Video Turu.</p>
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-2xl border p-8 shadow-sm relative overflow-hidden">
            {plan.id === "pro" && (
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                EN POPÜLER
              </div>
            )}
            <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
            <p className="text-slate-500 mb-6">{plan.description}</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-slate-900">${plan.price}</span>
              <span className="text-slate-500"> / tek seferlik</span>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="font-semibold">{plan.credits} Kredi</span> dahil
              </li>
              <li className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Tüm temalara erişim
              </li>
              <li className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Yüksek çözünürlüklü indirmeler
              </li>
            </ul>

            <button
              onClick={() => handlePurchase(plan.id)}
              disabled={loading !== null}
              className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition ${
                plan.id === "pro"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-slate-100 text-slate-900 hover:bg-slate-200"
              }`}
            >
              {loading === plan.id ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> İşleniyor...</>
              ) : (
                <><CreditCard className="w-5 h-5" /> {plan.name} Paketini Al</>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
