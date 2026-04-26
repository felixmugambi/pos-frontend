"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function DashboardHome() {
  const [stats, setStats] = useState({
    totalSales: 0,
    todaySales: 0,
    totalProducts: 0,
    inventoryItems: 0,
    lowStock: 0,
    stockValue: 0,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);

    try {
      const [salesRes, productsRes, inventoryRes] = await Promise.all([
        api.getSales(),
        api.getProducts(),
        api.getInventory(),
      ]);

      const sales = salesRes?.sales || [];
      const products = productsRes?.products || [];
      const inventory = inventoryRes || [];

      // 💰 TOTAL SALES
      const totalSales = sales.reduce(
        (sum, s) => sum + Number(s.total_amount),
        0
      );

      //  TODAY SALES
      const today = new Date().toDateString();
      const todaySales = sales
        .filter(
          (s) =>
            new Date(s.created_at).toDateString() === today
        )
        .reduce((sum, s) => sum + Number(s.total_amount), 0);

      // 📦 INVENTORY ITEMS COUNT
      const inventoryItems = inventory.length;

      // ⚠️ LOW STOCK (less than 5)
      const lowStock = inventory.filter(
        (i) => i.quantity < 5
      ).length;

      // 💵 STOCK VALUE
      const stockValue = inventory.reduce(
        (sum, item) =>
          sum + item.quantity * (item.products?.buying_price || 0),
        0
      );

      setStats({
        totalSales,
        todaySales,
        totalProducts: products.length,
        inventoryItems,
        lowStock,
        stockValue,
      });

    } catch (err) {
      toast.error("Failed to load dashboard");
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2 sm:p-4">

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

        {/* TOTAL SALES */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-gray-500 text-sm">Total Sales</h2>
          <p className="text-2xl font-bold">
            KES {stats.totalSales.toLocaleString()}
          </p>
        </div>

        {/* TODAY SALES */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-gray-500 text-sm">Today Sales</h2>
          <p className="text-2xl font-bold text-green-600">
            KES {stats.todaySales.toLocaleString()}
          </p>
        </div>

        {/* PRODUCTS */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-gray-500 text-sm">Products</h2>
          <p className="text-2xl font-bold">
            {stats.totalProducts}
          </p>
        </div>

        {/* INVENTORY ITEMS */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-gray-500 text-sm">Inventory Items</h2>
          <p className="text-2xl font-bold">
            {stats.inventoryItems}
          </p>
        </div>

        {/* LOW STOCK ALERT */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-gray-500 text-sm">Low Stock</h2>
          <p className="text-2xl font-bold text-red-600">
            {stats.lowStock}
          </p>
        </div>

        {/* STOCK VALUE */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-gray-500 text-sm">Stock Value</h2>
          <p className="text-2xl font-bold text-blue-600">
            KES {stats.stockValue.toLocaleString()}
          </p>
        </div>

      </div>

      {/* LOADING STATE */}
      {loading && (
        <p className="text-center text-gray-500 mt-4">
          Loading dashboard...
        </p>
      )}

    </div>
  );
}