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
      <div className="text-center mb-16">
        <h1 className="text-4xl font-semibold text-slate-900 tracking-tight">Kredi Yükle</h1>
        <p className="text-slate-500 mt-4 max-w-2xl mx-auto font-light leading-relaxed">Sanal eşyalandırmaya ve video turları oluşturmaya devam etmek için kredi satın alın. <br/> <span className="font-medium text-slate-700">1 Kredi = 1 Yapay Zeka Eşyalandırma veya 1 Video Turu.</span></p>
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        {plans.map((plan) => (
          <div key={plan.id} className={`bg-white rounded-[2rem] border p-10 shadow-sm relative overflow-hidden transition hover:shadow-lg ${plan.id === "pro" ? "border-slate-300 ring-4 ring-slate-50" : "border-slate-100"}`}>
            {plan.id === "pro" && (
              <div className="absolute top-0 inset-x-0 bg-black text-white text-xs font-semibold py-1.5 text-center tracking-widest uppercase">
                EN POPÜLER
              </div>
            )}
            <h3 className={`text-2xl font-semibold text-slate-900 mb-2 tracking-tight ${plan.id === "pro" ? "mt-4" : ""}`}>{plan.name}</h3>
            <p className="text-slate-500 mb-8 font-light">{plan.description}</p>
            <div className="mb-8 flex items-baseline gap-1">
              <span className="text-5xl font-semibold text-slate-900 tracking-tight">${plan.price}</span>
              <span className="text-slate-500 font-medium">/ tek seferlik</span>
            </div>

            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3 text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-black" />
                <span><span className="font-semibold">{plan.credits} Kredi</span> dahil</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-black" />
                <span>Tüm yapay zeka temalarına erişim</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-black" />
                <span>Yüksek çözünürlüklü indirmeler</span>
              </li>
            </ul>

            <button
              onClick={() => handlePurchase(plan.id)}
              disabled={loading !== null}
              className={`w-full py-4 px-4 rounded-full font-medium flex items-center justify-center gap-2 transition shadow-sm hover:shadow-md hover:-translate-y-0.5 ${
                plan.id === "pro"
                  ? "bg-black text-white hover:bg-slate-800"
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
