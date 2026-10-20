import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  // basicSsl gera um certificado https local automaticamente.
  // Necessario para o Web Bluetooth funcionar no celular (Chrome exige https).
  plugins: [react(), basicSsl()],
  server: {
    port: 3000,
    host: true,
    // Proxy: tudo que o site pedir em /api vai para a API do Spring.
    // Assim o site (https) fala com a API pelo MESMO endereco, evitando
    // o bloqueio de "mixed content" (https -> http).
    proxy: {
      '/api': {
        target: 'http://localhost:9090',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
