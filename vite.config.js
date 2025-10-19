import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

// Plugin to use production CSP during build
function productionCSPPlugin() {
  return {
    name: "production-csp",
    buildStart() {
      if (process.env.NODE_ENV === "production") {
        // Read production HTML template
        const productionHtml = readFileSync(
          resolve(__dirname, "index.production.html"),
          "utf-8"
        );
        // Write it as the main index.html for build
        writeFileSync(resolve(__dirname, "index.html"), productionHtml);
      }
    },
    buildEnd() {
      if (process.env.NODE_ENV === "production") {
        // Restore development HTML template
        const devHtml = readFileSync(
          resolve(__dirname, "index.development.html"),
          "utf-8"
        );
        writeFileSync(resolve(__dirname, "index.html"), devHtml);
      }
    },
  };
}

export default defineConfig({
  plugins: [vue(), productionCSPPlugin()],
  base: "/login-practice/",
  build: {
    outDir: "dist",
  },
});
