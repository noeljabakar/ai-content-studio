"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

type Generation = {
  id: string;
  content_type: string;
  tone: string;
  topic: string;
  output: string;
  created_at: string;
};

export default function HistoryPage() {
  const [supabase] = useState(() => createClient());
  const [items, setItems] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("generations")
        .select("id, content_type, tone, topic, output, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        setError("Could not load your history.");
      } else {
        setItems(data ?? []);
      }
      setLoading(false);
    }
    load();
  }, [supabase]);

  async function handleCopy(item: Generation) {
    try {
      await navigator.clipboard.writeText(item.output);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      setError("Could not copy to clipboard.");
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this generation? This cannot be undone.")) return;

    const { error } = await supabase.from("generations").delete().eq("id", id);

    if (error) {
      setError("Could not delete. Please try again.");
      return;
    }
    // Remove it from the screen without reloading
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">History</h1>
        <Link href="/" className="border px-3 py-1 rounded">
          ← Back to generator
        </Link>
      </div>

      {error && <p className="mb-4 text-red-500">{error}</p>}

      {loading && <p>Loading...</p>}

      {!loading && items.length === 0 && !error && (
        <p>No generations yet. Go create your first one!</p>
      )}

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="border rounded p-4">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <p className="font-medium">
                  {item.content_type} · {item.tone}
                </p>
                <p className="text-sm opacity-70">
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleCopy(item)}
                  className="border px-3 py-1 rounded"
                >
                  {copiedId === item.id ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="border border-red-500 text-red-500 px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>

            <p className="text-sm mb-2">
              <span className="font-medium">Topic:</span> {item.topic}
            </p>
            <p className="whitespace-pre-wrap">{item.output}</p>
          </div>
        ))}
      </div>
    </main>
  );
}