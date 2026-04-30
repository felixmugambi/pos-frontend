"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const { login, loading } = useAuthStore();
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await login(form);

      toast.success("Login successful");

      router.push("/pos");
    } catch (err) {
      toast.error(err.message || "Login failed");

      // 🔥 shake animation trigger
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">

      <form
        onSubmit={handleLogin}
        className={`bg-white p-6 rounded-lg shadow w-80 transition ${
          shake ? "animate-pulse border border-red-400" : ""
        }`}
      >

        <h2 className="dark:text-gray-400 text-white text-xl font-bold mb-5 text-center">
          Login
        </h2>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border dark:border-b-emerald-50 dark:text-gray-500 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        {/* PASSWORD */}
        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 border dark:border-b-emerald-50 rounded pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

      </form>
    </div>
  );
}