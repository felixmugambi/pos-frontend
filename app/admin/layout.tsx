"use client";

import { ReactNode } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AuthGuard role="admin">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1 bg-gray-100">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}