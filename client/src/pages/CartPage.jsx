import toast from "react-hot-toast";
import api from "../api/client";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function CartPage() {
  const { cart, updateQty, removeItem, total, clear } = useCart();
  const { user } = useAuth();

  const placeOrder = async () => {
    const deliveryAddress = user?.address || prompt("Enter delivery address");
    if (!deliveryAddress) return;
    await api.post("/orders", { deliveryAddress });
    await clear();
    toast.success("Order placed successfully");
  };

  return (
    <section className="space-y-3">
      {cart.items.length === 0 ? <p>Your cart is empty.</p> : null}
      {cart.items.map((item) => (
        <div key={item.product._id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-800">
          <div>
            <p className="font-medium">{item.product.name}</p>
            <p className="text-sm text-slate-500">INR {item.product.price}</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => updateQty(item.product._id, Number(e.target.value))}
              className="w-16 rounded border border-slate-300 px-2 py-1 dark:border-slate-700 dark:bg-slate-900"
            />
            <button
              onClick={() => removeItem(item.product._id)}
              className="rounded bg-rose-600 px-3 py-1 text-white"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
        <p className="text-lg font-semibold">Total: INR {total}</p>
        <button onClick={placeOrder} className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-white">
          Place Order
        </button>
      </div>
    </section>
  );
}
