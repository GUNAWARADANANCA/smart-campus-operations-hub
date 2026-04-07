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
    return <div className="min-h-screen bg-primary-50" aria-hidden />;
  }

  const isAdmin = user.role === "ADMIN";

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-primary-800">
      <Navbar onMenuClick={() => setMobileMenuOpen((v) => !v)} />

      {isAdmin ? (
        <>
          <Sidebar
            open={mobileMenuOpen}
            onNavigate={() => setMobileMenuOpen(false)}
          />

          <main className="pt-20 lg:ml-[260px] min-h-screen">
            <div className="p-4 md:p-6 animate-fade-in">{children}</div>
          </main>
        </>
      ) : (
        <main className="pt-20 min-h-screen">
          <div className="max-w-full mx-auto p-4 md:p-6 animate-fade-in">
            {children}
          </div>
        </main>
      )}
    </div>
  );
}