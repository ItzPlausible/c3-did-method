import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import keystatic from "@keystatic/astro";

// https://astro.build/config
export default defineConfig({
  site: "https://voice.plausiblepotentials.com",
  output: "static",
  adapter: cloudflare({
    imageService: "cloudflare",
    sessions: false,
  }),
  integrations: [mdx(), sitemap(), keystatic()],
});
