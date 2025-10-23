// src/lib/resolveImage.js
import { api } from "./xano";

export function getXanoOrigin() {
  // Usa .env si está, sino cae al baseURL del axios api
  const base = import.meta.env.VITE_XANO_BASE_URL || api?.defaults?.baseURL || "";
  return base.replace(/\/api.*/i, ""); // quita /api:GroupId
}

export function resolveImageUrl(img) {
  if (!img) {
    console.warn('resolveImageUrl: img vacío o nulo', img);
    return "";
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
    console.warn('resolveImageUrl: no se pudo resolver URL', { img, origin });
  } else {
    console.debug('resolveImageUrl: resuelta', { input: img, resolved: url, origin });
  }
  return url;
}
