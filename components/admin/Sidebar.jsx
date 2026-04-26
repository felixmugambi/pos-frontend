"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { useAuthStore } from "@/store/useAuthStore";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function Sidebar({ activeTab, setActiveTab }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const tabs = [
    { key: "dashboard", label: "Dashboard" },
    { key: "products", label: "Products" },
    { key: "sales", label: "Sales" },
    { key: "inventory", label: "Inventory" },
    { key: "users", label: "Users" },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  


  return (
    <>
      {/* 🔥 MOBILE TOP BAR */}
      <div className="md:hidden  block items-center justify-between border-b">
        <button onClick={() => setIsOpen(true)} className="text-4xl mt-8 ml-1.5">
          ☰
        </button>
      </div>

      {/* 🔥 OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 🔥 SIDEBAR */}
      <div
        className={`
          fixed md:static z-50 top-0 left-0 h-full
          w-64 bg-white border-r p-3
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-center">Admin Panel</h1>

          {/* CLOSE BUTTON (MOBILE) */}
          <button className="md:hidden" onClick={() => setIsOpen(false)}>
            ✕
          </button>
        </div>

        {/* USER INFO */}
        <div className="mb-3 justify-center rounded flex items-center gap-3">
          {/* User Icon Circle */}
          <FaUserCircle className="text-6xl text-gray-500" />
        </div>

        <div className="mb-2 items-center flex justify-center">
          <p className="font-semibold leading-tight">{user?.name}</p>
        </div>

        <div className="mb-2 items-center flex justify-center">
          <p className="text-xs text-gray-500">Role: {user?.role}</p>
        </div>

        {/* NAVIGATION */}
        <div className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setIsOpen(false); // close on mobile
              }}
              className={`w-full text-left px-3 py-2 rounded ${
                activeTab === tab.key
                  ? "bg-green-400 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="mt-8 space-y-2">
          {/* GO TO POS */}
          <button
            onClick={() => router.push("/pos")}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded"
          >
            Go to Cashier
          </button>

          {/* LOGOUT */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full bg-red-500 text-white py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* 🔥 LOGOUT CONFIRM MODAL */}
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
