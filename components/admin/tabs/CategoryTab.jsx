"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import Loader from "@/components/ui/Loader";

export default function CategoryTab() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data || []);
    } catch (err) {
      toast.error("Failed to load categories");
    }
  };

  const reset = () => {
    setName("");
    setEditing(null);
  };

  const handleSave = async () => {
    if (!name.trim()) return toast.error("Name required");

    setLoading(true);

    try {
      if (editing) {
        await api.updateCategory(editing.id, { name });
        toast.success("Category updated");
      } else {
        await api.createCategory({ name });
        toast.success("Category created");
      }

      reset();
      fetchCategories();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete category?")) return;

    try {
      await api.deleteCategory(id);
      toast.success("Deleted");
      fetchCategories();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (cat) => {
    setEditing(cat);
    setName(cat.name);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 mt-10 px-2 py-8 md:py-8 space-y-6 min-h-screen mr-1.5">

      {/* CREATE / EDIT */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
        <h2 className="font-bold mb-3 text-gray-900 dark:text-white">
          {editing ? "Edit Category" : "Create Category"}
        </h2>

        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 p-3 rounded border dark:bg-gray-800 dark:text-white"
            placeholder="Category name"
          />

          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-500 text-white px-4 rounded"
          >
            {loading ? "..." : editing ? "Update" : "Save"}
          </button>

          {editing && (
            <button
              onClick={reset}
              className="bg-gray-400 text-white px-4 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* LIST */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {
            loading ? (
              <Loader text="Loading Categories..." />
            ) : (
            categories.map((cat) => (
              <tr key={cat.id} className="border-t dark:border-gray-700">
                <td className="p-3 text-gray-900 dark:text-white">
                  {cat.name}
                </td>

                <td className="p-3 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="text-emerald-600 hover:text-emerald-500"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="text-red-600 hover:text-emerald-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    </div>
  );
}