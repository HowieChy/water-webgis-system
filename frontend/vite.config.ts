import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Vite 配置文件
export default defineConfig({
  plugins: [
    react(), // React 插件
    tailwindcss(), // Tailwind CSS v4 Vite 插件
  ],
  server: {
    // 开发服务器代理配置
    proxy: {
      // 代理 /api 请求到后端服务器
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      // 代理 /auth 请求到后端服务器
      "/auth": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
