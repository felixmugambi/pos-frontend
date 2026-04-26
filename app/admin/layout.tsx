"use client";

import AuthGuard from "@/components/auth/AuthGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard role="admin">
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className="w-64 bg-white border-r p-4">
          <h1 className="font-bold text-lg">Admin Panel</h1>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 bg-gray-100">
          {children}
        </main>

      </div>
    </AuthGuard>
  );
}