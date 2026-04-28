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

      const totalSales = sales.reduce(
        (sum, s) => sum + Number(s.total_amount),
        0
      );

      const today = new Date().toDateString();
      const todaySales = sales
        .filter(
          (s) =>
            new Date(s.created_at).toDateString() === today
        )
        .reduce((sum, s) => sum + Number(s.total_amount), 0);

      const inventoryItems = inventory.length;

      const lowStock = inventory.filter(
        (i) => i.quantity < 5
      ).length;

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
      console.error(err?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16 p-2 sm:p-4 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <h2 className="text-gray-500 dark:text-gray-400 text-xl font-bold p-3">Summary Statistics</h2>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 gap-3 sm:gap-4">

        {/* CARD */}
        {[
          {
            title: "Total Sales",
            value: `KES ${stats.totalSales.toLocaleString()}`,
          },
          {
            title: "Today Sales",
            value: `KES ${stats.todaySales.toLocaleString()}`,
            color: "text-green-600 dark:text-green-400",
          },
          {
            title: "Products",
            value: stats.totalProducts,
          },
          {
            title: "Inventory Items",
            value: stats.inventoryItems,
          },
          {
            title: "Low Stock",
            value: stats.lowStock,
            color: "text-red-600 dark:text-red-400",
          },
          {
            title: "Stock Value",
            value: `KES ${stats.stockValue.toLocaleString()}`,
            color: "text-blue-600 dark:text-blue-400",
          },
        ].map((card, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-gray-500 dark:text-gray-400 text-sm">
              {card.title}
            </h2>
            <p
              className={`text-2xl font-bold mt-1 text-gray-900 dark:text-white ${
                card.color || ""
              }`}
            >
              {card.value}
            </p>
          </div>
        ))}

      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
          Loading dashboard...
        </p>
      )}

    </div>
  );
}