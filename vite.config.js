import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Asegura que el puerto sea el correcto
  },
  publicDir: 'public', // Asegura que la carpeta public se incluya en la compilación
});
