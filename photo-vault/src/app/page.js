"use client";

import { useEffect, useState } from "react";

function formatSize(bytes) {
  if (!bytes) return "-";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export default function Home() {
  const [photos, setPhotos] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadPhotos = async () => {
    try {
      const response = await fetch("/api/photos", { cache: "no-store" });
      const data = await response.json();
      setPhotos(data.photos || []);
    } catch {
      setMessage("Failed to load photos.");
    }
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!selectedFile) return;

    try {
      setLoading(true);
      setMessage("");
      const formData = new FormData();
      formData.append("photo", selectedFile);

      const response = await fetch("/api/photos", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Upload failed.");
        return;
      }

      setSelectedFile(null);
      setMessage("Photo uploaded successfully.");
      await loadPhotos();
    } catch {
      setMessage("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (publicId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/photos?publicId=${encodeURIComponent(publicId)}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || "Delete failed.");
        return;
      }
      setMessage("Photo deleted.");
      await loadPhotos();
    } catch {
      setMessage("Delete failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8 text-slate-900">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">My Photo Vault</h1>
        <p className="mt-1 text-sm text-slate-600">
          Upload and save your photos online. Ready for Vercel deployment.
        </p>

        <form onSubmit={handleUpload} className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={!selectedFile || loading}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Working..." : "Upload Photo"}
          </button>
        </form>

        {message ? <p className="mt-3 text-sm text-slate-600">{message}</p> : null}
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Saved Photos</h2>
          <button
            onClick={loadPhotos}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
          >
            Refresh
          </button>
        </div>

        {photos.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
            No photos yet. Upload your first one.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => (
              <article key={photo.publicId} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <img
                  src={photo.url}
                  alt={photo.publicId}
                  className="h-52 w-full object-cover"
                />
                <div className="space-y-1 p-3 text-sm text-slate-600">
                  <p className="truncate font-medium text-slate-800">{photo.publicId}</p>
                  <p>{new Date(photo.createdAt).toLocaleString()}</p>
                  <p>{formatSize(photo.bytes)}</p>
                  <button
                    onClick={() => handleDelete(photo.publicId)}
                    className="mt-2 rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
