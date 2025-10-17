// src/lib/xano.js
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_XANO_BASE_URL || 'https://x8ki-letl-twmt.n7.xano.io/api:SzMZfFwX', // e.g. https://.../api:SzMZfFwX
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("Xano API Error Details:", {
      method: err.config?.method?.toUpperCase(),
      url: `${err.config?.baseURL}${err.config?.url}`,
      status: err.response?.status,
      responseBody: err.response?.data,
    });
    throw err;
  }
);
