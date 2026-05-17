import Link from "next/link";
import { ArrowRight, Sparkles, Video, Sofa } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sofa className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-slate-900">StageAI</span>
          </div>
          <Link
            href="/auth/signin"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Giriş Yap / Kayıt Ol
          </Link>
        </div>
      </header>

      <main>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            Boş Odaları <br className="hidden md:block" />
            <span className="text-blue-600">Göz Alıcı Mekanlara Dönüştürün</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Boş alanların fotoğraflarını yükleyin ve yapay zekamızın onları saniyeler içinde döşemesine izin verin. Bu güzel eşyalanmış fotoğrafları büyüleyici video turlarına dönüştürerek satışlarınızı hızlandırın.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/auth/signin"
              className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-lg shadow-blue-200"
            >
              Ücretsiz Başlayın <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <p className="mt-4 text-sm text-slate-500">Kayıt olduğunuzda 10 kredi hediye. Kredi kartı gerekmez.</p>
        </section>

        <section className="bg-white py-20 border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Nasıl Çalışır</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-50 p-8 rounded-2xl text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Fotoğraf Yükle</h3>
                <p className="text-slate-600">Herhangi bir boş odanın fotoğrafını çekin ve projenize yükleyin.</p>
              </div>
              <div className="bg-slate-50 p-8 rounded-2xl text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Yapay Zeka ile Döşe</h3>
                <p className="text-slate-600">Bir stil seçin ve gelişmiş yapay zekamızın odayı gerçekçi, şık mobilyalarla doldurmasına izin verin.</p>
              </div>
              <div className="bg-slate-50 p-8 rounded-2xl text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Video className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Video Oluştur</h3>
                <p className="text-slate-600">Göz alıcı yeni fotoğraflarınızı anında sinematik 3D video turlarına dönüştürün.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
