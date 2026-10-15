"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
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
    if (!window.confirm("Delete this generation? This cannot be undone.")) {
      return;
    }

    const { error } = await supabase
      .from("generations")
      .delete()
      .eq("id", id);

    if (error) {
      setError("Could not delete. Please try again.");
      return;
    }

    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <main className="history-page min-h-screen overflow-hidden px-5 py-8 text-white sm:px-8 lg:px-12">
      <div className="history-orb history-orb-one" />
      <div className="history-orb history-orb-two" />

      <div className="history-container mx-auto w-full max-w-5xl">
        <header className="mb-12 flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="history-logo flex h-14 w-14 items-center justify-center rounded-2xl text-2xl">
              ✦
            </div>
            <div>
              <p className="text-xl font-bold tracking-tight">
                AI Content Studio
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Your ideas, saved in one creative space
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="history-button inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
          >
            <span aria-hidden="true">←</span>
            Back to generator
          </Link>
        </header>

        <section className="mb-9">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
            Your creative journey
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Generation{" "}
            <span className="history-gradient-text">History.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
            Revisit your ideas, copy your favourite creations, or remove
            content you no longer need.
          </p>
        </section>

        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Your saved content</h2>
            <p className="mt-1 text-sm text-slate-400">
              {items.length} {items.length === 1 ? "generation" : "generations"} saved
            </p>
          </div>
          <span className="history-badge rounded-full px-3 py-2 text-xs font-medium text-cyan-200">
            ✦ Personal workspace
          </span>
        </div>

        {error && (
          <p
            role="alert"
            className="mb-5 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200"
          >
            {error}
          </p>
        )}

        {loading && (
          <div className="history-panel rounded-2xl p-10 text-center text-slate-300">
            <div className="history-spinner mx-auto mb-4 h-8 w-8 rounded-full border-2 border-cyan-300/20 border-t-cyan-300" />
            Loading your saved creations...
          </div>
        )}

        {!loading && items.length === 0 && !error && (
          <div className="history-panel rounded-2xl px-6 py-16 text-center">
            <div className="history-logo mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl">
              ✦
            </div>
            <h2 className="text-xl font-bold">Your story starts here</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
              You haven&apos;t saved any generations yet. Head to your
              generator and turn your next idea into something remarkable.
            </p>
            <Link
              href="/"
              className="history-generate-button mt-6 inline-flex rounded-xl px-6 py-3 font-semibold text-white"
            >
              Create your first piece
            </Link>
          </div>
        )}

        <div className="space-y-6">
          {items.map((item) => (
            <article
              key={item.id}
              className="history-panel overflow-hidden rounded-2xl"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/[0.08] px-5 py-5 sm:px-7">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="history-badge rounded-full px-3 py-1.5 text-xs font-semibold capitalize text-cyan-200">
                      {item.content_type}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs capitalize text-slate-300">
                      {item.tone}
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-slate-500">
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(item)}
                    className="history-button rounded-lg px-4 py-2 text-sm font-medium"
                  >
                    {copiedId === item.id ? "✓ Copied!" : "Copy"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="history-delete-button rounded-lg px-4 py-2 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="px-5 py-6 sm:px-7 sm:py-7">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Original topic
                </p>
                <p className="mb-6 text-sm leading-6 text-slate-200">
                  {item.topic}
                </p>

                <div className="history-content prose prose-invert max-w-none">
                  <ReactMarkdown>{item.output}</ReactMarkdown>
                </div>
              </div>
            </article>
          ))}
        </div>

        <footer className="py-10 text-center text-xs text-slate-500">
          AI Content Studio · Your ideas, always within reach
        </footer>
      </div>

      <style jsx global>{`
        .history-page {
          position: relative;
          isolation: isolate;
          background:
            radial-gradient(ellipse at 90% 5%, rgba(29, 78, 216, 0.2), transparent 36%),
            radial-gradient(ellipse at 0% 45%, rgba(124, 58, 237, 0.12), transparent 34%),
            #030712;
          font-family: Arial, Helvetica, sans-serif;
        }

        .history-page::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          background-image: radial-gradient(rgba(125, 180, 255, 0.32) 0.8px, transparent 0.8px);
          background-size: 34px 34px;
          opacity: 0.22;
        }

        .history-container {
          position: relative;
          z-index: 1;
        }

        .history-orb {
          position: absolute;
          z-index: -1;
          pointer-events: none;
          border-radius: 50%;
          filter: blur(1px);
        }

        .history-orb-one {
          width: 300px;
          height: 300px;
          top: 80px;
          right: -100px;
          background: radial-gradient(circle at 35% 30%, rgba(59, 130, 246, 0.22), rgba(76, 29, 149, 0.12) 60%, transparent 72%);
          border: 1px solid rgba(96, 165, 250, 0.18);
        }

        .history-orb-two {
          width: 220px;
          height: 220px;
          top: 480px;
          left: -140px;
          background: radial-gradient(circle, rgba(124, 58, 237, 0.12), transparent 70%);
        }

        .history-logo {
          background: linear-gradient(145deg, rgba(8, 145, 178, 0.2), rgba(30, 64, 175, 0.12));
          border: 1px solid rgba(34, 211, 238, 0.35);
          box-shadow: 0 0 30px rgba(34, 211, 238, 0.08);
        }

        .history-gradient-text {
          background: linear-gradient(100deg, #67e8f9, #818cf8 55%, #c084fc);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .history-panel {
          background: rgba(7, 13, 31, 0.78);
          border: 1px solid rgba(129, 140, 248, 0.24);
          box-shadow: 0 15px 50px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.025);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }

        .history-button {
          color: #e2e8f0;
          background: rgba(255, 255, 255, 0.045);
          border: 1px solid rgba(148, 163, 184, 0.24);
          transition: background 180ms ease, border-color 180ms ease, transform 180ms ease;
        }

        .history-button:hover {
          background: rgba(59, 130, 246, 0.13);
          border-color: rgba(103, 232, 249, 0.45);
          transform: translateY(-1px);
        }

        .history-delete-button {
          color: #fda4af;
          background: rgba(244, 63, 94, 0.07);
          border: 1px solid rgba(251, 113, 133, 0.25);
          transition: background 180ms ease;
        }

        .history-delete-button:hover {
          background: rgba(244, 63, 94, 0.16);
        }

        .history-badge {
          background: rgba(8, 145, 178, 0.12);
          border: 1px solid rgba(34, 211, 238, 0.2);
        }

        .history-generate-button {
          background: linear-gradient(100deg, #0891b2, #4f46e5 60%, #9333ea);
          box-shadow: 0 5px 24px rgba(79, 70, 229, 0.2);
          transition: filter 180ms ease, transform 180ms ease;
        }

        .history-generate-button:hover {
          filter: brightness(1.15);
          transform: translateY(-1px);
        }

        .history-spinner {
          animation: history-spin 0.8s linear infinite;
        }

        @keyframes history-spin {
          to { transform: rotate(360deg); }
        }

        .history-content {
          color: #dbe4f0;
          overflow-wrap: anywhere;
          font-size: 0.95rem;
          line-height: 1.85;
        }

        .history-content h1,
        .history-content h2,
        .history-content h3 {
          color: #f8fafc;
          font-weight: 700;
          line-height: 1.35;
          margin-top: 1.6em;
          margin-bottom: 0.65em;
        }

        .history-content h1 { font-size: 1.7rem; }
        .history-content h2 { font-size: 1.35rem; }
        .history-content h3 { font-size: 1.1rem; }

        .history-content p {
          margin: 0.9em 0;
        }

        .history-content ul,
        .history-content ol {
          padding-left: 1.5rem;
          margin: 1em 0;
        }

        .history-content ul { list-style: disc; }
        .history-content ol { list-style: decimal; }
        .history-content li { margin: 0.4em 0; }

        .history-content strong {
          color: #ffffff;
          font-weight: 700;
        }

        .history-content a {
          color: #67e8f9;
          text-decoration: underline;
        }

        .history-content blockquote {
          margin: 1.2em 0;
          padding: 0.8em 1em;
          border-left: 3px solid #818cf8;
          background: rgba(129, 140, 248, 0.07);
          color: #cbd5e1;
        }

        .history-content pre {
          overflow-x: auto;
          padding: 1rem;
          border: 1px solid rgba(148, 163, 184, 0.18);
          border-radius: 0.75rem;
          background: rgba(0, 0, 0, 0.3);
        }

        .history-content code {
          color: #a5f3fc;
        }

        @media (max-width: 640px) {
          .history-orb-one {
            width: 200px;
            height: 200px;
            right: -130px;
          }

          .history-content h1 { font-size: 1.45rem; }
          .history-content h2 { font-size: 1.2rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          .history-spinner { animation: none; }
          .history-button,
          .history-generate-button { transition: none; }
        }
      `}</style>
    </main>
  );
}