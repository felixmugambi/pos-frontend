"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  const initialForm = {
    name: "",
    barcode: "",
    category_id: "",
    buying_price: "",
    selling_price: "",
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts();
      setProducts(data?.products || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false)
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.getCategories();
      setCategories(res || []);
    } catch {
      toast.error("Failed to load categories");
      setCategories([]);
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingProduct(null);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, form);
        toast.success("Product updated");
      } else {
        await api.createProduct(form);
        toast.success("Product created");
      }

      setShowModal(false);
      resetForm();
      fetchProducts();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.deleteProduct(confirmDelete);
      toast.success("Product deleted");
      setConfirmDelete(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name || "",
      barcode: product.barcode || "",
      category_id: product.category_id || "",
      buying_price: product.buying_price || "",
      selling_price: product.selling_price || "",
    });
    setShowModal(true);
  };

  return (
    <div className="mt-5 px-2 py-10 bg-gray-50 dark:bg-gray-950 min-h-screen rounded-md">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Products
        </h2>

        <button
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg"
        >
          + Add
        </button>
      </div>

      {/* ================= MOBILE VIEW ================= */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Loading Products...
          </p>
        ) : (
          products.map((p) => (
            <div
              key={p.id}
              className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <div className="flex justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {p.name}
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(p.created_at).toLocaleDateString()}
                </span>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                {p.categories?.name || "No Category"}
              </p>

              <div className="mt-2 flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Buy: KES {p.buying_price}
                </span>
                <span className="text-green-600 dark:text-green-400 font-semibold">
                  Sell: KES {p.selling_price}
                </span>
              </div>

              <div className="mt-3 flex justify-end gap-3">
                <button
                  onClick={() => handleEdit(p)}
                  className="text-emerald-600 dark:text-emerald-400"
                >
                  Edit
                </button>
                <button
                  onClick={() => setConfirmDelete(p.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            <tr>
              <th>Name</th>
              <th>Barcode</th>
              <th>Category</th>
              <th>Buying</th>
              <th>Selling</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr
                key={p.id}
                className="border-t border-gray-200 dark:border-gray-700 text-center"
              >
                <td>{p.name}</td>
                <td>{p.barcode}</td>
                <td>{p.categories?.name}</td>
                <td>KES {p.buying_price}</td>
                <td className="text-green-600 dark:text-green-400">
                  KES {p.selling_price}
                </td>
                <td>{new Date(p.created_at).toLocaleDateString()}</td>

                <td className="flex justify-center gap-2 p-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="text-emerald-600 dark:text-emerald-400"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setConfirmDelete(p.id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== MODALS (DARK MODE SAFE) ===== */}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-5 rounded-xl w-[90%] max-w-md border dark:border-gray-700">
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h2>

            <div className="space-y-4">
              {/* NAME */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Product Name
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-2 rounded border bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* BARCODE */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Barcode
                </label>
                <input
                  value={form.barcode}
                  onChange={(e) =>
                    setForm({ ...form, barcode: e.target.value })
                  }
                  className="w-full p-2 rounded border bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* CATEGORY */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Category
                </label>
                <select
                  value={form.category_id}
                  onChange={(e) =>
                    setForm({ ...form, category_id: e.target.value })
                  }
                  className="w-full p-2 rounded border bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* BUYING PRICE */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Buying Price (KES)
                </label>
                <input
                  type="number"
                  value={form.buying_price}
                  onChange={(e) =>
                    setForm({ ...form, buying_price: e.target.value })
                  }
                  className="w-full p-2 rounded border bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* SELLING PRICE */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Selling Price (KES)
                </label>
                <input
                  type="number"
                  value={form.selling_price}
                  onChange={(e) =>
                    setForm({ ...form, selling_price: e.target.value })
                  }
                  className="w-full p-2 rounded border bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                {loading ? "Processing..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl text-center border dark:border-gray-700">
            <p className="mb-4 text-gray-800 dark:text-gray-200">
              Delete this product?
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
