// src/lib/resolveImage.js
import { api } from "./xano";

export const PLACEHOLDER_IMAGE = import.meta.env.VITE_PLACEHOLDER_IMAGE_URL ||
  'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#adb5bd" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">\n  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="#f8f9fa"/>\n  <path d="M8.5 12.5l3 3 4-5 3.5 4.5"/>\n  <circle cx="8" cy="8" r="2"/>\n  <line x1="3" y1="3" x2="21" y2="21" stroke="#ced4da"/>\n</svg>'
  );
export const BAD_IMAGE_PATTERNS = (import.meta.env.VITE_BAD_IMAGE_PATTERNS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export function getXanoOrigin() {
  // Usa .env si está, sino cae al baseURL del axios api
  const base = import.meta.env.VITE_XANO_BASE_URL || api?.defaults?.baseURL || "";
  return base.replace(/\/api.*/i, ""); // quita /api:GroupId
}

export function resolveImageUrl(img) {
  if (!img) {
    console.warn('resolveImageUrl: img vacío o nulo', img);
    return PLACEHOLDER_IMAGE;
  }
  const origin = getXanoOrigin();
  let url = "";

  if (typeof img === "string") {
    url = img.startsWith("http") ? img : `${origin}${img}`;
  } else if (img.url) {
    url = img.url.startsWith("http") ? img.url : `${origin}${img.url}`;
  } else if (img.path) {
    url = img.path.startsWith("http") ? img.path : `${origin}${img.path}`;
  } else if (img.id) {
    // Fallback si Xano sólo entrega id (ajusta si tu grupo usa otra ruta)
    url = `${origin}/api:_/file/${img.id}`;
  }

  if (!url) {
    console.warn('resolveImageUrl: no se pudo resolver URL, usando placeholder', { img, origin });
    return PLACEHOLDER_IMAGE;
  } else {
    console.debug('resolveImageUrl: resuelta', { input: img, resolved: url, origin });
  }
  return url;
}

export function isUnwantedImage(img) {
  if (!img) return false;
  const candidate = typeof img === 'string' ? img : img.url || img.path || '';
  if (!candidate) return false;
  const lower = candidate.toLowerCase();
  const defaultPatterns = [
    'imagenhome.png',
    'placeholder',
    'sin-imagen',
    'no-image',
    'default',
    'sample',
    'stock',
    'prueba'
  ];
  if (defaultPatterns.some((p) => lower.includes(p))) return true;
  if (BAD_IMAGE_PATTERNS.length && BAD_IMAGE_PATTERNS.some((p) => lower.includes(p.toLowerCase()))) return true;
  return false;
}
