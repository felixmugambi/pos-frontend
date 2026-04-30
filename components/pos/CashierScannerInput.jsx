"use client";

import { useState, useRef, useEffect } from "react";
import { api } from "@/lib/api";
import { useCartStore } from "@/store/useCartStore";
import CashierBarcodeScanner from "./CashierBarcodeScanner";
import toast from "react-hot-toast";

export default function CashierScannerInput() {
  const [query, setQuery] = useState("");
  const [showScanner, setShowScanner] = useState(false);

  const inputRef = useRef(null);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleProduct = async (barcode) => {
    try {
      const res = await api.getProductByBarcode(barcode);
      const product = res.product;

      if (!product) return toast.error("Product not found");

      new Audio("/beep.mp3").play();

      addToCart(product);

      setQuery("");
      inputRef.current?.focus();
    } catch (err) {
      console.error(err);
      toast.error("Scan failed");
    }
  };

  const handleKeyDown = async (e) => {
    if (e.key !== "Enter") return;

    e.preventDefault();
    if (!query.trim()) return;

    await handleProduct(query.trim());
  };

  return (
    <div className="w-full flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">

      {/* INPUT */}
      <input
        ref={inputRef}
        className="flex-1 p-4 text-lg font-semibold rounded-lg 
                   bg-white dark:bg-gray-800 
                   border border-green-400 dark:border-gray-700 
                   text-gray-900 dark:text-white"
        placeholder="Scan or type barcode..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      {/* BUTTON */}
      <button
        onClick={() => setShowScanner(true)}
        className="w-full sm:w-auto bg-green-600 hover:bg-green-500 
                   text-white py-3 px-5 rounded-lg font-semibold"
      >
        Scan
      </button>

      {/* SCANNER */}
      {showScanner && (
        <CashierBarcodeScanner
          onScan={handleProduct}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}