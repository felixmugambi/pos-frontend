'use client';

import { useState, useRef, useEffect } from 'react'; // 👈 add useEffect
import { api } from '@/lib/api';
import { useCartStore } from '@/store/useCartStore';

export default function ScanBarcode() {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  const addToCart = useCartStore(state => state.addToCart);

  // ✅ AUTO-FOCUS ON LOAD
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      if (!query) return;

      try {
        const data = await api.searchProducts(query);

        if (data.products.length > 0) {
          const product = data.products[0];

          addToCart(product);

          setQuery('');

          // ✅ REFOCUS AFTER SCAN
          inputRef.current?.focus();

        } else {
          alert('Product not found');
        }

      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <input
      ref={inputRef}
      autoFocus
      className="w-full p-5 border rounded-lg text-xl font-medium"
      placeholder="🔍 Scan barcode..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={handleKeyDown}
    />
  );
}