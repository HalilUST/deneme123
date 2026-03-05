import React from "react";
import NavBar from "@/components/NavBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <NavBar />
      <main className="p-4">{children}</main>
    </div>
  );
}
