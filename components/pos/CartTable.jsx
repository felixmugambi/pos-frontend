'use client';

import { useCartStore } from '@/store/useCartStore';

export default function CartTable() {
  const { cart, updateQuantity, removeFromCart } = useCartStore();

  return (
    <div className="text-gray-900 dark:text-white">

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-3 p-2">
        {cart.map((item, index) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between">
              <p className="font-semibold">{item.name}</p>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-gray-500">
              {item.barcode}
            </p>

            <div className="flex justify-between items-center mt-2">
              <input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(item.id, Number(e.target.value))
                }
                className="w-16 border p-1 rounded 
                           bg-white dark:bg-gray-700 
                           border-gray-300 dark:border-gray-600"
              />

              <p className="font-bold text-green-600">
                KES {item.quantity * item.selling_price}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block">
        <table className="w-full text-sm">

          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="p-2">#</th>
              <th>Barcode</th>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {cart.map((item, index) => (
              <tr
                key={item.id}
                className="border-b border-gray-200 dark:border-gray-700"
              >
                <td className="p-2">{index + 1}</td>
                <td>{item.barcode}</td>
                <td>{item.name}</td>

                <td>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, Number(e.target.value))
                    }
                    className="w-16 border p-1 rounded 
                               bg-white dark:bg-gray-700 
                               border-gray-300 dark:border-gray-600"
                  />
                </td>

                <td>KES {item.selling_price}</td>
                <td>KES {item.quantity * item.selling_price}</td>

                <td>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}