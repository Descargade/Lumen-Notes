import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },

  build: {
    outDir: "dist",
    emptyOutDir: true,
  },

  server: {
    port: Number(process.env.PORT) || 3000,
    host: "0.0.0.0",
  },
});
