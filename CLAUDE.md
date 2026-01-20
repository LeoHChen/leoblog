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
- **Comments**: Stored per post slug as `comments-{slug}` containing an array of comment objects. Comments include Google reCAPTCHA v2 support to prevent spam.

To upgrade to a backend solution, replace the localStorage calls in:
- `src/components/LikeButton.astro`
- `src/components/Comments.astro`

#### reCAPTCHA Setup (Optional)

Comments support Google reCAPTCHA v2 to prevent spam. To enable:

1. Get your reCAPTCHA keys at https://www.google.com/recaptcha/admin/create
   - Choose reCAPTCHA v2 ("I'm not a robot" Checkbox)
   - Add your domain(s) (use `localhost` for development)

2. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

3. Add your site key:
   ```
   PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
   ```

4. Restart the dev server

The comment form works without reCAPTCHA configured - it simply won't show the verification checkbox.

**Note**: This implementation validates reCAPTCHA client-side only. For production, consider adding server-side verification via a serverless function to prevent bypass.

#### Content Moderation

Comments include built-in content moderation to filter out inappropriate and spam content. The system automatically blocks:

- **NSFW and inappropriate language**: Profanity, explicit content, etc.
- **Spam patterns**: Excessive repetition, URLs, phone numbers
- **ALL CAPS**: Excessive use of capital letters
- **Too short comments**: Minimum 3 characters required

The moderation runs client-side and provides immediate feedback to users when their comment is blocked. Comments and names are also sanitized to prevent XSS attacks.

**Customizing the Filter**:
- Edit `BLOCKED_WORDS` array in `src/components/Comments.astro` to add/remove blocked words
- Edit `BLOCKED_PATTERNS` to modify regex patterns for detecting inappropriate content

**For Advanced Moderation**:
The `src/utils/content-moderation.ts` file includes an optional AI-based moderation function using OpenAI's Moderation API. To use it:
1. Add `OPENAI_API_KEY` to your environment variables
2. Implement a serverless function to call `moderateContentWithAI()` server-side
3. Update the Comments component to call your API endpoint before saving

### Utilities

- `src/utils/content-moderation.ts` - Content moderation utilities (keyword filtering and optional AI moderation)
- `src/utils/reading-time.ts` - Calculates reading time based on word count (200 words/minute)
- `src/utils/format-date.ts` - Formats dates using Intl.DateTimeFormat

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
