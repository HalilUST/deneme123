"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUpWithEmail, signUpWithUsername } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signUpWithUsername(email, password, username);
      router.push("/dashboard/feed");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded bg-white p-8 shadow"
      >
        <h1 className="mb-6 text-2xl font-semibold">Register</h1>
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        <label className="block mb-4">
          <span className="text-gray-700">Username</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-1 w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring-indigo-200"
          />
        </label>
        <label className="block mb-4">
          <span className="text-gray-700">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring-indigo-200"
          />
        </label>
        <label className="block mb-6">
          <span className="text-gray-700">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring-indigo-200"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-indigo-600 py-2 px-4 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Creating…" : "Register"}
        </button>
        <p className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-indigo-600 hover:underline">
            Log in
          </a>
        </p>
      </form>
    </div>
  );
}
