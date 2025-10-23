// src/lib/resolveImage.js
import { api } from "./xano";

export const PLACEHOLDER_IMAGE = import.meta.env.VITE_PLACEHOLDER_IMAGE_URL || "/ImagenHome.png";

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
