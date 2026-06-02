"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import GlassCard from "@/components/GlassCard";
import { eventApi } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

export default function CreateEventPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canCreate =
    user &&
    ["admin", "club_member", "photographer"].includes(user.role);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreate) {
      setError("You need admin, club member, or photographer role.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const { data } = await eventApi.create({
        title,
        description,
        category,
        is_private: isPrivate,
      });
      router.push(`/events/${data.event_id}`);
    } catch {
      setError("Failed to create event. Sign in with the right role.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) return null;

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <GlassCard>
          <p className="mb-4">Sign in to create events.</p>
          <Link href="/login" className="btn-primary rounded-xl px-6 py-2">
            Sign in
          </Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <GlassCard strong>
        <h1 className="mb-6 text-2xl font-bold">Create Event</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Event title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-glass w-full rounded-xl px-4 py-3"
          />
          <textarea
            placeholder="Description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-glass w-full resize-none rounded-xl px-4 py-3"
          />
          <input
            placeholder="Category (e.g. Workshop, Fest, Trip)"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-glass w-full rounded-xl px-4 py-3"
          />
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="rounded"
            />
            Private event (members only)
          </label>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full rounded-xl py-3"
          >
            {submitting ? "Creating..." : "Create Event"}
          </button>
        </form>
      </GlassCard>
    </div>
  );
}
