import { useEffect, useState } from "react";
import api from "../api/client";

export default function OrdersPage({ liveUpdate }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders").then(({ data }) => setOrders(data));
  }, []);

  useEffect(() => {
    if (!liveUpdate?._id) return;
    setOrders((prev) => prev.map((order) => (order._id === liveUpdate._id ? liveUpdate : order)));
  }, [liveUpdate]);

  return (
    <section className="space-y-3">
      {orders.map((order) => (
        <div key={order._id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
          <div className="flex justify-between">
            <p className="font-semibold">Order #{order._id.slice(-6)}</p>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs dark:bg-slate-800">
              {order.status}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-500">INR {order.totalAmount}</p>
        </div>
      ))}
    </section>
  );
}
