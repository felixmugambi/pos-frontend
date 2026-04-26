'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useSalesStore } from '@/store/useSalesStore';
import toast from 'react-hot-toast';
import { printReceipt } from '@/utils/printReceipt';
import { useAuthStore } from '@/store/useAuthStore';

export default function PaymentPanel() {
  const { cart, getTotal, clearCart } = useCartStore();
  const { createSale, loading } = useSalesStore();

  const [method, setMethod] = useState('cash');
  const [cash, setCash] = useState('');

  const total = getTotal();
  const change = cash ? Number(cash) - total : 0;

  const user = useAuthStore((s) => s.user);

const handleCheckout = async () => {
  if (cart.length === 0) return;

  // prevent underpayment
  if (method === "cash" && Number(cash) < total) {
    toast.error("Insufficient cash");
    return;
  }

  const res = await createSale(method);

  if (!res || !res.success) {
    toast.error(res?.error || "Sale failed");
    return;
  }

  const changeAmount =
    method === "cash" ? Number(cash) - total : 0;

  // 🧾 PRINT RECEIPT
  printReceipt({
    items: cart,
    total,
    cash,
    change: changeAmount,
    method,
    cashier: user?.name,
  });

  // 🧹 CLEAR CART
  clearCart();
  setCash("");

  toast.success("Sale completed");
};

  return (
    <div className="flex flex-col h-full justify-between">

      {/* TOTAL */}
      <div>
        <h2 className="text-lg font-bold mb-2">Total</h2>
        <p className="text-3xl font-bold text-green-600">
          KES {total}
        </p>

        {/* PAYMENT METHOD */}
        <div className="mt-4">
          <label className="block mb-1">Payment</label>

          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="cash">Cash</option>
            <option value="mpesa">M-Pesa</option>
            <option value="card">Card</option>
          </select>
        </div>

        {/* CASH INPUT */}
        {method === 'cash' && (
          <div className="mt-3">
            <input
              type="number"
              placeholder="Cash received"
              value={cash}
              onChange={(e) => setCash(e.target.value)}
              className="w-full p-2 border rounded"
            />

            <p className="mt-2 text-sm">
              Change: <span className="font-bold">
                KES {change}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* ACTIONS */}
      <div className="space-y-2 mt-6">
        <button
          onClick={handleCheckout}
          disabled={loading || cart.length === 0}
          className="w-full bg-green-600 hover:bg-green-500 text-white p-3 rounded"
        >
          {loading ? 'Processing...' : 'Checkout'}
        </button>

        <button
          onClick={clearCart}
          className="w-full bg-gray-300 p-3 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}