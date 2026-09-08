import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navClass = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium ${isActive ? "bg-indigo-600 text-white" : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"}`;

export default function Navbar({ darkMode, setDarkMode }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-bold text-indigo-600">
          CampusSupply
        </Link>
        <div className="flex items-center gap-2">
          <NavLink to="/" className={navClass}>
            Home
          </NavLink>
          <NavLink to="/products" className={navClass}>
            Products
          </NavLink>
          <NavLink to="/cart" className={navClass}>
            Cart
          </NavLink>
          <NavLink to="/orders" className={navClass}>
            Orders
          </NavLink>
          <NavLink to="/profile" className={navClass}>
            Profile
          </NavLink>
          {user?.role === "admin" && (
            <NavLink to="/admin" className={navClass}>
              Admin
            </NavLink>
          )}
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:text-slate-100"
          >
            {darkMode ? "Light" : "Dark"}
          </button>
          {user ? (
            <button
              onClick={logout}
              className="rounded-md bg-rose-600 px-3 py-2 text-sm text-white"
            >
              Logout
            </button>
          ) : null}
        </div>
      </nav>
    </header>
  );
}
