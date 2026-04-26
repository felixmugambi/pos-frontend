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

  const [loading, setLoading] = useState(false); // 🔥 global action loader

  const initialForm = {
    name: "",
    barcode: "",
    category_id: "",
    buying_price: "",
    selling_price: "",
  };

  const [form, setForm] = useState(initialForm);

  // 🔥 FETCH DATA
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data?.products || []);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.getCategories();
      setCategories(res || []);
    } catch (err) {
      toast.error("Failed to load categories");
      setCategories([]);
    }
  };

  // 🧠 RESET
  const resetForm = () => {
    setForm(initialForm);
    setEditingProduct(null);
  };

  // ➕ SAVE / UPDATE
  const handleSave = async () => {
    setLoading(true);

    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, form);
        toast.success("Product updated successfully");
      } else {
        await api.createProduct(form);
        toast.success("Product created successfully");
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

  // ❌ DELETE
  const handleDelete = async () => {
    setLoading(true);

    try {
      await api.deleteProduct(confirmDelete);
      toast.success("Product deleted (deactivated)");
      setConfirmDelete(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✏️ EDIT
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

  // ❌ CLOSE MODAL
  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <div className="p-2 sm:p-4">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Products</h2>

        <button
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded"
        >
          + Add Product
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">

          <thead className="bg-gray-100">
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
              <tr key={p.id} className="border-t">

                <td className="text-center">{p.name}</td>
                <td className="text-center">{p.barcode}</td>
                <td className="text-center">{p.categories?.name}</td>
                <td className="text-center">KES {p.buying_price}</td>
                <td className="text-center">KES {p.selling_price}</td>
                <td className="text-center">
                  {new Date(p.created_at).toLocaleDateString()}
                </td>

                <td className="flex gap-2 justify-center p-2">

                  <button
                    onClick={() => handleEdit(p)}
                    disabled={loading}
                    className="text-emerald-600 hover:text-emerald-500 disabled:opacity-50"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => setConfirmDelete(p.id)}
                    disabled={loading}
                    className="text-red-500 disabled:opacity-50"
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* 🧾 MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-5 rounded w-[90%] max-w-md">

            <h2 className="text-lg font-bold mb-4">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h2>

            <div className="space-y-3">

              <div>
                <label className="text-sm font-medium">Product Name</label>
                <input
                  value={form.name}
                  className="w-full border p-2"
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium">Barcode</label>
                <input
                  value={form.barcode}
                  className="w-full border p-2"
                  onChange={(e) =>
                    setForm({ ...form, barcode: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium">Category</label>
                <select
                  value={form.category_id}
                  className="w-full border p-2"
                  onChange={(e) =>
                    setForm({ ...form, category_id: e.target.value })
                  }
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Buying Price</label>
                <input
                  type="number"
                  value={form.buying_price}
                  className="w-full border p-2"
                  onChange={(e) =>
                    setForm({ ...form, buying_price: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium">Selling Price</label>
                <input
                  type="number"
                  value={form.selling_price}
                  className="w-full border p-2"
                  onChange={(e) =>
                    setForm({ ...form, selling_price: e.target.value })
                  }
                />
              </div>

            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-2 mt-5">

              <button
                onClick={closeModal}
                disabled={loading}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
              >
                {loading
                  ? "Processing..."
                  : editingProduct
                  ? "Update"
                  : "Save"}
              </button>

            </div>

          </div>
        </div>
      )}

      {/* 🧨 DELETE MODAL */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-[90%] max-w-sm text-center">

            <h2 className="text-lg font-bold mb-2">Are you sure?</h2>

            <p className="text-gray-600 mb-4">
              This product will be deactivated (soft delete).
            </p>

            <div className="flex justify-center gap-3">

              <button
                onClick={() => setConfirmDelete(null)}
                disabled={loading}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                {loading ? "Deleting..." : "Yes Delete"}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}