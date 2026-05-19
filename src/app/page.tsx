"use client";
import Link from "next/link";
import { ArrowRight, Sparkles, Video, Sofa, Image as ImageIcon } from "lucide-react";
import { MotionDiv, MotionSection } from "@/components/Motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-slate-100 overflow-hidden font-sans selection:bg-blue-500/30 selection:text-blue-200">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-black to-black pointer-events-none -z-10"></div>

      <header className="fixed top-0 w-full bg-black/50 backdrop-blur-2xl z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
          <MotionDiv initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 group-hover:bg-white/20 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                <Sofa className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-wide">STAGE<span className="font-light text-slate-400">AI</span></span>
            </div>
          </MotionDiv>

          <MotionDiv initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Link
              href="/auth/signin"
              className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 group hover:-translate-y-0.5 transition-transform"
            >
              <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-white/10 border border-white/20 px-6 py-1 text-sm font-medium text-white backdrop-blur-3xl transition-all group-hover:bg-white/20">
                Giriş Yap / Kayıt Ol
              </span>
            </Link>
          </MotionDiv>
        </div>
      </header>

      <main className="pt-40 relative z-10">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <MotionDiv initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="text-xs font-medium text-slate-300 tracking-wider">YENİ NESİL GAYRİMENKUL</span>
            </div>
          </MotionDiv>

          <MotionDiv initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[1.1]">
              Boş Odaları <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 drop-shadow-[0_0_40px_rgba(255,255,255,0.2)]">Hayata Döndürün.</span>
            </h1>
          </MotionDiv>

          <MotionDiv initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}>
            <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
              Boş alanların fotoğraflarını yükleyin ve yapay zekamızın onları <span className="text-white font-medium">saniyeler içinde döşemesine</span> izin verin. Göz alıcı fotoğrafları büyüleyici <span className="text-white font-medium">3D video turlarına</span> dönüştürün.
            </p>
          </MotionDiv>

          <MotionDiv initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                href="/auth/signin"
                className="group relative inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.3)]"
              >
                Ücretsiz Başlayın <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <p className="mt-8 text-sm text-slate-500 font-medium">Kayıt olduğunuzda <span className="text-white">10 kredi hediye</span>. Kredi kartı gerekmez.</p>
          </MotionDiv>
        </section>

        <MotionSection
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}
          className="relative py-32 border-t border-white/5 bg-white/[0.02]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-24 tracking-tight">Nasıl Çalışır?</h2>
            <div className="grid md:grid-cols-3 gap-8">

              <MotionDiv whileHover={{ y: -10 }} className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="bg-white/10 w-20 h-20 rounded-3xl flex items-center justify-center mb-8 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)] group-hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all">
                  <ImageIcon className="w-10 h-10 text-white/80" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white tracking-tight">1. Fotoğraf Yükle</h3>
                <p className="text-slate-400 font-light leading-relaxed">Herhangi bir boş odanın fotoğrafını çekin ve projenize saniyeler içinde yükleyin.</p>
              </MotionDiv>

              <MotionDiv whileHover={{ y: -10 }} className="bg-gradient-to-b from-blue-900/20 to-white/5 border border-blue-500/20 p-10 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden group shadow-[0_0_50px_rgba(59,130,246,0.1)] hover:shadow-[0_0_50px_rgba(59,130,246,0.2)] transition-all">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500 rounded-full blur-[80px] opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="bg-blue-500/20 w-20 h-20 rounded-3xl flex items-center justify-center mb-8 border border-blue-500/30">
                  <Sparkles className="w-10 h-10 text-blue-400" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white tracking-tight">2. Yapay Zeka ile Döşe</h3>
                <p className="text-slate-400 font-light leading-relaxed">Bir stil seçin ve gelişmiş modelimizin odayı fotogerçekçi mobilyalarla donatmasını izleyin.</p>
              </MotionDiv>

              <MotionDiv whileHover={{ y: -10 }} className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="bg-white/10 w-20 h-20 rounded-3xl flex items-center justify-center mb-8 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)] group-hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all">
                  <Video className="w-10 h-10 text-white/80" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white tracking-tight">3. Video Oluştur</h3>
                <p className="text-slate-400 font-light leading-relaxed">Sanal olarak döşenmiş mekanınızı anında sinematik 3D video turlarına dönüştürün.</p>
              </MotionDiv>

            </div>
          </div>
        </MotionSection>
      </main>
    </div>
  );
}
