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
    const interval = setInterval(() => {
      if (project?.rooms?.some((r: any) => r.status === "PROCESSING")) {
        fetchProject();
      }
    }, 5000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, project?.rooms]);

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
      <div className="mb-6">
        <Link href="/dashboard" className="text-slate-500 hover:text-blue-600 flex items-center gap-1 text-sm font-medium mb-2">
          <ChevronLeft className="w-4 h-4" /> Projelere Dön
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border p-6 sticky top-24">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" /> Yeni Oda Eşyalandır
            </h2>
            <form onSubmit={handleUploadAndStage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Oda Adı</label>
                <input
                  type="text"
                  required
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Örn. Yatak Odası"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fotoğraf</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg relative overflow-hidden group">
                  {preview ? (
                    <div className="absolute inset-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <p className="text-white text-sm font-medium">Değiştirmek için tıkla</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1 text-center">
                      <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          <span>Dosya yükle</span>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG maks 10MB</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required={!file} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Stil Teması</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Özel İstem (İsteğe Bağlı)</label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Örn. Büyük kırmızı bir deri kanepe ve cam sehpa ekle..."
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none h-20"
                />
              </div>

              <button
                type="submit"
                disabled={uploading || !file || !roomName}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
              >
                {uploading ? <><Loader2 className="w-5 h-5 animate-spin" /> İşleniyor (-1 Kredi)</> : "Odayı Eşyalandır (-1 Kredi)"}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          {project.rooms.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
              <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-1">Henüz oda eşyalandırılmadı</h3>
              <p className="text-slate-500">Yapay zeka büyüsünü görmek için bir fotoğraf yükleyin.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {project.rooms.map((room: any) => (
                <div key={room.id} className="bg-white rounded-xl border overflow-hidden shadow-sm flex flex-col">
                  <div className="relative aspect-video bg-slate-100 flex-shrink-0">
                    {room.status === "PROCESSING" ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-sm z-10">
                        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mb-2" />
                        <span className="text-sm font-medium text-slate-700">Eşyalandırılıyor...</span>
                      </div>
                    ) : room.stagedImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={room.stagedImage} alt="Staged" className="w-full h-full object-cover" />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={room.originalImage} alt="Original" className="w-full h-full object-cover grayscale opacity-50" />
                    )}
                  </div>

                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-slate-900">{room.name}</h3>
                        <p className="text-xs text-slate-500">{room.theme} Style</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                        room.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {room.status}
                      </span>
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-100">
                      {room.videoUrl ? (
                        <a href={room.videoUrl} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition">
                          <PlayCircle className="w-4 h-4" /> Videoyu İzle
                        </a>
                      ) : room.status === "COMPLETED" ? (
                        <button
                          onClick={() => handleGenerateVideo(room.id)}
                          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition"
                        >
                          <Video className="w-4 h-4" /> Videoya Çevir (1 Kredi)
                        </button>
                      ) : (
                        <div className="h-9"></div>
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
