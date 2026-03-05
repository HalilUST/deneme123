"use client";

import { useEffect, useState } from "react";
import { getAllUsers } from "@/lib/db";

export default function ExplorePage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllUsers();
        setUsers(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div>Loading users…</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Explore Users</h1>
      {users.map((u) => (
        <div key={u.id} className="border p-4 bg-white">
          <a href={`/dashboard/profile/${u.username}`} className="text-indigo-600">
            {u.username}
          </a>
        </div>
      ))}
    </div>
  );
}
