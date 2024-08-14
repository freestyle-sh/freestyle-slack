import { defineConfig } from "astro/config";
import deno from "freestyle-deno-astro-adapter";
import svelte from "@astrojs/svelte";
import react from "@astrojs/react";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  adapter: deno(),
  integrations: [svelte(), react(), tailwind()],
  output: "server",
  vite: {
    esbuild: {
      target: "esnext",
      format: "esm",
      platform: "node",
      keepNames: true
    }
  }
});