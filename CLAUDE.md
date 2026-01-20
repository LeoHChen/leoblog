# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Leo's personal blog built with Astro, featuring a minimal black and white design with system fonts. The blog supports posts with tags, likes, comments, a tag cloud, and a calendar archive.

## Commands

### Development
```bash
npm run dev       # Start development server (http://localhost:4321)
npm run build     # Build for production (runs type checking first)
npm run preview   # Preview production build locally
```

## Architecture

### Content Collections

Blog posts are managed through Astro's Content Collections in `src/content/blog/`. Each post is a Markdown file with frontmatter:

```yaml
---
title: 'Post Title'
description: 'Post description'
pubDate: 2026-01-15
tags: ['tag1', 'tag2']
---
```

The schema is defined in `src/content/config.ts` and provides type safety for all blog posts.

### Routing

- `/` - Homepage with recent posts, tag cloud, and calendar
- `/blog/[slug]` - Individual post pages with reading time, likes, and comments
- `/tags/[tag]` - Posts filtered by tag
- `/about` - About page

### Interactive Features

Likes and comments use localStorage for client-side persistence. This is a simple implementation suitable for personal blogs without backend infrastructure:

- **Likes**: Stored per post slug as `like-{slug}` and `like-count-{slug}`
- **Comments**: Stored per post slug as `comments-{slug}` containing an array of comment objects

To upgrade to a backend solution, replace the localStorage calls in:
- `src/components/LikeButton.astro`
- `src/components/Comments.astro`

### Utilities

- `src/utils/reading-time.ts` - Calculates reading time based on word count (200 words/minute)
- `src/utils/format-date.ts` - Formats dates using Intl.DateTimeFormat

### Design System

The design is implemented entirely in the `BaseLayout.astro` file using CSS custom properties:

- System font stack for optimal native rendering
- Black and white color scheme
- Consistent spacing using CSS variables (`--spacing-xs` to `--spacing-xl`)
- No external dependencies or CSS frameworks

## Adding New Posts

Create a new `.md` file in `src/content/blog/`:

```bash
touch src/content/blog/my-new-post.md
```

Add frontmatter and content following the schema defined in `src/content/config.ts`.
