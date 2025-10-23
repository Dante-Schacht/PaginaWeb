import { useState, useEffect } from 'react';

const useImageLoader = (src, fallback = null) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src) {
      console.warn('useImageLoader: src vacío o nulo', { src, fallback });
      setImageSrc(fallback);
      setIsLoading(false);
      return;
    }

    console.debug('useImageLoader: iniciando carga', { src, fallback });
    setIsLoading(true);
    setHasError(false);

    const img = new Image();
    
    img.onload = () => {
      console.debug('useImageLoader: carga exitosa', { src });
      setImageSrc(src);
      setIsLoading(false);
      setHasError(false);
    };

    img.onerror = (e) => {
      console.error('useImageLoader: error cargando imagen', { src, fallback, error: e });
      setImageSrc(fallback);
      setIsLoading(false);
      setHasError(true);
    };

    img.src = src;
  }, [src, fallback]);

  return { imageSrc, isLoading, hasError };
};

export default useImageLoader;
