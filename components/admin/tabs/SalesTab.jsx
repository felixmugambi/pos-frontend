"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function SalesTab() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔍 FILTER STATES
  const [filters, setFilters] = useState({
    cashier: "",
    payment: "",
    date: "",
    min: "",
    max: "",
  });

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const res = await api.getSales();
      setSales(res?.sales || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 FILTER LOGIC
  const filteredSales = sales.filter((sale) => {
    const cashier = sale.users?.name?.toLowerCase() || "";
    const payment = sale.payment_method || "";
    const amount = Number(sale.total_amount);
    const saleDate = new Date(sale.created_at).toISOString().slice(0, 10);

    return (
      (!filters.cashier ||
        cashier.includes(filters.cashier.toLowerCase())) &&

      (!filters.payment || payment === filters.payment) &&

      (!filters.date || saleDate === filters.date) &&

      (!filters.min || amount >= Number(filters.min)) &&

      (!filters.max || amount <= Number(filters.max))
    );
  });

  const totalSales = filteredSales.reduce(
    (sum, s) => sum + Number(s.total_amount),
    0
  );

  return (
    <div className="p-2 sm:p-4">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between gap-2 mb-4">
        <h2 className="text-xl font-bold">Sales History</h2>

        <div className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded">
          Total: KES {totalSales.toLocaleString()}
        </div>
      </div>

      {/* 🔍 FILTER BAR */}
      <div className="bg-white p-3 rounded shadow mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">

        {/* CASHIER */}
        <input
          type="text"
          placeholder="Cashier"
          className="border p-2 rounded"
          value={filters.cashier}
          onChange={(e) =>
            setFilters({ ...filters, cashier: e.target.value })
          }
        />

        {/* PAYMENT */}
        <select
          className="border p-2 rounded"
          value={filters.payment}
          onChange={(e) =>
            setFilters({ ...filters, payment: e.target.value })
          }
        >
          <option value="">All Payments</option>
          <option value="cash">Cash</option>
          <option value="mpesa">M-Pesa</option>
          <option value="card">Card</option>
        </select>

        {/* DATE */}
        <input
          type="date"
          className="border p-2 rounded"
          value={filters.date}
          onChange={(e) =>
            setFilters({ ...filters, date: e.target.value })
          }
        />

        {/* MIN */}
        <input
          type="number"
          placeholder="Min Amount"
          className="border p-2 rounded"
          value={filters.min}
          onChange={(e) =>
            setFilters({ ...filters, min: e.target.value })
          }
        />

        {/* MAX */}
        <input
          type="number"
          placeholder="Max Amount"
          className="border p-2 rounded"
          value={filters.max}
          onChange={(e) =>
            setFilters({ ...filters, max: e.target.value })
          }
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-x-auto">

        <table className="w-full text-sm min-w-[700px]">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Date</th>
              <th>Cashier</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Items</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-4 text-center">
                  Loading sales...
                </td>
              </tr>
            ) : filteredSales.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No matching sales
                </td>
              </tr>
            ) : (
              filteredSales.map((sale) => (
                <tr key={sale.id} className="border-t">

                  <td className="p-2">
                    {new Date(sale.created_at).toLocaleString()}
                  </td>

                  <td className="text-center">
                    {sale.users?.name || "Unknown"}
                  </td>

                  <td className="font-semibold text-center">
                    KES {sale.total_amount}
                  </td>

                  <td className="text-center">
                    <span className="px-2 py-1 text-xs bg-gray-100 rounded">
                      {sale.payment_method}
                    </span>
                  </td>

                  <td className="text-xs text-gray-600 text-center">
                    {sale.sale_items?.length || 0} items
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