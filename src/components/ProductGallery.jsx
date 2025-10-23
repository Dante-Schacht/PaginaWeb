// src/components/ProductGallery.jsx
import { useMemo, useState } from "react";
import { resolveImageUrl } from "../lib/resolveImage";

export default function ProductGallery({ product }) {
  const images = useMemo(() => {
    const raw = Array.isArray(product?.images) ? product.images : [];
    const resolved = raw
      .map((it) => resolveImageUrl(it))
      .filter((u) => typeof u === "string" && u.length > 0);
    console.debug('ProductGallery: imágenes resueltas', {
      id: product?.id,
      name: product?.name,
      raw,
      resolved
    });
    return resolved;
  }, [product]);

  const [active, setActive] = useState(0);
  const has = images.length > 0;
  const current = has ? images[active] : null;

  return (
    <div className="gallery">
      <div className="gallery-main card">
        {has ? (
          <img
            src={current}
            alt={product?.name || "Producto"}
            style={{ width: "100%", aspectRatio: "1/1", objectFit: "contain", borderRadius: 12 }}
            onError={(e) => {
              console.error('ProductGallery: error cargando imagen principal', {
                id: product?.id,
                name: product?.name,
                src: e.currentTarget?.src,
                activeIndex: active
              });
            }}
          />
        ) : (
          <div className="empty">
            <p>Sin imagen disponible</p>
            <small>{product?.name}</small>
          </div>
        )}
      </div>

      {has && (
        <div className="thumbs row g-2 mt-3">
          {images.map((url, i) => (
            <div className="col-auto" key={i}>
              <button
                type="button"
                className={`btn ${i === active ? "btn-dark" : "btn-light"}`}
                onClick={() => setActive(i)}
                aria-label={`Miniatura ${i + 1}`}
                title={`Imagen ${i + 1} de ${images.length}`}
              >
                <img
                  src={url}
                  alt={`Miniatura ${i + 1}`}
                  style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8 }}
                  loading="lazy"
                  onError={(e) => {
                    console.error('ProductGallery: error cargando miniatura', {
                      id: product?.id,
                      name: product?.name,
                      src: e.currentTarget?.src,
                      index: i
                    });
                  }}
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
