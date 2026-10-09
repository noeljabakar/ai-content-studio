
"use client";
import ReactMarkdown from "react-markdown";

import { useState } from "react";

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
  const [type, setType] = useState(CONTENT_TYPES[0]);
  const [tone, setTone] = useState(TONES[0]);
  const [topic, setTopic] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        AI Content Studio
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">
            Content type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-lg border border-gray-600 bg-gray-800 p-3 text-white"
          >
            {CONTENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Tone
          </label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full rounded-lg border border-gray-600 bg-gray-800 p-3 text-white"
          >
            {TONES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Topic
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            rows={3}
            placeholder="e.g. Why students should learn data analytics"
            className="w-full rounded-lg border border-gray-600 bg-gray-800 p-3 text-white placeholder-gray-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>

      {error && (
        <p className="mt-4 text-red-500">{error}</p>
      )}

      {output && (
  <div className="mt-6 rounded-xl border border-gray-700 bg-gray-900 p-6 text-gray-100">
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown>{output}</ReactMarkdown>
    </div>
  </div>
      )}
        </main>
  );
}
