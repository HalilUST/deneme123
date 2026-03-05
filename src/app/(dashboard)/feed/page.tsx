"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/lib/auth";
import { getFeed } from "@/lib/db";

export default function FeedPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const user = await getUser();
        if (!user) throw new Error("Not authenticated");
        const data = await getFeed(user.id);
        setPosts(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div>Loading feed…</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (posts.length === 0)
    return <div>You are not following anyone or no posts available.</div>;

  return (
    <div className="space-y-4">
      {posts.map((p) => (
        <div key={p.id} className="rounded border p-4 bg-white">
          <h2 className="text-xl font-semibold">{p.title}</h2>
          <p className="text-gray-600 text-sm">
            by {p.users?.username || p.user_id}
          </p>
          <p className="mt-2 text-gray-800">{p.content.substring(0, 200)}…</p>
        </div>
      ))}
    </div>
  );
}
