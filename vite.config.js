import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Fuerza el servidor a usar el puerto 5173.
// strictPort evita que se cambie automáticamente a otro puerto.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    host: true,
  },
  preview: {
    port: 5173,
    strictPort: true,
    host: true,
  },
})
