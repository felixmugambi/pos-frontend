"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const initialForm = {
    name: "",
    email: "",
    password: "",
    role: "cashier",
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.getUsers();
      setUsers(data?.users || []);
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password) {
      return toast.error("All fields are required");
    }

    try {
      setSaving(true);

      await api.createUser(form);

      toast.success("User created");

      setShowModal(false);
      setForm(initialForm);
      fetchUsers();
    } catch (err) {
      if (err.message.includes("duplicate")) {
        toast.error("Email already exists");
      } else {
        toast.error(err.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(initialForm);
  };


  return (
    <div className="mt-6 pt-10 p-2 sm:p-4 bg-gray-50 dark:bg-gray-950 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Users
        </h2>

        <button
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg"
        >
          + Add User
        </button>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Loading...
          </p>
        ) : (users.map((user) => (
          <div
            key={user.id}
            className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {user.name}
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user.email}
            </p>

            <div className="mt-2 flex justify-between items-center">

              <span
                className={`px-2 py-1 text-xs rounded ${
                  user.role === "admin"
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                {user.role}
              </span>

              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(user.created_at).toLocaleDateString()}
              </span>

            </div>
          </div>
        )))}
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-sm">

          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-t border-gray-200 dark:border-gray-700"
              >
                <td className="p-2 font-medium text-gray-900 dark:text-white">
                  {user.name}
                </td>

                <td className="text-gray-700 dark:text-gray-300">
                  {user.email}
                </td>

                <td>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      user.role === "admin"
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                <td className="text-gray-500 dark:text-gray-400">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white dark:bg-gray-900 p-5 rounded-xl w-[90%] max-w-md border border-gray-200 dark:border-gray-700">

            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
              Create User
            </h2>

            <div className="space-y-3">

              <input
                placeholder="Name"
                className="w-full p-2 rounded border bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 rounded border bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full p-2 rounded border bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />

              <select
                className="w-full p-2 rounded border bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value })
                }
              >
                <option value="cashier">Cashier</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded"
                disabled={saving}
              >
                Cancel
              </button>

              <button
                onClick={handleCreate}
                disabled={saving}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                {saving ? "Creating..." : "Create"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}