"use client";

import { useRouter, usePathname } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { useAuthStore } from "@/store/useAuthStore";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useState } from "react";

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const tabs = [
    { key: "", label: "Dashboard" },
    { key: "products", label: "Products" },
    { key: "sales", label: "Sales" },
    { key: "inventory", label: "Inventory" },
    { key: "users", label: "Users" },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isActive = (key: string) => {
    if (key === "") return pathname === "/admin";
    return pathname === `/admin/${key}`;
  };

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 h-14">
        <button
          onClick={() => setIsOpen(true)}
          className="text-2xl p-2 text-gray-800 dark:text-white"
        >
          ☰
        </button>
      </div>

      {/* OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
    fixed md:static z-50 top-0 left-0 h-full
    w-64 bg-white dark:bg-gray-900 
    border-r border-gray-200 dark:border-gray-700 
    p-4
    transform transition-transform duration-300
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0
  `}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            Admin Panel
          </h1>
          <button
            className="md:hidden text-gray-700 dark:text-white"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* USER */}
        <div className="flex flex-col items-center mb-6">
          <FaUserCircle className="text-6xl text-gray-400 dark:text-gray-500" />
          <p className="mt-2 font-semibold text-gray-800 dark:text-gray-200">
            {user?.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Role: {user?.role}
          </p>
        </div>

        {/* NAV */}
        <div className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                router.push(`/admin/${tab.key}`);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg transition ${isActive(tab.key)
                ? "bg-green-500 text-white"
                : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="mt-8 space-y-2">
          <button
            onClick={() => router.push("/pos")}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg transition"
          >
            Go to Cashier
          </button>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={showLogoutModal}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}