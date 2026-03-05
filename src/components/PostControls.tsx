"use client";

import { useState } from "react";
import { getUser } from "@/lib/auth";
import { deletePost } from "@/lib/db";
import { useRouter } from "next/navigation";

interface Props {
  postId: string;
  slug: string;
  authorId: string;
}

export default function PostControls({ postId, slug, authorId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useState(() => {
    getUser().then((u) => setUserId(u?.id ?? null));
  });

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    setLoading(true);
    try {
      await deletePost(postId);
      router.push('/dashboard/feed');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (userId !== authorId) return null;

  return (
    <div className="mt-4 space-x-2">
      <button
        onClick={() => router.push(`/dashboard/write?slug=${slug}`)}
        className="rounded bg-yellow-500 px-3 py-1 text-white"
      >
        Edit
      </button>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="rounded bg-red-600 px-3 py-1 text-white disabled:opacity-50"
      >
        {loading ? 'Deleting…' : 'Delete'}
      </button>
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
