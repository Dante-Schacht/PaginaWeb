// src/lib/xano.js
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_XANO_BASE_URL || 'https://x8ki-letl-twmt.n7.xano.io/api:SzMZfFwX', // e.g. https://.../api:SzMZfFwX
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("electroverse-token") || null;
  // Evitar enviar Authorization en endpoints públicos
  const url = config.url || "";
  const isPublicEndpoint = /^\/products(\/|$)/.test(url) || /^\/upload\/image(\/|$)/.test(url);
  if (token && !isPublicEndpoint) {
    config.headers.Authorization = `Bearer ${token}`;
  }
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
      code: err.code,
    });
    // Normalizar mensaje de red para que el UI no "se caiga"
    if (err.code === 'ECONNABORTED' || err.message?.includes('Network Error')) {
      err.response = err.response || { data: { message: 'Fallo de red con Xano. Intenta nuevamente.' } };
    }
    throw err;
  }
);
