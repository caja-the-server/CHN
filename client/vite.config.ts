import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig, ProxyOptions } from "vite";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => ({
  plugins: [react(), svgr(), tsconfigPaths()],
  resolve: {
    alias: {
      "@styles": path.resolve("src/styles"),
    },
  },

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
