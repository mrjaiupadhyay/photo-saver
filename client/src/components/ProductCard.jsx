export default function ProductCard({ product, onAdd }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <img
        src={product.imageUrl || "https://placehold.co/400x240?text=No+Image"}
        alt={product.name}
        className="h-40 w-full rounded-lg object-cover"
      />
      <h3 className="mt-3 text-lg font-semibold text-slate-800 dark:text-slate-100">{product.name}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">{product.category}</p>
      <p className="mt-2 text-indigo-600 dark:text-indigo-400">INR {product.price}</p>
      <button
        onClick={() => onAdd(product)}
        className="mt-3 w-full rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
      >
        Add to Cart
      </button>
    </div>
  );
}
