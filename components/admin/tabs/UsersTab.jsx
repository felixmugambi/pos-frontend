"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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
    try {
      const data = await api.getUsers();
      setUsers(data?.users || []);
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // ➕ CREATE USER
  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password) {
      return toast.error("All fields are required");
    }

    try {
      setSaving(true);

      await api.createUser(form);

      toast.success("User created successfully");

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

  if (loading) {
    return <p className="text-center">Loading users...</p>;
  }

  return (
    <div className="p-2 sm:p-4">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Users</h2>

        <button
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded"
        >
          + Add User
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">

                <td className="p-2 font-medium">
                  {user.name}
                </td>

                <td>{user.email}</td>

                <td>
                  <span className={`
                    px-2 py-1 text-xs rounded
                    ${user.role === "admin"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700"}
                  `}>
                    {user.role}
                  </span>
                </td>

                <td>
                  {new Date(user.created_at).toLocaleDateString()}
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* 🧾 CREATE USER MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-5 rounded w-[90%] max-w-md">

            <h2 className="text-lg font-bold mb-4">
              Create User
            </h2>

            <div className="space-y-3">

              {/* NAME */}
              <div>
                <label className="text-sm font-medium">Name</label>
                <input
                  className="w-full border p-2"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="w-full border p-2"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="text-sm font-medium">Password</label>
                <input
                  type="password"
                  className="w-full border p-2"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </div>

              {/* ROLE */}
              <div>
                <label className="text-sm font-medium">Role</label>
                <select
                  className="w-full border p-2"
                  value={form.role}
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value })
                  }
                >
                  <option value="cashier">Cashier</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-2 mt-5">

              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded"
                disabled={saving}
              >
                Cancel
              </button>

              <button
                onClick={handleCreate}
                disabled={saving}
                className={`px-4 py-2 text-white rounded ${
                  saving
                    ? "bg-gray-400"
                    : "bg-green-600"
                }`}
              >
                {saving ? "Creating..." : "Create User"}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}