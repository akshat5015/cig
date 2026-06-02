"use client";

import { useState } from "react";
import type { Media } from "@/lib/types";
import { socialApi } from "@/services/api";

interface MediaCardProps {
  media: Media;
  onOpen?: (media: Media) => void;
}

export default function MediaCard({ media, onOpen }: MediaCardProps) {
  const [likes, setLikes] = useState<number | null>(null);
  const [liking, setLiking] = useState(false);

  const loadLikes = async () => {
    if (likes !== null) return;
    try {
      const { data } = await socialApi.getLikes(media.id);
      setLikes(data.likes);
    } catch {
      setLikes(0);
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (liking) return;
    setLiking(true);
    try {
      await socialApi.like(media.id);
      setLikes((prev) => (prev ?? 0) + 1);
    } catch {
      /* already liked or auth required */
    } finally {
      setLiking(false);
    }
  };

  return (
    <article
      className="media-card glass group cursor-pointer overflow-hidden rounded-2xl"
      onClick={() => onOpen?.(media)}
      onMouseEnter={loadLikes}
    >
      <div className="relative aspect-square overflow-hidden bg-black/30">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={media.file_url}
          alt={media.file_name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex w-full items-center justify-between p-3">
            <p className="truncate text-xs text-white/80">{media.file_name}</p>
            <button
              type="button"
              onClick={handleLike}
              className="flex items-center gap-1 rounded-full bg-white/15 px-2 py-1 text-xs backdrop-blur-sm"
            >
              ♥ {likes ?? "—"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
