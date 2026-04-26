"use client";

import { useState, ReactNode } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <AuthGuard role="admin">
      <div className="flex min-h-screen">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-4 bg-gray-100">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}