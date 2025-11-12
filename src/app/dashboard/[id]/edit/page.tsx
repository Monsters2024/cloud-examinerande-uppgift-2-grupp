"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header";
import { getEntryById, updateEntry } from "@/lib/supabase/queries";
import { getCurrentUser } from "@/lib/supabase/auth";

export default function EditEntryPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const entryId = params.id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      if (!user) return router.push("/login");

      try {
        const entry = await getEntryById(entryId);
        if (!entry) {
          setError("Entry not found");
        } else {
          setTitle(entry.title);
          setContent(entry.content);
          setTagsInput((entry.tags ?? []).join(", "));
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load entry");
      } finally {
        setLoading(false);
      }
    })();
  }, [entryId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }
    setSaving(true);
    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      await updateEntry(entryId, { title, content, tags });
      router.push("/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update entry");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-3xl mx-auto px-6 py-12">Loading…</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-warm-gray hover:text-dark-brown text-sm mb-4">
            ← Back to entries
          </button>
          <h1 className="text-4xl font-serif text-dark-brown mb-2">
            Edit Entry
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm mb-2 text-dark-brown font-medium">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field text-xl font-serif"
              required
              disabled={saving}
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm mb-2 text-dark-brown font-medium">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="input-field min-h-[400px] resize-y leading-relaxed"
              required
              disabled={saving}
            />
          </div>

          <div>
            <label
              htmlFor="tags"
              className="block text-sm mb-2 text-dark-brown font-medium">
              Tags
            </label>
            <input
              id="tags"
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="input-field"
              placeholder="e.g. journal, ideas, school"
              disabled={saving}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-sm text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary"
              disabled={saving}>
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
