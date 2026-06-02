"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import GlassCard from "@/components/GlassCard";
import MediaCard from "@/components/MediaCard";
import MediaModal from "@/components/MediaModal";
import { socialApi } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import type { Media } from "@/lib/types";

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const [media, setMedia] = useState<Media[]>([]);
  const [selected, setSelected] = useState<Media | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    socialApi
      .myFavorites()
      .then((res) => setMedia(res.data))
      .catch(() => setMedia([]))
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center text-white/50">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <GlassCard>
          <p className="mb-4">Sign in to view your favorites.</p>
          <Link href="/login" className="btn-primary rounded-xl px-6 py-2">
            Sign in
          </Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold">Favorites</h1>
      <p className="mb-8 text-white/50">Photos you&apos;ve saved</p>

      {media.length === 0 ? (
        <GlassCard>
          <p className="text-white/60">
            No favorites yet. Heart photos from any event album.
          </p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {media.map((m) => (
            <MediaCard key={m.id} media={m} onOpen={setSelected} />
          ))}
        </div>
      )}

      <MediaModal media={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
