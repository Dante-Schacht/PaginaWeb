// src/lib/resolveImage.js
export function getXanoOrigin() {
  const base = import.meta.env.VITE_XANO_BASE_URL || "";
  return base.replace(/\/api.*/i, ""); // quita /api:GroupId
}

export function resolveImageUrl(img) {
  if (!img) return "";
  const origin = getXanoOrigin();

  if (typeof img === "string") {
    return img.startsWith("http") ? img : `${origin}${img}`;
  }

  if (img.url) {
    return img.url.startsWith("http") ? img.url : `${origin}${img.url}`;
  }

  if (img.path) {
    return img.path.startsWith("http") ? img.path : `${origin}${img.path}`;
  }

  // Fallback si Xano sólo entrega id (ajusta si tu grupo usa otra ruta)
  if (img.id) return `${origin}/api:_/file/${img.id}`;

  return "";
}
