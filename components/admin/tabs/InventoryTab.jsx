"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function InventoryTab() {
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 store quantity per row
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

  // 🔼 RESTOCK HANDLER
  const handleRestock = async (product_id) => {
    const qty = Number(restockInputs[product_id]);

    if (!qty || qty <= 0) {
      return toast.error("Enter a valid quantity");
    }

    try {
      await api.restock({
        product_id,
        quantity: qty,
      });

      toast.success("Stock updated");

      // reset input
      setRestockInputs((prev) => ({
        ...prev,
        [product_id]: "",
      }));

      fetchInventory();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // 🔍 FILTER
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
      sum + item.quantity * item.products?.buying_price,
    0
  );

  return (
    <div className="p-2 sm:p-4">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between gap-2 mb-4">
        <h2 className="text-xl font-bold">Inventory</h2>

        <div className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded">
          Stock Value: KES {totalStockValue.toLocaleString()}
        </div>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-3 rounded shadow mb-4">
        <input
          type="text"
          placeholder="Search product (name or barcode)..."
          className="w-full border p-2 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-x-auto">

        <table className="w-full text-sm min-w-[750px]">

          <thead className="bg-gray-100">
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
                  Loading...
                </td>
              </tr>
            ) : (
              filteredInventory.map((item) => (
                <tr key={item.id} className="border-t">

                  {/* PRODUCT */}
                  <td className="p-2">
                    <div className="font-medium">
                      {item.products?.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.products?.barcode}
                    </div>
                  </td>

                  {/* STOCK */}
                  <td className="text-center">
                    <span
                      className={
                        item.quantity < 5
                          ? "text-red-500 font-bold"
                          : ""
                      }
                    >
                      {item.quantity}
                    </span>
                  </td>

                  <td className="text-center">KES {item.products?.buying_price}</td>
                  <td className="text-center">KES {item.products?.selling_price}</td>

                  <td className="text-center">
                    KES{" "}
                    {(
                      item.quantity * item.products?.buying_price
                    ).toLocaleString()}
                  </td>

                  {/* 🔥 RESTOCK INPUT */}
                  <td className="flex gap-2 items-center p-2 text-center">

                    <input
                      type="number"
                      placeholder="Qty"
                      className="w-20 border p-1 rounded"
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
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded"
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