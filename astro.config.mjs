import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import keystatic from '@keystatic/astro';

// https://astro.build/config
export default defineConfig({
  site: 'https://voice.plausiblepotentials.com',
  output: 'hybrid',
  adapter: cloudflare({
    imageService: 'cloudflare',
  }),
  integrations: [
    mdx(),
    sitemap(),
    keystatic(),
  ],
});
