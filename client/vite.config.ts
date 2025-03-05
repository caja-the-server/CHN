import react from "@vitejs/plugin-react-swc";
import { defineConfig, ProxyOptions } from "vite";
import svgr from "vite-plugin-svgr";

export default defineConfig(({ mode }) => ({
  plugins: [react(), svgr()],

  ...(mode === "development" &&
    (() => {
      const proxyOption = {
        target: "http://localhost:3001",
        changeOrigin: true,
      } satisfies ProxyOptions;

      return {
        server: {
          proxy: {
            "/api": proxyOption,
            "/cdn": proxyOption,
          },
        },
      };
    })()),
}));
