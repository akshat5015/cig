"use client";

import { useState } from "react";
import GlassCard from "@/components/GlassCard";
import MediaCard from "@/components/MediaCard";
import MediaModal from "@/components/MediaModal";
import { socialApi } from "@/services/api";
import type { Media } from "@/lib/types";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Media[]>([]);
  const [selected, setSelected] = useState<Media | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const { data } = await socialApi.search(query.trim());
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold">Search</h1>
      <p className="mb-8 text-white/50">
        Search by event name, AI tags, or uploader
      </p>

      <form onSubmit={handleSearch} className="mb-8 flex gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try mountains, workshop, username..."
          className="input-glass flex-1 rounded-xl px-4 py-3"
        />
        <button type="submit" disabled={loading} className="btn-primary rounded-xl px-6 py-3">
          {loading ? "..." : "Search"}
        </button>
      </form>

      {searched && results.length === 0 && !loading && (
        <GlassCard>
          <p className="text-white/60">No results for &ldquo;{query}&rdquo;</p>
        </GlassCard>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {results.map((m) => (
          <MediaCard key={m.id} media={m} onOpen={setSelected} />
        ))}
      </div>

      <MediaModal media={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
