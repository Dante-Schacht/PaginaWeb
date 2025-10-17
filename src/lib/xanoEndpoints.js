// src/lib/xanoEndpoints.js
import { api } from "./xano";
import { authApi } from "./xanoAuth";

// Usuario actual (perfil)
export async function getCurrentUser() {
  const res = await authApi.get("/auth/me");
  return res.data; // { id, name, email, role, ... }
}

// Listado de usuarios (solo admin) — USA API DE AUTENTICACIÓN
export async function getUsers({ search = "", page = 1, limit = 10 } = {}) {
  const res = await authApi.get("/user", { params: { search, page, limit } });
  return res.data; // { items, total, page, limit } o array plano
}

// CRUD de usuarios (usa API de autenticación)
export async function createUser(payload) {
  const res = await authApi.post("/user", payload);
  return res.data;
}
export async function updateUser(id, payload) {
  const res = await authApi.put(`/user/${id}`, payload);
  return res.data;
}
export async function deleteUser(id) {
  const res = await authApi.delete(`/user/${id}`);
  return res.data;
}

// Productos
export async function getProducts(params = {}) {
  const res = await api.get("/products", { params });
  return res.data;
}
export async function getProduct(id) {
  const res = await api.get(`/products/${id}`);
  return res.data;
}
export async function createProduct(payload) {
  const res = await api.post("/products", payload);
  return res.data;
}
export async function updateProduct(id, payload) {
  const res = await api.put(`/products/${id}`, payload);
  return res.data;
}
export async function deleteProduct(id) {
  const res = await api.delete(`/products/${id}`);
  return res.data;
}

// Subida múltiple de imágenes -> devuelve objetos con path/url relativo
export async function uploadImages(filesOrFileList) {
  const formData = new FormData();
  const files = Array.from(filesOrFileList);
  for (const f of files) formData.append("file", f);
  const res = await api.post("/uploads", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data; // array de objetos de archivo
}
