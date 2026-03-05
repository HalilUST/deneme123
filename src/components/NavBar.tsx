"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUser, signOut } from "@/lib/auth";
import type { User } from "@supabase/supabase-js";

export default function NavBar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const u = await getUser();
      setUser(u);
      setLoading(false);
    }
    load();
  }, []);

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  if (loading) return null;

  return (
    <nav className="flex items-center justify-between bg-white p-4 shadow">
      <div className="flex space-x-4">
        <Link href="/dashboard/feed" className="text-indigo-600 hover:underline">
          Feed
        </Link>
        <Link href="/dashboard/explore" className="text-indigo-600 hover:underline">
          Explore
        </Link>
        <Link href="/dashboard/write" className="text-indigo-600 hover:underline">
          Write
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        {user && <span className="text-sm">{user.email}</span>}
        <button
          onClick={handleLogout}
          className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
