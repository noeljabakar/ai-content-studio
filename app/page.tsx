
"use client";

import ReactMarkdown from "react-markdown";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

const CONTENT_TYPES = [
  "blog post",
  "LinkedIn post",
  "email",
  "tweet",
  "product description",
];

const TONES = [
  "professional",
  "casual",
  "friendly",
  "persuasive",
  "humorous",
];

export default function Home() {
  const supabase = createClient();
  const router = useRouter();

  const [type, setType] = useState(CONTENT_TYPES[0]);
  const [tone, setTone] = useState(TONES[0]);
  const [topic, setTopic] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/login");
    router.refresh();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!topic.trim()) {
      setError("Please enter a topic to get started.");
      return;
    }

    setLoading(true);
    setError("");
    setOutput("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, tone, topic }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setOutput(data.output);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030611] text-white">
      {/* Cosmic background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-[-8rem] h-[28rem] w-[28rem] rounded-full bg-blue-600/20 blur-[100px]" />
        <div className="absolute left-[-10rem] top-[30rem] h-[25rem] w-[25rem] rounded-full bg-purple-600/20 blur-[110px]" />
        <div className="absolute bottom-[-15rem] right-[20%] h-[30rem] w-[30rem] rounded-full bg-cyan-500/10 blur-[120px]" />

        <div className="absolute right-[8%] top-12 h-64 w-64 rounded-full border border-blue-400/20 bg-gradient-to-br from-blue-500/20 via-indigo-900/30 to-purple-700/20 shadow-[0_0_80px_rgba(59,130,246,0.18)]" />
        <div className="absolute right-[10%] top-14 h-64 w-64 rounded-full bg-gradient-to-br from-transparent via-blue-400/10 to-purple-500/20" />

        <div className="absolute left-[5%] top-[30rem] h-40 w-40 rounded-full border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 to-blue-900/20 shadow-[0_0_60px_rgba(34,211,238,0.15)]" />

        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(#60a5fa_1px,transparent_1px)] [background-size:46px_46px]" />
      </div>

      {/* Main workspace */}
      <div className="relative mx-auto max-w-[1500px] px-4 py-6 sm:px-8 lg:px-12 lg:py-10">

        {/* Header */}
        <header className="mb-10 flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-400/10 text-2xl shadow-[0_0_25px_rgba(34,211,238,0.12)]">
              ✦
            </div>

            <div>
              <p className="text-lg font-semibold tracking-wide">
                AI Content Studio
              </p>
              <p className="text-xs text-slate-400">
                Your creative space, powered by AI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/history"
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-slate-200 transition hover:border-cyan-300/50 hover:bg-white/10"
            >
              History
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-slate-200 transition hover:border-purple-300/50 hover:bg-white/10"
            >
              Sign out
            </button>
          </div>
        </header>

        {/* Welcome section */}
        <section className="mb-8 max-w-3xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-cyan-300">
            Your ideas start here
          </p>

          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Create something{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              remarkable.
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            Turn your ideas into thoughtful blog posts, social content,
            emails, and product descriptions — all in one creative workspace.
          </p>
        </section>

        {/* Generator panel */}
        <section className="rounded-3xl border border-blue-300/25 bg-slate-950/65 p-5 shadow-[0_0_55px_rgba(37,99,235,0.12)] backdrop-blur-2xl sm:p-8">

          <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">
                Create your content
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Customize your content and let your ideas flow.
              </p>
            </div>

            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs text-cyan-200">
              ✦ AI workspace
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Content type and tone */}
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="content-type"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Content type
                </label>

                <select
                  id="content-type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-[#101a30] p-3.5 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/15"
                >
                  {CONTENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="content-tone"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Tone of voice
                </label>

                <select
                  id="content-tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-[#101a30] p-3.5 text-sm text-white outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-400/15"
                >
                  {TONES.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Topic */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="content-topic"
                  className="text-sm font-medium text-slate-200"
                >
                  What would you like to create?
                </label>

                <span className="text-xs text-slate-500">
                  Your idea
                </span>
              </div>

              <textarea
                id="content-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={4}
                maxLength={1000}
                placeholder="e.g. How artificial intelligence is changing education..."
                className="w-full resize-y rounded-xl border border-white/15 bg-[#101a30] p-4 text-sm leading-6 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/15"
              />

              <div className="mt-2 text-right text-xs text-slate-500">
                {topic.length}/1000
              </div>
            </div>

            {/* Generate button */}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 px-5 py-4 font-semibold text-white shadow-[0_0_30px_rgba(59,130,246,0.22)] transition duration-200 hover:brightness-110 hover:shadow-[0_0_40px_rgba(139,92,246,0.3)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="text-xl">
                {loading ? "◌" : "✦"}
              </span>
              {loading ? "Creating your content..." : "Generate content"}
              {!loading && (
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              )}
            </button>

          </form>

          {/* Error message */}
          {error && (
            <p
              role="alert"
              className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300"
            >
              {error}
            </p>
          )}

          {/* Loading message */}
          {loading && (
            <div
              role="status"
              className="mt-6 rounded-xl border border-cyan-300/20 bg-cyan-300/5 p-5 text-center"
            >
              <p className="text-sm text-cyan-200">
                ✦ Your idea is becoming something remarkable...
              </p>
              <p className="mt-2 text-xs text-slate-400">
                This may take a few moments.
              </p>
            </div>
          )}

          {/* Generated output */}
          {output && (
            <section className="mt-8 overflow-hidden rounded-2xl border border-purple-300/25 bg-[#080e20]/90 shadow-[0_0_35px_rgba(139,92,246,0.08)]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
                <div>
                  <h3 className="font-semibold text-white">
                    ✦ Your generated content
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Created for your selected format and tone
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    void navigator.clipboard.writeText(output).catch(() => {
                      setError("Unable to copy automatically. Please select and copy the text.");
                    });
                  }}
                  className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                >
                  Copy text
                </button>
              </div>

              <div className="p-5 sm:p-7">
                <div className="max-w-none break-words text-sm leading-7 text-slate-200 [&_h1]:mb-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-lg [&_h3]:font-semibold [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1 [&_strong]:font-semibold [&_strong]:text-white [&_a]:text-cyan-300 [&_a]:underline">
                  <ReactMarkdown>{output}</ReactMarkdown>
                </div>
              </div>
            </section>
          )}

        </section>

        {/* Footer */}
        <footer className="py-7 text-center text-xs text-slate-500">
          Made for ideas that deserve to be seen.{" "}
          <span className="text-cyan-300">✦</span>
        </footer>

      </div>
    </main>
  );
}
