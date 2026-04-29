"use client";

import { useEffect, useState, useRef } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import BarcodeScanner from "../../ui/BarcodeScanner";

export default function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]); // files
  const [previews, setPreviews] = useState([]); // URLs
  const [existingImages, setExistingImages] = useState([]); // edit mode
  const [uploading, setUploading] = useState(false);
  const [viewImage, setViewImage] = useState(null);

  const [showScanner, setShowScanner] = useState(false);

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
      console.log("data", data.Array);
      setProducts(data?.products || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
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

  const uploadImages = async () => {
    const urls = [];

    for (const file of images) {
      const fileName = `${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from("product-images")
        .upload(fileName, file);

      if (error) throw error;

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      urls.push(data.publicUrl);
    }

    return urls;
  };

  const handleSave = async () => {
    setLoading(true);

    if (!form.barcode) {
      toast.error("Barcode is required");
      setLoading(false);
      return;
    }

    let image_urls = [];

    if (images.length > 0) {
      setUploading(true);
      image_urls = await uploadImages();
      setUploading(false);
    }

    const payload = {
      ...form,
      images: [
        ...existingImages,
        ...image_urls,
        ...(capturedImage ? [capturedImage] : []),
      ].filter(
        (url) =>
          (url && url.startsWith("http")) || url?.startsWith("data:image")
      ),
    };

    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, payload);
        toast.success("Product updated");
      } else {
        await api.createProduct(payload);
        toast.success("Product created");
      }

      setShowModal(false);
      resetForm();
      setImages([]);
      setPreviews([]);
      setExistingImages([]);

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

    // ✅ CLEAN + SAFE
    const imgs =
      product.product_images
        ?.filter((img) => img.image_url && img.image_url.trim() !== "")
        .map((img) => img.image_url) || [];

    setExistingImages(imgs);

    setImages([]);
    setPreviews([]);

    setShowModal(true);
  };

  const handleScan = ({ barcode, image }) => {
    new Audio("/beep.mp3").play();

    setForm((prev) => ({
      ...prev,
      barcode,
    }));

    if (image) {
      setPreviews((prev) => [...prev, image]);
      setImages((prev) => [...prev, image]); // optional if saving base64
    }
  };

  const removeImage = (index) => {
    if (index < existingImages.length) {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      const newIndex = index - existingImages.length;

      setImages((prev) => prev.filter((_, i) => i !== newIndex));

      setPreviews((prev) => prev.filter((_, i) => i !== newIndex));
    }
  };

  return (
    <div className="mt-5 px-2 py-10 bg-gray-50 dark:bg-gray-950 min-h-screen rounded-md">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Products
        </h2>

        <button
          onClick={() => {
            setShowModal(true);
            resetForm(); // ✅ CLEAR STATE
            setImages([]);
            setPreviews([]);
            setExistingImages([]);
          }}
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

              <div></div>

              <div className="mt-3 flex justify-between gap-3">
                <span>
                  {p.product_images?.[0]?.image_url && (
                    <img
                      src={p.product_images[0].image_url}
                      className="w-16 h-16 object-cover rounded mt-2"
                    />
                  )}
                </span>
                <div>
                  <button
                    onClick={() => handleEdit(p)}
                    className="text-emerald-600 dark:text-emerald-400 pr-3"
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
            </div>
          ))
        )}
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            <tr>
              <th>Images</th>
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
                <td>
                  {p.product_images?.[0]?.image_url && (
                    <img
                      src={p.product_images[0].image_url}
                      className="w-16 h-16 object-cover rounded mt-2"
                    />
                  )}
                </td>
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
              {/* BARCODE */}
              {/* BARCODE */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Barcode
                </label>

                <div className="flex gap-2">
                  <input
                    value={form.barcode}
                    onChange={(e) =>
                      setForm({ ...form, barcode: e.target.value })
                    }
                    className="flex-1 p-2 rounded border bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
                  />

                  <button
                    type="button"
                    onClick={() => setShowScanner(true)}
                    className="bg-blue-600 text-white px-3 rounded"
                  >
                    Scan
                  </button>
                </div>

                {showScanner && (
                  <BarcodeScanner
                    onScan={handleScan}
                    onClose={() => setShowScanner(false)}
                  />
                )}
              </div>

              {/* IMAGE */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Product Image
                </label>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => {
                    const files = Array.from(e.target.files);

                    setImages((prev) => [...prev, ...files]);

                    const newPreviews = files.map((file) =>
                      URL.createObjectURL(file)
                    );

                    setPreviews((prev) => [...prev, ...newPreviews]);
                  }}
                  className="w-full text-sm text-gray-700 dark:text-gray-300"
                />
              </div>

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

            <div className="flex flex-wrap gap-2 mt-2">
              {[...existingImages, ...previews].map((img, index) => {
                if (!img) return null; // ✅ skip bad entries

                return (
                  <div key={index} className="relative">
                    <img
                      src={img}
                      className="w-20 h-20 object-cover rounded border cursor-pointer"
                      onClick={() => setViewImage(img)}
                    />

                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}

              {viewImage && (
                <div
                  className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                  onClick={() => setViewImage(null)}
                >
                  <img
                    src={viewImage}
                    className="max-h-[90%] max-w-[90%] rounded-lg"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                  setImages([]);
                  setPreviews([]);
                  setExistingImages([]);
                }}
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
