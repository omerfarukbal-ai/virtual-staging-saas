"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FolderPlus, Folder, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";

export default function DashboardPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  const fetchProjects = async () => {
    const res = await fetch("/api/projects");
    if (res.ok) {
      const data = await res.json();
      setProjects(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newProjectName }),
    });

    if (res.ok) {
      const newProject = await res.json();
      setIsModalOpen(false);
      setNewProjectName("");
      router.push(`/dashboard/projects/${newProject.id}`);
    }
    setCreating(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Projelerim</h1>
          <p className="text-slate-500 text-sm mt-1 font-light">Sanal eşyalandırma projelerinizi buradan yönetin.</p>
        </div>

        <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
          <Dialog.Trigger asChild>
            <button className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-slate-800 transition flex items-center gap-2 shadow-sm hover:shadow-md">
              <FolderPlus className="w-4 h-4" /> Yeni Proje
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 transition-opacity" />
            <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-xl rounded-[2rem] p-8 w-full max-w-md shadow-2xl z-50 border border-white focus:outline-none">
              <Dialog.Title className="text-2xl font-semibold mb-6 tracking-tight text-slate-900">Yeni Proje Oluştur</Dialog.Title>
              <form onSubmit={handleCreateProject}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2 ml-1">Proje Adı</label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black focus:border-black outline-none bg-white/50 transition"
                    placeholder="Örn. Atatürk Caddesi No:12"
                  />
                </div>
                <div className="flex justify-end gap-3 mt-8">
                  <Dialog.Close asChild>
                    <button type="button" className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition">İptal</button>
                  </Dialog.Close>
                  <button
                    type="submit"
                    disabled={creating}
                    className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2 transition shadow-sm"
                  >
                    {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                    Oluştur
                  </button>
                </div>
              </form>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      {loading ? (
        <div className="flex justify-center py-32"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>
      ) : projects.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-[2rem] border border-dashed border-slate-200 shadow-sm">
          <FolderPlus className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-slate-900 mb-2 tracking-tight">Henüz proje yok</h3>
          <p className="text-slate-500 mb-6 font-light">Odaları eşyalandırmak için ilk projenizi oluşturun.</p>
          <button onClick={() => setIsModalOpen(true)} className="text-black font-medium hover:underline">Proje oluştur</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
              <div className="bg-white rounded-[1.5rem] border border-slate-100 p-6 shadow-sm hover:shadow-md transition cursor-pointer group hover:-translate-y-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-slate-50 p-4 rounded-2xl text-slate-600 group-hover:bg-black group-hover:text-white transition shadow-inner">
                    <Folder className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-slate-900 line-clamp-1 tracking-tight">{project.name}</h3>
                    <p className="text-xs text-slate-400 font-medium">{new Date(project.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                  <span className="text-sm text-slate-500 font-medium">{project._count.rooms} Oda</span>
                  <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-black transition transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
