"use client";

import { useEffect, useState } from "react";
import type { Media, Comment } from "@/lib/types";
import { socialApi } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

interface MediaModalProps {
  media: Media | null;
  onClose: () => void;
}

export default function MediaModal({ media, onClose }: MediaModalProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [likes, setLikes] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!media) return;
    const load = async () => {
      try {
        const [likesRes, commentsRes] = await Promise.all([
          socialApi.getLikes(media.id),
          socialApi.getComments(media.id),
        ]);
        setLikes(likesRes.data.likes);
        setComments(commentsRes.data);
      } catch {
        /* ignore */
      }
    };
    load();
  }, [media]);

  if (!media) return null;

  const handleComment = async () => {
    if (!text.trim() || !user) return;
    try {
      await socialApi.comment(media.id, text);
      setText("");
      const { data } = await socialApi.getComments(media.id);
      setComments(data);
      setStatus("Comment posted");
      setTimeout(() => setStatus(""), 2000);
    } catch {
      setStatus("Sign in to comment");
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      setStatus("Sign in to save favorites");
      return;
    }
    try {
      await socialApi.favorite(media.id);
      setStatus("Added to favorites");
      setTimeout(() => setStatus(""), 2000);
    } catch {
      setStatus("Could not add favorite");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal
    >
      <div
        className="glass-strong flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 bg-black/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={media.file_url}
            alt={media.file_name}
            className="max-h-[50vh] w-full object-contain md:max-h-[90vh]"
          />
        </div>
        <div className="flex w-full flex-col gap-4 p-5 md:w-80">
          <div>
            <h3 className="font-medium">{media.file_name}</h3>
            <p className="text-sm text-white/50">{likes} likes</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => socialApi.like(media.id).then(() => setLikes((l) => l + 1))} className="btn-ghost rounded-lg px-3 py-1.5 text-sm">
              Like
            </button>
            <button type="button" onClick={handleFavorite} className="btn-ghost rounded-lg px-3 py-1.5 text-sm">
              Favorite
            </button>
            <a
              href={socialApi.downloadUrl(media.id)}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost rounded-lg px-3 py-1.5 text-sm"
            >
              Download
            </a>
          </div>

          {status && <p className="text-xs text-[#5eead4]">{status}</p>}

          <div className="flex-1 space-y-2 overflow-y-auto">
            {comments.length === 0 ? (
              <p className="text-sm text-white/40">No comments yet</p>
            ) : (
              comments.map((c) => (
                <p key={c.id} className="rounded-lg bg-white/5 px-3 py-2 text-sm">
                  {c.text}
                </p>
              ))
            )}
          </div>

          <div className="flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a comment..."
              className="input-glass flex-1 rounded-lg px-3 py-2 text-sm"
            />
            <button type="button" onClick={handleComment} className="btn-primary rounded-lg px-3 py-2 text-sm">
              Post
            </button>
          </div>

          <button type="button" onClick={onClose} className="text-sm text-white/50 hover:text-white">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
