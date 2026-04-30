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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950">
  
      <form
        onSubmit={handleLogin}
        className={`bg-white dark:bg-gray-900 p-6 rounded-lg shadow w-80 transition border border-gray-200 dark:border-gray-700 ${
          shake ? "animate-pulse border-red-400" : ""
        }`}
      >
  
        {/* TITLE */}
        <h2 className="text-gray-900 dark:text-white text-xl font-bold mb-5 text-center">
          Login
        </h2>
  
        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded mb-3
                     bg-white dark:bg-gray-800
                     border border-gray-300 dark:border-gray-700
                     text-gray-900 dark:text-white
                     placeholder-gray-500 dark:placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-emerald-400"
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
            className="w-full p-3 pr-10 rounded
                       bg-white dark:bg-gray-800
                       border border-gray-300 dark:border-gray-700
                       text-gray-900 dark:text-white
                       placeholder-gray-500 dark:placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-emerald-400"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />
  
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500 dark:text-gray-400"
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