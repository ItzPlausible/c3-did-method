# Voice | Plausible Potentials

Sovereignty-first publishing platform for Plausible Potentials Consulting DAO and the C3 Alliance.

## Stack

- **[Astro](https://astro.build)** - Content-focused web framework
- **[Keystatic](https://keystatic.com)** - Git-based CMS
- **[Cloudflare Pages](https://pages.cloudflare.com)** - Edge deployment

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Content Management

Access the Keystatic admin UI at `/keystatic` when running locally or in development.

### Creating Posts

Posts are stored as MDX files in `src/content/posts/`. You can create them:

1. Through the Keystatic UI at `/keystatic`
2. Directly as `.mdx` files with frontmatter

### Frontmatter Schema

```yaml
---
title: "Post Title"
description: "Brief description"
pubDate: 2026-01-23
updatedDate: 2026-01-24 # optional
heroImage: "/images/posts/my-image.jpg" # optional
author: "JW"
category: "c3-alliance" # see categories below
tags: ["tag1", "tag2"]
draft: false
---
```

### Categories

- `c3-alliance`
- `cyber-mutualism`
- `cooperative-economics`
- `blockchain-governance`
- `sovereignty`
- `technical`
- `announcements`

## Deployment

This site deploys automatically to Cloudflare Pages via GitHub integration.

### Manual Deployment

```bash
npm run build
npx wrangler pages deploy dist
```

## Design System

The site uses the **Barbre family crest palette**:

| Color | Hex | Usage |
|-------|-----|-------|
| Crimson | `#9B1B30` | Primary accent |
| Royal Blue | `#1E3A5F` | Secondary, headings |
| Purple | `#4A1942` | Accent alt |
| Gold | `#C9A227` | Highlights, links |

### Fonts

- **Playfair Display** - Headlines
- **Source Sans 3** - Body text
- **Great Vibes** - Signature/brand elements

## License

Content © Plausible Potentials Consulting DAO LLC. All rights reserved.

---

*Sovereignty-first.*
