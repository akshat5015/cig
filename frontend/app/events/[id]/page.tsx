"use client";

import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import GlassCard from "@/components/GlassCard";
import MediaCard from "@/components/MediaCard";
import MediaModal from "@/components/MediaModal";
import UploadDropzone from "@/components/UploadDropzone";
import { eventApi, mediaApi } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import type { Event, Media } from "@/lib/types";

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const eventId = Number(id);
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [media, setMedia] = useState<Media[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<Media | null>(null);
  const [loading, setLoading] = useState(true);

  const limit = 12;

  const loadMedia = useCallback(async (p: number) => {
    const { data } = await mediaApi.byEvent(eventId, p, limit);
    if (p === 1) {
      setMedia(data.media);
    } else {
      setMedia((prev) => [...prev, ...data.media]);
    }
    setTotal(data.total_media);
    setPage(data.page);
  }, [eventId]);

  useEffect(() => {
    const load = async () => {
      try {
        const eventsRes = await eventApi.list();
        const found = eventsRes.data.find((e: Event) => e.id === eventId);
        setEvent(found ?? null);
        await loadMedia(1);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [eventId, loadMedia]);

  const canUpload =
    user && ["admin", "photographer"].includes(user.role);

  const handleUpload = async (files: File[]) => {
    if (files.length === 1) {
      await mediaApi.upload(eventId, files[0]);
    } else {
      await mediaApi.bulkUpload(eventId, files);
    }
    await loadMedia(1);
  };

  const hasMore = media.length < total;

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center text-white/50">
        Loading event...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <p className="mb-4">Event not found</p>
        <Link href="/events" className="text-[#7c9cff] hover:underline">
          Back to events
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link href="/events" className="mb-4 inline-block text-sm text-white/50 hover:text-white">
        ← All events
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">{event.title}</h1>
        <p className="mt-2 text-white/60">{event.description}</p>
        <div className="mt-3 flex gap-2">
          <span className="rounded-full bg-[#7c9cff]/20 px-3 py-1 text-xs text-[#7c9cff]">
            {event.category}
          </span>
          {event.is_private && (
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs">Private</span>
          )}
        </div>
      </div>

      {canUpload && (
        <GlassCard className="mb-8">
          <h2 className="mb-4 font-semibold">Upload Media</h2>
          <UploadDropzone onUpload={handleUpload} />
        </GlassCard>
      )}

      {media.length === 0 ? (
        <GlassCard>
          <p className="text-white/60">No media in this album yet.</p>
        </GlassCard>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {media.map((m) => (
              <MediaCard key={m.id} media={m} onOpen={setSelected} />
            ))}
          </div>
          {hasMore && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => loadMedia(page + 1)}
                className="btn-ghost rounded-xl px-6 py-2.5 text-sm"
              >
                Load more
              </button>
            </div>
          )}
        </>
      )}

      <MediaModal media={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
