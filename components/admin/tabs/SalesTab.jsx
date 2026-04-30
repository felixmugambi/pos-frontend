"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import Loader from "../../ui/Loader";

export default function SalesTab() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const filteredSales = sales.filter((sale) => {
    const cashier = sale.users?.name?.toLowerCase() || "";
    const payment = sale.payment_method || "";
    const amount = Number(sale.total_amount);
    const saleDate = new Date(sale.created_at)
      .toISOString()
      .slice(0, 10);

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
    <div className="mt-6 pt-8 p-2 sm:p-4 bg-gray-50 dark:bg-gray-950 min-h-screen">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between gap-2 mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Sales History
        </h2>

        <div className="text-sm bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1 rounded">
          Total: KES {totalSales.toLocaleString()}
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white dark:bg-gray-900 p-3 rounded-xl shadow border border-gray-200 dark:border-gray-700 mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">

        <input
          type="text"
          placeholder="Cashier"
          className="p-2 rounded border bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
          value={filters.cashier}
          onChange={(e) =>
            setFilters({ ...filters, cashier: e.target.value })
          }
        />

        <select
          className="p-2 rounded border bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
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

        <input
          type="date"
          className="p-2 rounded border bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
          value={filters.date}
          onChange={(e) =>
            setFilters({ ...filters, date: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Min Amount"
          className="p-2 rounded border bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
          value={filters.min}
          onChange={(e) =>
            setFilters({ ...filters, min: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Max Amount"
          className="p-2 rounded border bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
          value={filters.max}
          onChange={(e) =>
            setFilters({ ...filters, max: e.target.value })
          }
        />
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <Loader text="Loading Sales..." />
        ) : filteredSales.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No matching sales
          </p>
        ) : (
          filteredSales.map((sale) => (
            <div
              key={sale.id}
              className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(sale.created_at).toLocaleString()}
                </span>

                <span className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  {sale.payment_method}
                </span>
              </div>

              <h3 className="mt-2 font-semibold text-gray-900 dark:text-white">
                {sale.users?.name || "Unknown"}
              </h3>

              <div className="mt-2 flex justify-between items-center">
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  KES {sale.total_amount}
                </span>

                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {sale.sale_items?.length || 0} items
                </span>
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
                  <Loader text="Loading Sales..." />
                </td>
              </tr>
            ) : filteredSales.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center">
                  No matching sales
                </td>
              </tr>
            ) : (
              filteredSales.map((sale) => (
                <tr
                  key={sale.id}
                  className="border-t border-gray-200 dark:border-gray-700 text-center"
                >
                  <td className="p-2 text-left">
                    {new Date(sale.created_at).toLocaleString()}
                  </td>

                  <td>{sale.users?.name || "Unknown"}</td>

                  <td className="font-semibold text-green-600 dark:text-green-400">
                    KES {sale.total_amount}
                  </td>

                  <td>
                    <span className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-800">
                      {sale.payment_method}
                    </span>
                  </td>

                  <td className="text-gray-500 dark:text-gray-400">
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