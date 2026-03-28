"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";

export function MainShell({ children }: { children: ReactNode }) {
  const { user, isReady } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    if (!user) router.replace("/login");
  }, [user, isReady, router]);

  if (!isReady || !user) {
    return <div className="min-h-screen bg-gray-50" aria-hidden />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar onMenuClick={() => setMobileMenuOpen((v) => !v)} />
      <Sidebar
        open={mobileMenuOpen}
        onNavigate={() => setMobileMenuOpen(false)}
      />
      <main className="lg:ml-60 pt-16 min-h-screen">
        <div className="p-6 animate-fade-in">{children}</div>
      </main>
    </div>
  );
}
