import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const isStaging = mode === "staging";
  const isProd = mode === "production";

  return {
    plugins: [react(), tailwindcss()],
    base: isStaging ? "/staging/" : "/",
    server: {
      port: 3000,
      open: true,
    },
    define: {
      __APP_ENV__: JSON.stringify(mode),
      __API_BASE_URL__: JSON.stringify(env.VITE_API_BASE_URL),
    },
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    build: {
      sourcemap: !isProd,
      outDir: isStaging ? "dist-staging" : "dist",
    },
  };
});
