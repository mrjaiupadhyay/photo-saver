import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/client";

const initial = {
  name: "",
  description: "",
  category: "stationery",
  price: 0,
  stock: 0,
  imageUrl: ""
};

export default function AdminPage() {
  const [form, setForm] = useState(initial);
  const [products, setProducts] = useState([]);

  const loadProducts = () => api.get("/products").then(({ data }) => setProducts(data));

  useEffect(() => {
    loadProducts();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    await api.post("/products", form);
    setForm(initial);
    await loadProducts();
    toast.success("Product created");
  };

  const quickStatusChange = async (orderId, status) => {
    await api.patch(`/orders/${orderId}/status`, { status });
    toast.success("Order status updated");
  };

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={create} className="space-y-2 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
        <h2 className="text-lg font-semibold">Add Product</h2>
        {Object.keys(initial).map((key) => (
          <input
            key={key}
            placeholder={key}
            value={form[key]}
            onChange={(e) => setForm((prev) => ({ ...prev, [key]: key === "price" || key === "stock" ? Number(e.target.value) : e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
          />
        ))}
        <button className="rounded-lg bg-indigo-600 px-4 py-2 text-white">Save Product</button>
      </form>
      <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
        <h2 className="text-lg font-semibold">Catalog</h2>
        <div className="mt-3 space-y-2">
          {products.map((product) => (
            <div key={product._id} className="rounded border border-slate-200 p-2 text-sm dark:border-slate-700">
              {product.name} - INR {product.price}
            </div>
          ))}
        </div>
        <button
          onClick={() => quickStatusChange(prompt("Order ID"), "processing")}
          className="mt-4 rounded bg-emerald-600 px-3 py-2 text-white"
        >
          Quick set order status to processing
        </button>
      </div>
    </section>
  );
}
