import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    proxy: {
      "/api/v1": {
        target: "http://localhost:5002",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/v1/, "/api/v1"),
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("Proxy error:", err);
            // If primary port fails, try alternate port
            proxy.web(_req, _res, {
              target: "http://localhost:5003",
            });
          });
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    chunkSizeWarningLimit: 1600,
  },
});
