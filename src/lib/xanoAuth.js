// src/lib/xanoAuth.js - Instancia para API de autenticación y usuarios
import axios from "axios";

export const authApi = axios.create({
  baseURL: 'https://x8ki-letl-twmt.n7.xano.io/api:QbleTY9C', // API de autenticación
});

authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

authApi.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("Xano Auth API Error Details:", {
      method: err.config?.method?.toUpperCase(),
      url: `${err.config?.baseURL}${err.config?.url}`,
      status: err.response?.status,
      responseBody: err.response?.data,
    });
    throw err;
  }
);
