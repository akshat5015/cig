"use client";

import { useState } from "react";
import GlassCard from "@/components/GlassCard";
import MediaCard from "@/components/MediaCard";
import MediaModal from "@/components/MediaModal";
import { faceApi } from "@/services/api";
import type { FaceMatch, Media } from "@/lib/types";

export default function FindPhotosPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [matches, setMatches] = useState<Media[]>([]);
  const [selected, setSelected] = useState<Media | null>(null);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [error, setError] = useState("");

  const handleFile = async (file: File) => {
    setPreview(URL.createObjectURL(file));
    setLoading(true);
    setError("");
    setMatches([]);
    try {
      const { data } = await faceApi.findPhotos(file);
      setCount(data.matches_found);
      const mediaList: Media[] = data.matches.map((m: FaceMatch) => ({
        id: m.media_id,
        file_url: m.file_url,
        file_name: `match-${m.media_id}`,
        uploaded_by: 0,
        event_id: 0,
      }));
      setMatches(mediaList);
    } catch {
      setError("Face search failed. Ensure backend and Rekognition are configured.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold">Find My Photos</h1>
      <p className="mb-8 text-white/50">
        Upload a selfie — we&apos;ll find every event photo you appear in
      </p>

      <GlassCard className="mb-8 max-w-xl">
        <label className="flex cursor-pointer flex-col items-center gap-4 py-6">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="Your selfie"
              className="h-32 w-32 rounded-full object-cover ring-2 ring-[#7c9cff]/50"
            />
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white/10 text-4xl">
              📷
            </div>
          )}
          <span className="btn-primary rounded-xl px-6 py-2 text-sm">
            {loading ? "Scanning..." : "Upload selfie"}
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={loading}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </label>
      </GlassCard>

      {error && <p className="mb-4 text-red-400">{error}</p>}

      {count > 0 && (
        <p className="mb-4 text-[#5eead4]">
          Found {count} matching photo{count !== 1 ? "s" : ""}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {matches.map((m) => (
          <MediaCard key={m.id} media={m} onOpen={setSelected} />
        ))}
      </div>

      <MediaModal media={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
