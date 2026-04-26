'use client';

import { useCartStore } from '@/store/useCartStore';

export default function CartTable() {
  const { cart, updateQuantity, removeFromCart } = useCartStore();

  return (
    <table className="w-full text-sm">
      <thead className="bg-gray-100 text-left">
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
          <tr key={item.id} className="border-b hover:bg-gray-50">
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
                className="w-16 border p-1"
              />
            </td>

            <td>KES {item.selling_price}</td>
            <td>
              KES {item.quantity * item.selling_price}
            </td>

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
  );
}