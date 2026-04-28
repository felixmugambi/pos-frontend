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
      <div className="h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-3 sm:px-4">
        <h1 className="font-bold text-sm sm:text-lg text-gray-900 dark:text-white">
          WANANCHI MINIMART
        </h1>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:block text-xs sm:text-sm text-right">
            <p className="font-semibold text-gray-900 dark:text-white">
              {user?.name}
            </p>
            <p className="text-gray-500 dark:text-gray-400">{user?.role}</p>
          </div>

          {user?.role === "admin" && (
            <button
              onClick={() => router.push("/admin")}
              className=" bg-green-600 text-white px-3 py-1 rounded"
            >
              Admin
            </button>
          )}

          <button
            onClick={() => setShowModal(true)}
            className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded text-sm"
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
