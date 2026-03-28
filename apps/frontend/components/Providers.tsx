"use client";

import type { ReactNode } from "react";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import { ToastHost } from "@/components/ToastHost";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AppProvider>
        {children}
        <ToastHost />
      </AppProvider>
    </AuthProvider>
  );
}
