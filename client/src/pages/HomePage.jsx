import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <section className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-white">
      <h1 className="text-3xl font-bold">College Student Supply Platform</h1>
      <p className="mt-3 max-w-xl text-indigo-50">
        Order stationery, books, snacks, and daily essentials with simple text or voice commands.
      </p>
      <div className="mt-5 flex gap-3">
        <Link to="/products" className="rounded-lg bg-white px-5 py-2 font-semibold text-indigo-700">
          Explore Products
        </Link>
        <Link to="/orders" className="rounded-lg border border-white px-5 py-2">
          Track Orders
        </Link>
      </div>
    </section>
  );
}
