import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/client";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";

export default function ProductsPage({ voiceSearch }) {
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    api.get("/products").then(({ data }) => setProducts(data));
  }, []);

  useEffect(() => {
    if (voiceSearch) setQuery(voiceSearch);
  }, [voiceSearch]);

  const filtered = useMemo(
    () =>
      products.filter((p) => {
        const byQuery =
          !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase());
        const byCategory = !category || p.category === category;
        return byQuery && byCategory;
      }),
    [products, query, category]
  );

  const onAdd = async (product) => {
    await addItem(product._id, 1);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <section>
      <div className="mb-5 flex flex-wrap gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="min-w-64 rounded-lg border border-slate-300 px-4 py-2 dark:border-slate-700 dark:bg-slate-900"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-slate-300 px-4 py-2 dark:border-slate-700 dark:bg-slate-900"
        >
          <option value="">All categories</option>
          <option value="stationery">Stationery</option>
          <option value="snacks">Snacks</option>
          <option value="books">Books</option>
          <option value="daily-use">Daily-use</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => (
          <ProductCard key={product._id} product={product} onAdd={onAdd} />
        ))}
      </div>
    </section>
  );
}
