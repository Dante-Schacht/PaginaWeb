# Estructura de Estilos - ElectroVerse

## 📁 Organización de Archivos CSS

Esta carpeta contiene todos los archivos de estilos organizados de manera lógica y mantenible.

### 🎯 Estructura de Carpetas

```
src/styles/
├── components/          # Estilos de componentes reutilizables
│   ├── Header.css       # Navegación y header
│   ├── Footer.css       # Pie de página
│   ├── Logo.css         # Componente de logo
│   ├── ProductCard.css   # Tarjetas de productos
│   └── LoadingSpinner.css # Indicadores de carga
├── pages/              # Estilos específicos de páginas
│   ├── Home.css        # Página principal
│   ├── Productos.css   # Catálogo de productos
│   ├── Blogs.css       # Página de blogs
│   ├── Nosotros.css    # Página sobre nosotros
│   └── Contacto.css    # Página de contacto
└── global/             # Estilos globales
    ├── App.css         # Estilos principales de la aplicación
    └── index.css       # Reset y estilos base
```

## 🎨 Convenciones de Nomenclatura

### Componentes
- **Archivo**: `ComponentName.css`
- **Clases**: `.component-name`, `.component-name__element`, `.component-name--modifier`
- **Ejemplo**: `.product-card`, `.product-card__title`, `.product-card--featured`

### Páginas
- **Archivo**: `PageName.css`
- **Clases**: `.page-name`, `.page-name__section`, `.page-name--theme`
- **Ejemplo**: `.home-page`, `.home-page__hero`, `.home-page--dark`

### Globales
- **Variables CSS**: `:root { --variable-name: value; }`
- **Utilidades**: `.utility-class`
- **Reset**: Estilos base para normalizar navegadores

## 🎯 Principios de Organización

### 1. **Separación de Responsabilidades**
- Cada componente tiene su propio archivo CSS
- Los estilos globales están separados de los específicos
- Las páginas tienen estilos independientes

### 2. **Reutilización**
- Los componentes pueden ser reutilizados en cualquier página
- Los estilos globales se aplican a toda la aplicación
- Variables CSS para consistencia de colores y medidas

### 3. **Mantenibilidad**
- Estructura clara y predecible
- Fácil localización de estilos
- Escalabilidad para futuras funcionalidades

## 🎨 Variables CSS Globales

```css
:root {
  /* Colores principales */
  --primary-color: #9C2007;
  --primary-dark: #701705;
  --primary-darker: #440E03;
  --primary-darkest: #180501;
  
  /* Colores de texto */
  --text-light: #ffffff;
  --text-dark: #333333;
  --text-muted: #666666;
  
  /* Fondos */
  --bg-light: #f8f9fa;
  --bg-white: #ffffff;
  
  /* Sombras */
  --shadow-light: 0 2px 10px rgba(0, 0, 0, 0.1);
  --shadow-medium: 0 4px 15px rgba(0, 0, 0, 0.1);
  --shadow-heavy: 0 8px 25px rgba(0, 0, 0, 0.15);
  
  /* Bordes */
  --border-radius: 0.5rem;
  --border-radius-lg: 1rem;
  
  /* Transiciones */
  --transition: all 0.3s ease;
}
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: `max-width: 576px`
- **Tablet**: `max-width: 768px`
- **Desktop**: `min-width: 769px`

### Estrategia Mobile-First
```css
/* Estilos base (mobile) */
.component {
  font-size: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .component {
    font-size: 1.1rem;
  }
}

/* Desktop */
@media (min-width: 992px) {
  .component {
    font-size: 1.2rem;
  }
}
```

## 🔧 Mejores Prácticas

### 1. **Especificidad**
- Usar clases en lugar de IDs
- Evitar `!important` cuando sea posible
- Mantener especificidad baja

### 2. **Performance**
- Usar `transform` y `opacity` para animaciones
- Minimizar reflows y repaints
- Optimizar imágenes y fuentes

### 3. **Accesibilidad**
- Contraste adecuado en colores
- Tamaños de fuente legibles
- Estados de focus visibles

### 4. **Consistencia**
- Usar variables CSS para colores y medidas
- Mantener convenciones de nomenclatura
- Documentar estilos complejos

## 🚀 Futuras Mejoras

- [ ] Implementar CSS Modules
- [ ] Agregar preprocesador (Sass/Less)
- [ ] Implementar CSS-in-JS
- [ ] Agregar linting de CSS
- [ ] Optimizar para performance
- [ ] Implementar dark mode
