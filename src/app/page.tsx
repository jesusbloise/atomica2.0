"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f || null);
    setPreview(f ? URL.createObjectURL(f) : null);
    setStatus("");
  };

  const onUpload = async () => {
    if (!file) {
      setStatus("Selecciona un archivo primero.");
      return;
    }
    try {
      setStatus("Subiendo...");
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Error al subir");
      }

      const data = await res.json();
      setStatus(`OK: Guardado como ${data.filename}`);
    } catch (err: any) {
      setStatus(`Error: ${err.message || "falló la subida"}`);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-xl w-full border border-white/10 rounded-2xl p-6 bg-white/5 backdrop-blur">
        <h1 className="text-2xl font-semibold mb-4">Subir video</h1>

        <label className="inline-flex items-center px-4 py-2 rounded-xl border border-white/20 hover:border-white/40 cursor-pointer">
          <input
            type="file"
            accept="video/*"
            className="hidden"
            onChange={onSelect}
          />
          Elegir archivo
        </label>

        {file && (
          <p className="mt-2 text-sm text-white/80">
            Seleccionado: {file.name} ({Math.round(file.size / 1024)} KB)
          </p>
        )}

        {preview && (
          <div className="mt-4">
            <video
              src={preview}
              className="w-full rounded-xl border border-white/10"
              controls
            />
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={onUpload}
            className="px-4 py-2 rounded-xl bg-white text-black hover:bg-white/90"
          >
            Subir
          </button>
          <button
            onClick={() => {
              setFile(null);
              setPreview(null);
              setStatus("");
            }}
            className="px-4 py-2 rounded-xl border border-white/20 hover:border-white/40"
          >
            Limpiar
          </button>
        </div>

        {status && <p className="mt-4 text-sm text-white/80">{status}</p>}
      </div>
    </main>
  );
}
