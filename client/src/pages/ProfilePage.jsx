import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user, setUser, login, register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", address: "" });
  const [isRegister, setIsRegister] = useState(false);

  const updateProfile = async () => {
    const { data } = await api.patch("/users/profile", {
      name: form.name || user.name,
      address: form.address || user.address
    });
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    toast.success("Profile updated");
  };

  const authSubmit = async (e) => {
    e.preventDefault();
    if (isRegister) await register(form);
    else await login(form.email, form.password);
    toast.success("Welcome!");
  };

  if (!user) {
    return (
      <form onSubmit={authSubmit} className="mx-auto max-w-md space-y-3 rounded-xl border border-slate-200 p-6 dark:border-slate-800">
        <h2 className="text-xl font-semibold">{isRegister ? "Create account" : "Login"}</h2>
        {isRegister ? (
          <input
            placeholder="Name"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          />
        ) : null}
        <input
          placeholder="Email"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
        />
        {isRegister ? (
          <input
            placeholder="Address"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
            onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
          />
        ) : null}
        <button className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-white">
          {isRegister ? "Register" : "Login"}
        </button>
        <button
          type="button"
          onClick={() => setIsRegister((prev) => !prev)}
          className="w-full text-sm text-indigo-600"
        >
          {isRegister ? "Have an account? Login" : "New user? Register"}
        </button>
      </form>
    );
  }

  return (
    <section className="mx-auto max-w-lg space-y-3 rounded-xl border border-slate-200 p-6 dark:border-slate-800">
      <h2 className="text-xl font-semibold">My Profile</h2>
      <input
        defaultValue={user.name}
        onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
      />
      <input
        defaultValue={user.address}
        onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
      />
      <button onClick={updateProfile} className="rounded-lg bg-indigo-600 px-4 py-2 text-white">
        Update Profile
      </button>
    </section>
  );
}
