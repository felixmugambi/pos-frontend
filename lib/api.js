import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Get token (we’ll later store it properly)
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

// Generic request handler
const request = async (endpoint, options = {}) => {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const data = await res.json();

  // HANDLE AUTH ERRORS FIRST
  if (!res.ok) {
    if (res.status === 401) {
      toast.error("Session expired. Please login again.");
    
      localStorage.removeItem("token");
    
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    
      return;
    }

    // other errors
    throw new Error(data.error || "Something went wrong");
  }

  return data;
};

export const api = {
  //  AUTH
  login: (body) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getMe: () => request("/auth/me"),

  // USERS
  createUser: (body) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  //  CATEGORIES
  createCategory: (body) =>
    request("/categories", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateCategory: (id, body) =>
    request(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  deleteCategory: (id) =>
    request(`/categories/${id}`, {
      method: "DELETE",
    }),

  // PRODUCTS
  searchProducts: (query) => request(`/products/search?q=${query}`),
  getCategories: () => request("/categories"),

  createProduct: (body) =>
    request("/products", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateProduct: (id, body) =>
    request(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  deleteProduct: (id) =>
    request(`/products/${id}`, {
      method: "DELETE",
    }),

  getProducts: () => request("/products"),

  getProductByBarcode: (barcode) => request(`/products/barcode/${barcode}`),

  //  INVENTORY
  getInventory: () => request("/inventory"),

  restock: (body) =>
    request("/inventory/restock", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  // 🛒 SALES
  createSale: (body) =>
    request("/sales", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getSales: () => request("/sales"),

  getSaleById: (id) => request(`/sales/${id}`),

  getUsers: () => request("/users"),
};
