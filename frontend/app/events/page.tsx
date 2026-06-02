"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import GlassCard from "@/components/GlassCard";
import { eventApi } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import type { Event } from "@/lib/types";

type SortKey = "title" | "category";

export default function EventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sort, setSort] = useState<SortKey>("title");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    eventApi
      .list()
      .then((res) => setEvents(res.data))
      .catch(() => setError("Could not load events. Start the backend on port 8000."))
      .finally(() => setLoading(false));
  }, []);

  const sorted = useMemo(() => {
    let list = [...events];
    if (filter) {
      const q = filter.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      return a.category.localeCompare(b.category);
    });
    return list;
  }, [events, sort, filter]);

  const canCreate =
    user &&
    ["admin", "club_member", "photographer"].includes(user.role);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-white/50">Browse and explore event albums</p>
        </div>
        {canCreate && (
          <Link href="/events/create" className="btn-primary rounded-xl px-5 py-2.5 text-sm">
            + New Event
          </Link>
        )}
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <input
          placeholder="Filter by name or category..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input-glass rounded-xl px-4 py-2 text-sm md:w-72"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="input-glass rounded-xl px-4 py-2 text-sm"
        >
          <option value="title">Sort by name</option>
          <option value="category">Sort by category</option>
        </select>
      </div>

      {loading && <p className="text-white/50">Loading events...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && sorted.length === 0 && (
        <GlassCard>
          <p className="text-white/60">No events yet. Create one to get started.</p>
        </GlassCard>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((event) => (
          <Link key={event.id} href={`/events/${event.id}`}>
            <GlassCard className="h-full transition-transform hover:-translate-y-1">
              <div className="mb-3 flex items-start justify-between gap-2">
                <h2 className="text-lg font-semibold">{event.title}</h2>
                {event.is_private && (
                  <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-xs">
                    Private
                  </span>
                )}
              </div>
              <p className="mb-3 line-clamp-2 text-sm text-white/55">
                {event.description || "No description"}
              </p>
              <span className="inline-block rounded-full bg-[#7c9cff]/20 px-3 py-1 text-xs text-[#7c9cff]">
                {event.category}
              </span>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
