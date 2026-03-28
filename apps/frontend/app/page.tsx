"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;
    router.replace(user ? "/dashboard" : "/login");
  }, [user, isReady, router]);

  return <div className="min-h-screen bg-gray-50" aria-busy="true" />;
}
