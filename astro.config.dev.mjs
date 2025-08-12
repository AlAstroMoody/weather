// @ts-check
import { defineConfig } from "astro/config";

import vue from "@astrojs/vue";

// https://astro.build/config
export default defineConfig({
  site: "http://localhost:4321",
  base: "/",
  integrations: [vue()],
  devToolbar: {
    enabled: true,
  },
});
