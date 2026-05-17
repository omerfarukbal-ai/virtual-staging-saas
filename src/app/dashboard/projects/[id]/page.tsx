"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { UploadCloud, Loader2, Sparkles, Video, PlayCircle, RefreshCw, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const THEMES = ["Modern", "Classic", "Minimalist", "Industrial", "Scandinavian", "Bohemian", "Coastal"];

export default function ProjectDetail() {
  const params = useParams();
  const { update } = useSession();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [roomName, setRoomName] = useState("");
  const [theme, setTheme] = useState(THEMES[0]);
  const [customPrompt, setCustomPrompt] = useState("");
  const [uploading, setUploading] = useState(false);

  const fetchProject = async () => {
    const res = await fetch(`/api/projects/${params.id}`);
    if (res.ok) {
      setProject(await res.json());
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProject();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  useEffect(() => {
    const hasProcessingRooms = project?.rooms?.some((r: any) => r.status === "PROCESSING");
    if (!hasProcessingRooms) return;

    const interval = setInterval(() => {
      fetchProject();
    }, 5000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.rooms]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleUploadAndStage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !roomName) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const { url: originalImage } = await uploadRes.json();

      if (!originalImage) throw new Error("Upload failed");

      const stageRes = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: params.id,
          name: roomName,
          originalImage,
          theme,
          customPrompt
        })
      });

      if (!stageRes.ok) {
        const err = await stageRes.json();
        alert(err.error || "Failed to start staging");
      }

      setFile(null);
      setPreview(null);
      setRoomName("");
      setCustomPrompt("");
      await update();
      fetchProject();
    } catch (error) {
      console.error(error);
      alert("Bir hata oluştu");
    } finally {
      setUploading(false);
    }
  };

  const handleGenerateVideo = async (roomId: string) => {
    try {
      const res = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to generate video");
      } else {
        await update();
        fetchProject();
      }
    } catch (e) {
      alert("Video oluşturulurken hata");
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  if (!project) return <div>Proje bulunamadı</div>;

  return (
    <div>
      <div className="mb-10">
        <Link href="/dashboard" className="text-slate-400 hover:text-black flex items-center gap-1.5 text-sm font-medium mb-3 transition w-max">
          <ChevronLeft className="w-4 h-4" /> Projelere Dön
        </Link>
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">{project.name}</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-slate-100 p-8 sticky top-28 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2 tracking-tight">
              <Sparkles className="w-5 h-5 text-black" /> Yeni Oda Eşyalandır
            </h2>
            <form onSubmit={handleUploadAndStage} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 ml-1">Oda Adı</label>
                <input
                  type="text"
                  required
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Örn. Yatak Odası"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 ml-1">Fotoğraf</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 border-dashed rounded-xl relative overflow-hidden group hover:border-black transition bg-slate-50/50 cursor-pointer">
                  {preview ? (
                    <div className="absolute inset-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition backdrop-blur-sm">
                        <p className="text-white text-sm font-medium flex items-center gap-2"><RefreshCw className="w-4 h-4"/> Değiştir</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 text-center">
                      <UploadCloud className="mx-auto h-10 w-10 text-slate-300 group-hover:text-black transition transform group-hover:-translate-y-1" />
                      <div className="flex text-sm text-slate-600 justify-center">
                        <label className="relative cursor-pointer rounded-md font-medium text-black focus-within:outline-none">
                          <span>Dosya seçin</span> veya sürükleyin
                        </label>
                      </div>
                      <p className="text-xs text-slate-400 font-light">PNG, JPG maks 10MB</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required={!file} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 ml-1">Stil Teması</label>
                <div className="relative">
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none bg-slate-50/50 appearance-none transition"
                  >
                    {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <ChevronLeft className="w-4 h-4 text-slate-400 -rotate-90" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 ml-1">Özel İstem (İsteğe Bağlı)</label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Örn. Büyük kırmızı bir deri kanepe ve cam sehpa ekle..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none resize-none h-24 transition bg-slate-50/50"
                />
              </div>

              <button
                type="submit"
                disabled={uploading || !file || !roomName}
                className="w-full bg-black text-white py-3.5 rounded-xl font-medium hover:bg-slate-800 disabled:opacity-50 transition flex items-center justify-center gap-2 shadow-sm hover:shadow-md mt-4"
              >
                {uploading ? <><Loader2 className="w-5 h-5 animate-spin" /> İşleniyor (-1 Kredi)</> : "Odayı Eşyalandır (-1 Kredi)"}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          {project.rooms.length === 0 ? (
            <div className="text-center py-32 bg-white/50 backdrop-blur-sm rounded-[2rem] border border-dashed border-slate-200 shadow-sm">
              <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-slate-900 mb-2 tracking-tight">Henüz oda eşyalandırılmadı</h3>
              <p className="text-slate-500 font-light">Yapay zeka büyüsünü görmek için bir fotoğraf yükleyin.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-8">
              {project.rooms.map((room: any) => (
                <div key={room.id} className="bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col group hover:-translate-y-1">
                  <div className="relative aspect-[4/3] bg-slate-100 flex-shrink-0">
                    {room.status === "PROCESSING" ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md z-10">
                        <div className="bg-black/5 p-4 rounded-full mb-3">
                          <RefreshCw className="w-6 h-6 text-black animate-spin" />
                        </div>
                        <span className="text-sm font-medium text-slate-700 tracking-tight">Eşyalandırılıyor...</span>
                      </div>
                    ) : room.stagedImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={room.stagedImage} alt="Staged" className="w-full h-full object-cover" />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={room.originalImage} alt="Original" className="w-full h-full object-cover grayscale opacity-50" />
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg text-slate-900 tracking-tight">{room.name}</h3>
                        <p className="text-xs text-slate-400 font-medium mt-1">{room.theme} Tarzı</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        room.status === 'COMPLETED' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {room.status === 'COMPLETED' ? 'TAMAMLANDI' : 'BEKLİYOR'}
                      </span>
                    </div>

                    <div className="mt-auto pt-5 border-t border-slate-50">
                      {room.videoUrl ? (
                        <a href={room.videoUrl} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-black transition shadow-sm">
                          <PlayCircle className="w-5 h-5" /> Videoyu İzle
                        </a>
                      ) : room.status === "COMPLETED" ? (
                        <button
                          onClick={() => handleGenerateVideo(room.id)}
                          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-50 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-100 transition border border-slate-200 hover:text-black"
                        >
                          <Video className="w-5 h-5" /> Videoya Çevir (1 Kredi)
                        </button>
                      ) : (
                        <div className="h-[46px]"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
