import Link from "next/link";
import { ArrowRight, Sparkles, Video, Sofa } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="fixed top-0 w-full bg-white/70 backdrop-blur-md z-50 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="bg-black p-2 rounded-xl">
              <Sofa className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-slate-900 tracking-tight">StageAI</span>
          </div>
          <Link
            href="/auth/signin"
            className="bg-black text-white px-6 py-2.5 rounded-full font-medium hover:bg-slate-800 transition shadow-sm hover:shadow-md"
          >
            Giriş Yap / Kayıt Ol
          </Link>
        </div>
      </header>

      <main className="pt-32">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-6xl md:text-7xl font-semibold text-slate-900 tracking-tight mb-8 leading-tight">
            Boş Odaları <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500">Hayata Döndürün.</span>
          </h1>
          <p className="text-xl text-slate-500 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            Boş alanların fotoğraflarını yükleyin ve yapay zekamızın onları saniyeler içinde döşemesine izin verin. Göz alıcı fotoğrafları büyüleyici video turlarına dönüştürün.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/auth/signin"
              className="bg-black text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-slate-800 transition flex items-center gap-2 shadow-xl shadow-black/10 hover:-translate-y-0.5"
            >
              Ücretsiz Başlayın <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <p className="mt-6 text-sm text-slate-400 font-medium">Kayıt olduğunuzda 10 kredi hediye. Kredi kartı gerekmez.</p>
        </section>

        <section className="bg-slate-100/50 py-32 border-t border-slate-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-semibold text-center text-slate-900 mb-20 tracking-tight">Nasıl Çalışır?</h2>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="bg-white p-10 rounded-[2rem] text-center shadow-sm hover:shadow-md transition border border-slate-100">
                <div className="bg-slate-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <span className="text-3xl font-semibold text-slate-900">1</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-slate-900 tracking-tight">Fotoğraf Yükle</h3>
                <p className="text-slate-500 font-light leading-relaxed">Herhangi bir boş odanın fotoğrafını çekin ve projenize kolayca yükleyin.</p>
              </div>
              <div className="bg-white p-10 rounded-[2rem] text-center shadow-sm hover:shadow-md transition border border-slate-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none"></div>
                <div className="bg-blue-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner relative z-10">
                  <Sparkles className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-slate-900 tracking-tight relative z-10">Yapay Zeka ile Döşe</h3>
                <p className="text-slate-500 font-light leading-relaxed relative z-10">Bir stil seçin ve gelişmiş modelimizin odayı gerçekçi mobilyalarla donatmasını izleyin.</p>
              </div>
              <div className="bg-white p-10 rounded-[2rem] text-center shadow-sm hover:shadow-md transition border border-slate-100">
                <div className="bg-slate-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <Video className="w-10 h-10 text-slate-900" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-slate-900 tracking-tight">Video Oluştur</h3>
                <p className="text-slate-500 font-light leading-relaxed">Sanal olarak döşenmiş mekanınızı anında sinematik 3D video turlarına dönüştürün.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
