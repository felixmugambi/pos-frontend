"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function InventoryTab() {
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [restockInputs, setRestockInputs] = useState({});
  const [statusFilter, setStatusFilter] = useState("active");
  const [editingStock, setEditingStock] = useState(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const data = await api.getInventory();
      setInventory(data || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 unified save handler (handles both restock & edit)
  const handleSave = async (item) => {
    const qty = Number(restockInputs[item.product_id]);

    if (!qty && qty !== 0) {
      return toast.error("Enter a valid quantity");
    }

    try {
      if (item.quantity === 0) {
        // RESTOCK
        await api.restock({
          product_id: item.product_id,
          quantity: qty,
        });
      } else {
        // EDIT
        await api.adjustStock({
          product_id: item.product_id,
          new_quantity: qty,
        });
      }

      toast.success("Stock updated");

      setEditingStock(null);
      setRestockInputs((prev) => ({
        ...prev,
        [item.product_id]: "",
      }));

      fetchInventory();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filteredInventory = inventory.filter((item) => {
    const name = item.products?.name?.toLowerCase() || "";
    const barcode = item.products?.barcode || "";

    const matchesSearch =
      name.includes(search.toLowerCase()) || barcode.includes(search);

    const isActive = item.products?.is_active;

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? isActive
        : !isActive;

    return matchesSearch && matchesStatus;
  });

  const totalStockValue = filteredInventory.reduce(
    (sum, item) => sum + item.quantity * (item.products?.buying_price || 0),
    0
  );

  return (
    <div className="mt-6 pt-8 p-2 sm:p-4 bg-gray-50 dark:bg-gray-950 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Inventory
        </h2>

        <div className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 px-3 py-1 rounded">
          Stock Value: KES {totalStockValue.toLocaleString()}
        </div>
      </div>

      {/* SEARCH */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search product..."
          className="w-full p-2 rounded border"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* FILTER TABS */}
      <div className="flex gap-2 mb-4">
        {["active", "inactive", "all"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded ${
              statusFilter === status
                ? "bg-emerald-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {loading ? (
          <p>Loading...</p>
        ) : (
          filteredInventory.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-white rounded shadow flex justify-between items-center"
            >
              {/* LEFT */}
              <div>
                <h3 className="font-semibold">
                  {item.products?.name}
                  {!item.products?.is_active && " (Inactive)"}
                </h3>
                <p className="text-sm text-gray-500">
                  {item.products?.barcode}
                </p>
              </div>

              {/* RIGHT */}
              <div className="flex gap-2 items-center">
                <span className="font-bold">{item.quantity}</span>

                {!item.products?.is_active ? (
                  <button
                    onClick={async () => {
                      await api.restoreProduct(item.product_id);
                      toast.success("Product restored");
                      fetchInventory();
                    }}
                    className="bg-emerald-600 text-white px-3 py-1 rounded"
                  >
                    Restore
                  </button>
                ) : editingStock === item.product_id ? (
                  <>
                    <input
                      type="number"
                      autoFocus
                      value={
                        restockInputs[item.product_id] ??
                        item.quantity ??
                        ""
                      }
                      onChange={(e) =>
                        setRestockInputs((prev) => ({
                          ...prev,
                          [item.product_id]: e.target.value,
                        }))
                      }
                      className="w-20 border rounded p-1"
                    />

                    <button
                      onClick={() => handleSave(item)}
                      className="bg-blue-600 text-white px-2 rounded"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => {
                        setEditingStock(null);
                        setRestockInputs((prev) => ({
                          ...prev,
                          [item.product_id]: "",
                        }));
                      }}
                      className="bg-gray-400 text-white px-2 rounded"
                    >
                      Cancel
                    </button>
                  </>
                ) : item.quantity === 0 ? (
                  <button
                    onClick={() => setEditingStock(item.product_id)}
                    className="bg-emerald-600 text-white px-3 py-1 rounded"
                  >
                    + Restock
                  </button>
                ) : (
                  <button
                    onClick={() => setEditingStock(item.product_id)}
                    className="bg-gray-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}