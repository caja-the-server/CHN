import react from "@vitejs/plugin-react-swc";
import { defineConfig, ProxyOptions } from "vite";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => ({
  plugins: [react(), svgr(), tsconfigPaths()],

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
