"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function POSHeader() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const hydrated = useAuthStore((state) => state.hydrated);

  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!hydrated) {
    return (
      <div className="h-14 bg-white border-b flex items-center px-4">
        Loading session...
      </div>
    );
  }

  return (
    <>
      <div className="h-14 bg-white border-b flex items-center justify-between px-4">

        <h1 className="font-bold text-lg">WANANCHI MINIMART</h1>

        <div className="flex items-center gap-3">

          {/* 👤 USER INFO */}
          <div className="text-sm text-right">
            <p className="font-semibold">{user?.name}</p>
            <p className="text-gray-500">{user?.role}</p>
          </div>

          {/* 🧭 ADMIN BUTTON */}
          {user?.role === "admin" && (
            <button
              onClick={() => router.push("/admin")}
              className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded"
            >
              Go to Admin Dashboard
            </button>
          )}

          {/* 🚪 LOGOUT */}
          <button
            onClick={() => setShowModal(true)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Logout
          </button>

        </div>
      </div>

      <ConfirmModal
        isOpen={showModal}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        onCancel={() => setShowModal(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}