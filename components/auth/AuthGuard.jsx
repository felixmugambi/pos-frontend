"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthGuard({ children, role }) {
  const router = useRouter();

  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);

  useEffect(() => {
    if (!hydrated) return;

    if (!token) {
      router.replace("/login");
      return;
    }

    if (role && user?.role && user.role !== role) {
      router.replace("/pos");
    }
  }, [hydrated, token, user, role, router]);

  // 🔥 BLOCK EVERYTHING UNTIL AUTH IS READY
  if (!hydrated) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="animate-spin h-10 w-10 border-4 border-gray-300 border-t-blue-600 rounded-full" />
        <p className="mt-3 text-gray-500 text-sm">
          Loading session...
        </p>
      </div>
    );
  }

  // ALSO BLOCK UNTIL WE DECIDE AUTH STATE
  if (!token) {
    return null;
  }

  return children;
}