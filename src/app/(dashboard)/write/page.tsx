"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getUser } from "@/lib/auth";
import { createPost, getPostBySlug, updatePost } from "@/lib/db";

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/--+/g, "-");
}

export default function WritePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const slugParam = searchParams.get('slug');
    if (slugParam) {
      (async () => {
        try {
          const post = await getPostBySlug(slugParam);
          if (post) {
            setTitle(post.title);
            setContent(post.content);
            setEditingSlug(post.slug);
          }
        } catch (e) {
          console.error('failed to load post for edit', e);
        }
      })();
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await getUser();
      if (!user) throw new Error("Not authenticated");
      const slug = editingSlug || slugify(title);
      if (editingSlug) {
        await updatePost(slug, { title, content });
      } else {
        await createPost(user.id, title, slug, content);
      }
      router.push(`/blog/${slug}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="mb-4 text-2xl font-semibold">Write a new post</h1>
      {error && <p className="mb-4 text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded border-gray-300 p-2"
          />
        </div>
        <div>
          <label className="block mb-1">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            required
            className="w-full rounded border-gray-300 p-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-indigo-600 py-2 px-4 text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Publishing…" : "Publish"}
        </button>
      </form>
    </div>
  );
}
