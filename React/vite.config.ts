import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.png"],
      manifest: {
        name: "PyDuiten",
        short_name: "PyDuiten",
        description: "Atur Keuangan Lu, Gak Pake Pusing.",
        theme_color: "#E07A5F",
        background_color: "#F4F1DE",
        display: "standalone",
        icons: [
          {
            src: "favicon.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "favicon.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
