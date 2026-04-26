'use client';

import { useCartStore } from '@/store/useCartStore';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getTotal } = useCartStore();

  const total = getTotal();

  return (
    <div className="p-4 bg-gray-50 h-full flex flex-col">
      <h2 className="text-xl font-bold mb-3">🛒 Cart</h2>

      <div className="flex-1 overflow-y-auto">
        {cart.map(item => (
          <div
            key={item.id}
            className="flex justify-between items-center py-2 border-b"
          >
            <div>
              <p className="font-medium">{item.name}</p>

              <div className="flex items-center gap-2 mt-1">
                <button
                  className="px-2 bg-gray-200 rounded"
                  onClick={() =>
                    updateQuantity(item.id, Math.max(1, item.quantity - 1))
                  }
                >
                  -
                </button>

                <span>{item.quantity}</span>

                <button
                  className="px-2 bg-gray-200 rounded"
                  onClick={() =>
                    updateQuantity(item.id, item.quantity + 1)
                  }
                >
                  +
                </button>
              </div>
            </div>

            <div className="text-right">
              <p className="font-semibold">
                KES {item.quantity * item.selling_price}
              </p>
              <button
                className="text-red-500 text-sm"
                onClick={() => removeFromCart(item.id)}
              >
                remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 border-t pt-3">
        <p className="text-lg font-bold">
          Total: KES {total}
        </p>
      </div>
    </div>
  );
}