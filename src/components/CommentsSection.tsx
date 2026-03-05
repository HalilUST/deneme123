"use client";

import { useEffect, useState } from "react";
import { getCommentsForPost, createComment } from "@/lib/db";
import { getUser } from "@/lib/auth";

interface Props {
  postId: string;
}

export default function CommentsSection({ postId }: Props) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getCommentsForPost(postId);
        setComments(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const user = await getUser();
      if (!user) throw new Error("Not authenticated");
      await createComment(postId, user.id, newComment);
      setNewComment("");
      const updated = await getCommentsForPost(postId);
      setComments(updated || []);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading comments…</div>;
  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold">Comments</h2>
      {error && <p className="text-red-600">{error}</p>}
      {comments.length === 0 ? (
        <p className="text-gray-500">No comments yet.</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((c) => (
            <li key={c.id} className="border p-2">
              <p className="text-sm text-gray-600">{c.users?.username}</p>
              <p>{c.content}</p>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={handleSubmit} className="mt-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
          required
          className="w-full rounded border-gray-300 p-2"
          placeholder="Write a comment..."
        />
        <button
          type="submit"
          className="mt-2 rounded bg-indigo-600 px-4 py-1 text-white hover:bg-indigo-700"
        >
          Post Comment
        </button>
      </form>
    </section>
  );
}
