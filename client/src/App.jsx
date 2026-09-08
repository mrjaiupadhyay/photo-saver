import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import api from "./api/client";
import Navbar from "./components/Navbar";
import VoiceInputButton from "./components/VoiceInputButton";
import { useAuth } from "./context/AuthContext";
import { useCart } from "./context/CartContext";
import { parseVoiceCommand } from "./utils/voiceCommandParser";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/profile" replace />;
};

export default function App() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [voiceSearch, setVoiceSearch] = useState("");
  const [liveOrderUpdate, setLiveOrderUpdate] = useState(null);
  const [products, setProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    api.get("/products").then(({ data }) => setProducts(data));
  }, []);

  useEffect(() => {
    if (!user) return;
    api.get("/orders/recommendations").then(({ data }) => setRecommendations(data)).catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000");
    socket.emit("joinUserRoom", user.id);
    socket.on("orderStatusUpdate", (payload) => {
      setLiveOrderUpdate(payload);
      toast.success(`Order ${payload._id.slice(-6)} updated: ${payload.status}`);
    });
    return () => socket.disconnect();
  }, [user]);

  const productMap = useMemo(() => {
    const map = new Map();
    products.forEach((product) => {
      map.set(product.name.toLowerCase(), product);
    });
    return map;
  }, [products]);

  const executeVoiceCommand = async (rawText) => {
    toast(`Heard: ${rawText}`);
    const cmd = parseVoiceCommand(rawText);

    if (cmd.action === "navigate_orders") {
      navigate("/orders");
      return;
    }

    if (cmd.action === "search") {
      setVoiceSearch(cmd.query);
      navigate("/products");
      return;
    }

    if (!user) {
      toast.error("Please login first.");
      navigate("/profile");
      return;
    }

    if (cmd.action === "add_to_cart") {
      const match = [...productMap.values()].find((p) => p.name.toLowerCase().includes(cmd.productName));
      if (!match) return toast.error("Product not found");
      await addItem(match._id, cmd.quantity || 1);
      toast.success(`${cmd.quantity || 1} ${match.name} added to cart`);
      navigate("/cart");
      return;
    }

    if (cmd.action === "order_items") {
      for (const name of cmd.productNames) {
        const item = [...productMap.values()].find((p) => p.name.toLowerCase().includes(name));
        if (item) await addItem(item._id, 1);
      }
      navigate("/cart");
      toast.success("Items added to cart. Place order from cart.");
      return;
    }

    toast.error("Command not recognized. Try: 'Add 2 notebooks to cart'");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="mx-auto max-w-6xl px-4 py-6">
        {recommendations.length > 0 ? (
          <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-700 dark:bg-amber-950">
            Recommended for you: {recommendations.map((p) => p.name).join(", ")}
          </div>
        ) : null}

        <div className="mb-4">
          <VoiceInputButton onText={executeVoiceCommand} />
        </div>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage voiceSearch={voiceSearch} />} />
          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrdersPage liveUpdate={liveOrderUpdate} /></ProtectedRoute>} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<ProtectedRoute>{user?.role === "admin" ? <AdminPage /> : <Navigate to="/" />}</ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}
