'use client';

import { useState, useRef, useEffect } from 'react';
import { api } from '@/lib/api';
import { useCartStore } from '@/store/useCartStore';

export default function CashierScannerInput() {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  const addToCart = useCartStore(state => state.addToCart);

  // Auto focus for POS speed
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleScan = async (e) => {
    if (e.key !== 'Enter') return;

    e.preventDefault();
    if (!query) return;

    try {
      // ⚡ CASHIER ONLY: use barcode endpoint (FAST + EXACT)
      const res = await api.getProductByBarcode(query);

      const product = res.product;

      if (product) {
        addToCart(product);
        setQuery('');

        // keep scanner ready instantly
        inputRef.current?.focus();
      } else {
        alert('Product not found');
      }

    } catch (err) {
      console.error('Scan error:', err);
      alert('Scan failed');
    }
  };

  return (
    <input
      ref={inputRef}
      autoFocus
      className="w-full p-4 text-xl font-semibold rounded-lg 
                 bg-white dark:bg-gray-800 
                 border border-green-400 dark:border-gray-700 
                 text-gray-900 dark:text-white"
      placeholder="📷 Scan barcode..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={handleScan}
    />
  );
}