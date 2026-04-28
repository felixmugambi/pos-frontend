"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function InventoryTab() {
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [restockInputs, setRestockInputs] = useState({});

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

  const handleRestock = async (product_id) => {
    const qty = Number(restockInputs[product_id]);

    if (!qty || qty <= 0) {
      return toast.error("Enter a valid quantity");
    }

    try {
      await api.restock({ product_id, quantity: qty });

      toast.success("Stock updated");

      setRestockInputs((prev) => ({
        ...prev,
        [product_id]: "",
      }));

      fetchInventory();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filteredInventory = inventory.filter((item) => {
    const name = item.products?.name?.toLowerCase() || "";
    const barcode = item.products?.barcode || "";
    return (
      name.includes(search.toLowerCase()) ||
      barcode.includes(search)
    );
  });

  const totalStockValue = filteredInventory.reduce(
    (sum, item) =>
      sum + item.quantity * (item.products?.buying_price || 0),
    0
  );

  return (
    <div className="mt-6 pt-8 p-2 sm:p-4 bg-gray-50 dark:bg-gray-950 min-h-screen">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between gap-2 mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Inventory
        </h2>

        <div className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded">
          Stock Value: KES {totalStockValue.toLocaleString()}
        </div>
      </div>

      {/* SEARCH */}
      <div className="bg-white dark:bg-gray-900 p-3 rounded-xl shadow border border-gray-200 dark:border-gray-700 mb-4">
        <input
          type="text"
          placeholder="Search product..."
          className="w-full p-2 rounded border bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Loading Inventory...
          </p>
        ) : (
          filteredInventory.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              {/* TOP */}
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {item.products?.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.products?.barcode}
                  </p>
                </div>

                <span
                  className={`font-bold ${
                    item.quantity < 5
                      ? "text-red-500"
                      : "text-gray-800 dark:text-white"
                  }`}
                >
                  {item.quantity}
                </span>
              </div>

              {/* PRICES */}
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Buy: KES {item.products?.buying_price}
                </span>
                <span className="text-green-600 dark:text-green-400">
                  Sell: KES {item.products?.selling_price}
                </span>
              </div>

              {/* VALUE */}
              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Value: KES{" "}
                {(
                  item.quantity *
                  (item.products?.buying_price || 0)
                ).toLocaleString()}
              </div>

              {/* RESTOCK */}
              <div className="mt-3 flex gap-2">
                <input
                  type="number"
                  placeholder="Qty"
                  className="flex-1 p-2 rounded border border-green-300 bg-white dark:bg-gray-800 dark:border-gray-700 text-white"
                  value={restockInputs[item.product_id] || ""}
                  onChange={(e) =>
                    setRestockInputs((prev) => ({
                      ...prev,
                      [item.product_id]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleRestock(item.product_id);
                    }
                  }}
                />

                <button
                  onClick={() => handleRestock(item.product_id)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 rounded"
                >
                  Add
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
              <th>Product</th>
              <th>Stock</th>
              <th>Buying</th>
              <th>Selling</th>
              <th>Value</th>
              <th>Restock</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-4 text-center">
                  Loading Inventory...
                </td>
              </tr>
            ) : (
              filteredInventory.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-gray-200 dark:border-gray-700 text-center"
                >
                  <td className="p-2 text-left">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {item.products?.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {item.products?.barcode}
                    </div>
                  </td>

                  <td>
                    <span
                      className={
                        item.quantity < 5
                          ? "text-red-500 font-bold"
                          : "text-gray-900 dark:text-white"
                      }
                    >
                      {item.quantity}
                    </span>
                  </td>

                  <td>KES {item.products?.buying_price}</td>
                  <td className="text-green-600 dark:text-green-400">
                    KES {item.products?.selling_price}
                  </td>

                  <td>
                    KES{" "}
                    {(
                      item.quantity *
                      (item.products?.buying_price || 0)
                    ).toLocaleString()}
                  </td>

                  <td className="flex gap-2 justify-center p-2">
                    <input
                      type="number"
                      className="w-20 p-1 rounded border bg-white dark:bg-gray-800 dark:border-gray-700 text-white"
                      value={restockInputs[item.product_id] || ""}
                      onChange={(e) =>
                        setRestockInputs((prev) => ({
                          ...prev,
                          [item.product_id]: e.target.value,
                        }))
                      }
                    />

                    <button
                      onClick={() => handleRestock(item.product_id)}
                      className="bg-emerald-600 text-white px-3 rounded"
                    >
                      Add
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}